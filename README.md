# Ponchoneta Store - Despliegue en AWS

## Requisitos previos

- Cuenta AWS con permisos para CloudFormation, EC2, RDS, IAM, ALB.
- AWS CLI configurado y con credenciales válidas.
- Git instalado en tu consola (CloudShell o local).

---

## Estructura del repositorio

Ponchoneta-Store/
├── backend/
│ ├── server.js
│ ├── package.json
│ ├── .env.example
│ └── ...
├── front/
│ ├── index.html
│ ├── carrito.html
│ ├── css/
│ ├── js/
│ └── ...
├── cloudformation/
│ ├── vpc.yaml
│ ├── security-groups.yaml
│ ├── rds.yaml
│ ├── alb.yaml
│ └── ec2-autoscaling.yaml
├── scripts/
│ └── deploy-ponchoneta.sh
└── README.md

---

## Despliegue completo paso a paso

1. Clona este repositorio:

```bash
git clone https://github.com/tu_usuario/Ponchoneta-Store.git
cd Ponchoneta-Store
```
Ejecuta el script de despliegue:

```bash
bash scripts/deploy-ponchoneta.sh
```
El script te pedirá la contraseña para el usuario administrador de la base de datos.

El script desplegará:

VPC con subredes

Grupos de seguridad

Base de datos RDS MySQL

Application Load Balancer

Auto Scaling Group con instancias EC2 que correrán tu backend y frontend

Al final verás la URL para acceder a la app.

Configuración
Las variables de entorno para el backend se generan automáticamente en .env dentro de backend/ durante el deploy.

Puedes modificar las plantillas CloudFormation para ajustar recursos o nombres.

Desarrollo
El backend usa Node.js + Express y se conecta a la base de datos RDS.

El frontend es estático y se sirve desde el backend.

La comunicación con la API es mediante fetch al endpoint /api/products y /api/orders.

Notas importantes
Debido a limitaciones de roles y recursos en sandbox AWS, se recomienda usar instancias







