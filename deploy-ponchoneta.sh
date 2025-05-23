#!/bin/bash
# deploy-ponchoneta.sh
# Script para despliegue automático de Ponchoneta Store en AWS (CloudFormation + RDS + EC2 + ALB)

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}--- Iniciando despliegue Ponchoneta Fútbol ---${NC}"

# Verificar AWS CLI configurado
echo -e "\n${YELLOW}Verificando AWS CLI...${NC}"
if ! aws sts get-caller-identity > /dev/null 2>&1; then
  echo -e "${RED}AWS CLI no configurado. Ejecuta 'aws configure' con credenciales válidas.${NC}"
  exit 1
fi
echo -e "${GREEN}AWS CLI configurado correctamente.${NC}"

# Verificar Node.js
echo -e "\n${YELLOW}Verificando Node.js...${NC}"
if ! command -v node > /dev/null 2>&1; then
  echo -e "${RED}Node.js no encontrado. Instálalo antes de continuar.${NC}"
  exit 1
fi
echo -e "${GREEN}Node.js detectado: $(node -v)${NC}"

# Set región AWS por defecto
AWS_REGION="us-east-1"
export AWS_DEFAULT_REGION=$AWS_REGION

# Parámetros base de datos y despliegue
DB_NAME="ponchonetaDB"
DB_USER="admin"

# Despliegue VPC
echo -e "\n${YELLOW}Desplegando VPC...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/vpc.yaml \
  --stack-name ponchoneta-vpc \
  --capabilities CAPABILITY_NAMED_IAM

VPC_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-vpc --query "Stacks[0].Outputs[?OutputKey=='PonchonetaVPC'].OutputValue" --output text)
SUBNET1=$(aws cloudformation describe-stacks --stack-name ponchoneta-vpc --query "Stacks[0].Outputs[?OutputKey=='PonchonetaPublicSubnet1'].OutputValue" --output text)
SUBNET2=$(aws cloudformation describe-stacks --stack-name ponchoneta-vpc --query "Stacks[0].Outputs[?OutputKey=='PonchonetaPublicSubnet2'].OutputValue" --output text)

if [ -z "$VPC_ID" ] || [ -z "$SUBNET1" ] || [ -z "$SUBNET2" ]; then
  echo -e "${RED}No se pudieron obtener outputs de la VPC. Abortando.${NC}"
  exit 1
fi
echo -e "${GREEN}VPC y subnets desplegadas.${NC}"

# Despliegue Security Groups
echo -e "\n${YELLOW}Desplegando Security Groups...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/security-groups.yaml \
  --stack-name ponchoneta-sg \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides VPCID=$VPC_ID

APP_SG_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-sg --query "Stacks[0].Outputs[?OutputKey=='PonchonetaAppSecurityGroup'].OutputValue" --output text)
RDS_SG_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-sg --query "Stacks[0].Outputs[?OutputKey=='PonchonetaRDSSecurityGroup'].OutputValue" --output text)
ALB_SG_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-sg --query "Stacks[0].Outputs[?OutputKey=='PonchonetaALBSecurityGroup'].OutputValue" --output text)

if [ -z "$APP_SG_ID" ] || [ -z "$RDS_SG_ID" ] || [ -z "$ALB_SG_ID" ]; then
  echo -e "${RED}No se pudieron obtener IDs de Security Groups. Abortando.${NC}"
  exit 1
fi
echo -e "${GREEN}Security Groups desplegados.${NC}"

# Solicitar contraseña para RDS
read -sp "Ingresa la contraseña para el usuario RDS '$DB_USER': " DB_PASSWORD
echo

# Despliegue RDS MySQL
echo -e "\n${YELLOW}Desplegando base de datos RDS MySQL...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/rds.yaml \
  --stack-name ponchoneta-db \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VPC=$VPC_ID \
    Subnet1=$SUBNET1 \
    Subnet2=$SUBNET2 \
    DBName=$DB_NAME \
    DBUsername=$DB_USER \
    DBPassword="$DB_PASSWORD" \
    AppSecurityGroupForDBAccess=$APP_SG_ID \
    RDSSecurityGroup=$RDS_SG_ID

DB_ENDPOINT=$(aws cloudformation describe-stacks --stack-name ponchoneta-db --query "Stacks[0].Outputs[?OutputKey=='PonchonetaDBEndpoint'].OutputValue" --output text)
if [ -z "$DB_ENDPOINT" ]; then
  echo -e "${RED}No se pudo obtener el endpoint RDS. Abortando.${NC}"
  exit 1
fi
echo -e "${GREEN}Base de datos RDS creada. Endpoint: $DB_ENDPOINT${NC}"

# Despliegue Application Load Balancer (ALB)
echo -e "\n${YELLOW}Desplegando Application Load Balancer...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/alb.yaml \
  --stack-name ponchoneta-alb \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VPC=$VPC_ID \
    Subnet1=$SUBNET1 \
    Subnet2=$SUBNET2 \
    ALBSecurityGroup=$ALB_SG_ID

TARGET_GROUP_ARN=$(aws cloudformation describe-stacks --stack-name ponchoneta-alb --query "Stacks[0].Outputs[?OutputKey=='PonchonetaTargetGroup'].OutputValue" --output text)
ALB_DNS_NAME=$(aws cloudformation describe-stacks --stack-name ponchoneta-alb --query "Stacks[0].Outputs[?OutputKey=='PonchonetaALBDNS'].OutputValue" --output text)

if [ -z "$TARGET_GROUP_ARN" ] || [ -z "$ALB_DNS_NAME" ]; then
  echo -e "${RED}No se pudieron obtener outputs ALB. Abortando.${NC}"
  exit 1
fi
echo -e "${GREEN}Application Load Balancer creado.${NC}"

# Despliegue Auto Scaling Group y EC2
echo -e "\n${YELLOW}Desplegando Auto Scaling Group y EC2 (backend + frontend)...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/ec2-autoscaling.yaml \
  --stack-name ponchoneta-app \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VPC=$VPC_ID \
    Subnet1=$SUBNET1 \
    Subnet2=$SUBNET2 \
    AppSecurityGroup=$APP_SG_ID \
    TargetGroup=$TARGET_GROUP_ARN \
    DBEndpoint=$DB_ENDPOINT \
    DBName=$DB_NAME \
    DBUser=$DB_USER \
    DBPasswordValue="$DB_PASSWORD"

echo -e "\n${GREEN}--- ¡DESPLIEGUE COMPLETO! ---${NC}"
echo -e "La aplicación estará disponible en: ${YELLOW}http://$ALB_DNS_NAME${NC}"
echo -e "Espera unos minutos para que las instancias EC2 se inicien y se registren en el Target Group."
