README.md corregido y mejorado para tu proyecto
markdown
Copy
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
chmod +x scripts/deploy-ponchoneta.sh

./scripts/deploy-ponchoneta.sh

```
El script solicitará la contraseña para el usuario administrador de RDS.

El script desplegará todos los recursos en el orden correcto.

Al final mostrará la URL pública de la app para acceder.

Verificar la aplicación
Esperar unos minutos para que EC2 se inicialicen y se registren en el Target Group.

Visitar el URL del ALB que imprime el script.

El backend está configurado para servir el frontend estático y exponer APIs.

Desarrollo y ajustes
Puedes editar el backend en backend/ y frontend en front/.

Las plantillas CloudFormation están en cloudformation/.

El script automatiza el despliegue completo.

Limpieza de recursos
Para eliminar todo lo creado, ejecuta el script de limpieza:


Elimina los stacks uno por uno desde la consola de CloudFormation o usando AWS CLI en este orden:
```bash
# aws cloudformation delete-stack --stack-name ponchoneta-app
# aws cloudformation wait stack-delete-complete --stack-name ponchoneta-app
# aws cloudformation delete-stack --stack-name ponchoneta-alb
# aws cloudformation wait stack-delete-complete --stack-name ponchoneta-alb
# aws cloudformation delete-stack --stack-name ponchoneta-db
# aws cloudformation wait stack-delete-complete --stack-name ponchoneta-db
# aws cloudformation delete-stack --stack-name ponchoneta-sg
# aws cloudformation wait stack-delete-complete --stack-name ponchoneta-sg
# aws cloudformation delete-stack --stack-name ponchoneta-vpc
# aws cloudformation wait stack-delete-complete --stack-name ponchoneta-vpc
```
*Nota: La eliminación de la instancia RDS (`ponchoneta-db`) puede tardar más. Si tiene protección contra eliminación habilitada, deberás deshabilitarla primero.*

---
Notas finales
Asegúrate que las variables de entorno en backend sean correctas para conectar con RDS.

Revisa los logs en EC2 si la app no inicia (pm2 logs o /var/log/user-data.log).

Ajusta permisos de seguridad para permitir tráfico HTTP/HTTPS y acceso a RDS.