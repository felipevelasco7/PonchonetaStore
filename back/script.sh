#!/bin/bash

#git clone https://github.com/felipevelasco7/PonchonetaStore.git
#cd PonchonetaStore


set -e

# === Configuraciones iniciales ===
REGION="us-east-1"
KEY_NAME="llave"  # Reemplaza con el nombre real de tu par de llaves SSH en EC2
DB_USERNAME="poncho"
DB_PASSWORD="password"
EMAIL_ALERT="felipevelasco753@gmail.com"

# === Stack 1: Infraestructura (VPC, Subnets, IGW...) ===
echo "Creando stack: WebAppNetwork"
aws cloudformation deploy \
  --stack-name WebAppNetwork \
  --template-file cloudformation/infraestructura.yaml \
  --region $REGION \
  --parameter-overrides KeyName=$KEY_NAME \
  --capabilities CAPABILITY_NAMED_IAM

echo "Esperando que WebAppNetwork finalice..."
aws cloudformation wait stack-create-complete \
  --stack-name WebAppNetwork \
  --region $REGION
echo "✅ WebAppNetwork creado correctamente."

# === Stack 2: Base de datos RDS ===
echo "Creando stack: WebAppDatabase"
aws cloudformation deploy \
  --stack-name WebAppDatabase \
  --template-file cloudformation/db.yml \
  --region $REGION \
  --parameter-overrides \
      DBUsername=$DB_USERNAME \
      DBPassword=$DB_PASSWORD \
      NetworkStackName=WebAppNetwork \
  --capabilities CAPABILITY_NAMED_IAM

echo "Esperando que WebAppDatabase finalice..."
aws cloudformation wait stack-create-complete \
  --stack-name WebAppDatabase \
  --region $REGION
echo "✅ WebAppDatabase creado correctamente."

# === Stack 3: Aplicación (EC2, ALB, AutoScaling, SNS, CloudWatch) ===
# Obtener el endpoint del RDS exportado
echo "Obteniendo endpoint del RDS..."
RDS_HOST=$(aws cloudformation list-exports --query "Exports[?Name=='WebAppDatabase-RDSHost'].Value" --output text --region $REGION)
echo $RDS_HOST

echo "Creando stack: WebAppApp"
aws cloudformation deploy \
  --stack-name WebAppApp \
  --template-file cloudformation/app.yml \
  --region $REGION \
  --parameter-overrides \
      KeyName=$KEY_NAME \
      NetworkStackName=WebAppNetwork \
      DBPassword=$DB_PASSWORD \
      RDSHost=$RDS_HOST \
  --capabilities CAPABILITY_NAMED_IAM

echo "Esperando que WebAppApp finalice..."
aws cloudformation wait stack-create-complete \
  --stack-name WebAppApp \
  --region $REGION
echo "✅ WebAppApp creado correctamente."

# === Mostrar salida final del ALB URL ===
APP_URL=$(aws cloudformation describe-stacks \
  --stack-name WebAppApp \
  --query "Stacks[0].Outputs[?OutputKey=='ALBURL'].OutputValue" \
  --output text \
  --region $REGION)

echo "¡Todo listo! Tu aplicación está disponible en:"
echo "$APP_URL"
echo "Cambiar las llaves de wompi si es necesario:"
echo "Instancias actuales:"
aws ec2 describe-instances \
--query 'Reservations[*].Instances[*].[InstanceId, Tags[?Key==`Name`]|[0].Value, PublicIpAddress]' \
--output table