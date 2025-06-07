# https://github.com/felipevelasco7/PonchonetaStore.git


# Ponchoneta Fútbol - Despliegue Completo en AWS

Este repositorio contiene el código fuente y las plantillas CloudFormation para desplegar la aplicación Ponchoneta Fútbol en AWS con:

- VPC y Subnets públicas/privadas
- Grupos de seguridad (SG) configurados para app, base de datos y ALB
- Base de datos RDS MySQL para productos y órdenes
- Application Load Balancer con Health Checks
- Auto Scaling Group con instancias EC2 que corren backend Node.js y frontend estático

---
## Pasos para desplegar App
1. Crear llave con el nombre "llave"
2. Correr estos comandos:
```bash

git clone https://github.com/felipevelasco7/PonchonetaStore.git
cd PonchonetaStore
chmod +x script.sh
./script.sh
```
# Confirmar el correo
# Para simular la carga del CPU
# Conectarse por SSH
```bash
chmod 400 llave.pem
ssh -i llave.pem ec2-user@54.227.53.62 #Reemplazar IPs
```
# simular estress
```bash
yes > /dev/null &
yes > /dev/null &
```


# Actualizar la URL de wompi para simular pagos
Copiar la URL de la pagina web y pegarla en wompi para obtener las llaves publicas, privadas y secreta


## Otros comandos

# Para cambiar las llaves, desde una instancia EC2 por ssh
```bash
cd app/back/.env
sudo vim .env

#vvGV d para borrar todo en el archivo con vim, despues 'i' para insertar y pegar lo siguiente:

DB_HOST=
DB_USER=poncho
DB_PASSWORD=password
DB_NAME=ponchonetaDB

WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_SECRET_KEY=
```


# Matar proceso Node.js actual
```bash

sudo pkill node
# Dar permisos
sudo chmod 777 /home/ec2-user/server.log

# Reiniciar backend
nohup node server.js > /home/ec2-user/server.log 2>&1 &

# Para conseguir las ip publicas de las instancias
aws ec2 describe-instances \
--query 'Reservations[*].Instances[*].[InstanceId, Tags[?Key==`Name`]|[0].Value, PublicIpAddress]' \
--output table

# Conectarse por SSH
chmod 400 llave.pem
ssh -i llave.pem ec2-user@54.227.53.62

# apagar back
sudo pkill node

# Reiniciar back

nohup node server.js
# mirar logs
tail -f /home/ec2-user/nohup.out

# simular estress
yes > /dev/null &
yes > /dev/null &

```

# Numero nequi de prueba 3991111111



# Pruebas locales

```bash
node server.js
mysql -u poncho -p
brew services list
brew services start mysql
ngrok http 3000
pegar la url en wompi
```

para la prueba de la pasarela: ngrok http 3000
202 carrito.js llaves de wompi