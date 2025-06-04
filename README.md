README.md corregido y mejorado para tu proyecto
para la prueba de la pasarela: ngrok http 3000 
202 carrito.js llaves de wompi

# Ponchoneta Fútbol - Despliegue Completo en AWS

Este repositorio contiene el código fuente y las plantillas CloudFormation para desplegar la aplicación Ponchoneta Fútbol en AWS con:

- VPC y Subnets públicas/privadas
- Grupos de seguridad (SG) configurados para app, base de datos y ALB
- Base de datos RDS MySQL para productos y órdenes
- Application Load Balancer con Health Checks
- Auto Scaling Group con instancias EC2 que corren backend Node.js y frontend estático

---

## Requisitos Previos

1. Tener AWS CLI configurado con credenciales válidas y permisos para los servicios necesarios:

```bash
aws configure
```
Tener Node.js y Git instalados (CloudShell los incluye por defecto).

El repositorio debe estar clonado localmente o en CloudShell antes de correr el script.

Despliegue automático paso a paso
Desde la terminal, en la raíz del repositorio:

```bash
chmod +x deploy-ponchoneta.sh

./deploy-ponchoneta.sh

```






## FUNCIONA TODO DESDE AQUI
Despliega el stack de network (infraestructura.yml)
WebAppNetwork

Despliega este stack primero (el de la base de datos).
WebAppDatabase

*copiar el RDS ENDPOINT de los outputs de la base de datos*
Luego despliega el stack de la aplicación, que ya está preparado para importar WebAppDatabase-RDSHost.
El script de inicialización (UserData) clonará el repositorio, instalará dependencias y cargará el archivo SQL ponchonetaDB.sql.

WebApp

Copiar la URL de la pagina web y pegarla en wompi para obtener las llaves publicas, privadas y secreta

conectarse por ssh a la instancia para cambiar las llaves
# Mueve el archivo a la carpeta .ssh y aplica permisos
mkdir -p ~/.ssh
mv ~/Downloads/kp2.pem ~/.ssh/
chmod 400 ~/.ssh/kp2.pem

# Conéctate a tu instancia EC2
ssh -i ~/.ssh/kp2.pem ec2-user@<IP-DE-TU-EC2>

# Una vez dentro de la instancia
cd /home/ec2-user/app/back

# Abre el archivo .env con nano (si no existe, se creará)
sudo vim .env

DB_HOST=webappdatabase-mysqldatabase-jbxdn1uk9jte.cyj8jzmzehgy.us-east-1.rds.amazonaws.com
DB_USER=poncho
DB_PASSWORD=password
DB_NAME=ponchonetaDB

WOMPI_PUBLIC_KEY='pub_test_7OBPgywA4RKSR7r3HiLFdZk6D3iTcV8I'
WOMPI_PRIVATE_KEY='prv_test_TEzadcH5GpXBbMfyToyus0KyLlHNmdw4'
WOMPI_SECRET_KEY='test_integrity_yrxAsjSsxDCXWJwxJURuxwxxiAWxZHGU'


# Matar proceso Node.js actual
sudo pkill node

# Dar permisos
sudo chmod 777 /home/ec2-user/server.log

# Reiniciar backend
nohup node server.js > /home/ec2-user/server.log 2>&1 &


# Numero nequi 3991111111