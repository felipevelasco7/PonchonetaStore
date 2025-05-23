#!/bin/bash
# deploy-ponchoneta.sh
# Script para desplegar la infraestructura completa y la app Ponchoneta Fútbol en AWS CloudShell

set -e

# Colores para logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}--- Iniciando Despliegue de Ponchoneta Fútbol ---${NC}"

# Paso 1: Clonar repositorio
echo -e "\n${YELLOW}Clonando repositorio Ponchoneta Store...${NC}"
git clone https://github.com/tu_usuario/Ponchoneta-Store.git
cd Ponchoneta-Store

# Paso 2: Desplegar VPC
echo -e "\n${YELLOW}Paso 1: Creando la VPC (ponchoneta-vpc)...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/vpc.yaml \
  --stack-name ponchoneta-vpc \
  --capabilities CAPABILITY_NAMED_IAM
echo -e "${GREEN}VPC creada exitosamente.${NC}"

VPC_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-vpc --query "Stacks[0].Outputs[?OutputKey=='PonchonetaVPC'].OutputValue" --output text)
SUBNET1=$(aws cloudformation describe-stacks --stack-name ponchoneta-vpc --query "Stacks[0].Outputs[?OutputKey=='PonchonetaPublicSubnet1'].OutputValue" --output text)
SUBNET2=$(aws cloudformation describe-stacks --stack-name ponchoneta-vpc --query "Stacks[0].Outputs[?OutputKey=='PonchonetaPublicSubnet2'].OutputValue" --output text)

if [ -z "$VPC_ID" ] || [ -z "$SUBNET1" ] || [ -z "$SUBNET2" ]; then
  echo -e "${RED}Error obteniendo outputs VPC. Abortando.${NC}"
  exit 1
fi
echo "VPC ID: $VPC_ID, Subnet1: $SUBNET1, Subnet2: $SUBNET2"

# Paso 3: Crear Security Groups
echo -e "\n${YELLOW}Paso 2: Creando Grupos de Seguridad (ponchoneta-sg)...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/security-groups.yaml \
  --stack-name ponchoneta-sg \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides VPCID=$VPC_ID
echo -e "${GREEN}Security Groups creados.${NC}"

APP_SG_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-sg --query "Stacks[0].Outputs[?OutputKey=='PonchonetaAppSecurityGroup'].OutputValue" --output text)
RDS_SG_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-sg --query "Stacks[0].Outputs[?OutputKey=='PonchonetaRDSSecurityGroup'].OutputValue" --output text)
ALB_SG_ID=$(aws cloudformation describe-stacks --stack-name ponchoneta-sg --query "Stacks[0].Outputs[?OutputKey=='PonchonetaALBSecurityGroup'].OutputValue" --output text)

if [ -z "$APP_SG_ID" ] || [ -z "$RDS_SG_ID" ] || [ -z "$ALB_SG_ID" ]; then
  echo -e "${RED}Error obteniendo IDs de Security Groups. Abortando.${NC}"
  exit 1
fi
echo "App SG ID: $APP_SG_ID, RDS SG ID: $RDS_SG_ID, ALB SG ID: $ALB_SG_ID"

# Paso 4: Crear RDS MySQL
echo -e "\n${YELLOW}Paso 3: Creando Base de Datos RDS (ponchoneta-db)...${NC}"
DB_NAME="ponchonetaDB"
DB_USER="poncho"
read -sp "Ingrese la contraseña para el usuario RDS '$DB_USER': " DB_PASSWORD
echo

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
echo -e "${GREEN}RDS creada exitosamente.${NC}"

DB_ENDPOINT=$(aws cloudformation describe-stacks --stack-name ponchoneta-db --query "Stacks[0].Outputs[?OutputKey=='PonchonetaDBEndpoint'].OutputValue" --output text)
if [ -z "$DB_ENDPOINT" ]; then
  echo -e "${RED}Error obteniendo endpoint RDS. Abortando.${NC}"
  exit 1
fi
echo "RDS Endpoint: $DB_ENDPOINT"

# Paso 5: Crear ALB
echo -e "\n${YELLOW}Paso 4: Creando Application Load Balancer (ponchoneta-alb)...${NC}"
aws cloudformation deploy \
  --template-file cloudformation/alb.yaml \
  --stack-name ponchoneta-alb \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    VPC=$VPC_ID \
    Subnet1=$SUBNET1 \
    Subnet2=$SUBNET2 \
    ALBSecurityGroup=$ALB_SG_ID
echo -e "${GREEN}ALB creada exitosamente.${NC}"

TARGET_GROUP_ARN=$(aws cloudformation describe-stacks --stack-name ponchoneta-alb --query "Stacks[0].Outputs[?OutputKey=='PonchonetaTargetGroup'].OutputValue" --output text)
ALB_DNS_NAME=$(aws cloudformation describe-stacks --stack-name ponchoneta-alb --query "Stacks[0].Outputs[?OutputKey=='PonchonetaALBDNS'].OutputValue" --output text)

if [ -z "$TARGET_GROUP_ARN" ] || [ -z "$ALB_DNS_NAME" ]; then
  echo -e "${RED}Error obteniendo outputs ALB. Abortando.${NC}"
  exit 1
fi
echo "Target Group ARN: $TARGET_GROUP_ARN"
echo "ALB DNS: http://$ALB_DNS_NAME"

# Paso 6: Crear Auto Scaling Group + EC2
echo -e "\n${YELLOW}Paso 5: Creando Auto Scaling Group y EC2 (ponchoneta-app)...${NC}"
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
echo -e "${GREEN}Auto Scaling Group y EC2 creados exitosamente.${NC}"

echo -e "\n${GREEN}--- ¡DESPLIEGUE COMPLETO! ---${NC}"
echo -e "La aplicación estará disponible en: ${YELLOW}http://$ALB_DNS_NAME${NC}"
echo -e "Espera a que las instancias EC2 inicien y se registren en el Target Group."
