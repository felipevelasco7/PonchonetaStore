# Plan de Proyecto – PonchonetaStore

**Autor(es):**
- Kevin Banguero 
- Alexis Jaramillo
- Felipe Velasco
-
-
**Fecha:** 06/06/2002  
**Versión:** 1.0  

---

## 1. Introducción

>En un mercado de comercio electrónico cada vez más competitivo y dinámico, PonchonetaStore requiere una infraestructura de nube que garantice no solo la disponibilidad y seguridad de su plataforma, sino también la capacidad de escalar de forma ágil ante picos de demanda. Para ello, aprovecharemos los servicios de AWS implementados mediante Infrastructure as Code (IaC) con CloudFormation y scripts automatizados, lo que nos permitirá versionar, reproducir y auditar cada despliegue de manera consistente. Este documento detalla la hoja de ruta para diseñar, construir y validar la red (VPC y subredes), la capa de datos (RDS MySQL cifrada), la capa de aplicación (EC2 con AutoScaling y ALB) y la monitorización (CloudWatch y SNS), aunando criterios técnicos y de negocio, asignando responsabilidades, definiendo plazos e identificando riesgos, para asegurar el éxito del proyecto de despliegue.

---

## 2. Objetivos del Proyecto

### 2.1 Objetivo General  
> Desplegar la infraestructura de PonchonetaStore en AWS usando Infrastructure as Code para garantizar reproducibilidad, seguridad y escalabilidad.

### 2.2 Objetivos Específicos  
1. Diseñar la topología de red (VPC, subredes, bastión).  
2. Implementar base de datos RDS con cifrado y backups.  
3. Configurar AutoScaling, ALB y EC2 para el backend.  
4. Establecer alarmas de monitorización y notificaciones SNS.  
5. Documentar y automatizar el despliegue completo.

---

## 3. Alcance

- Infraestructura de red (VPC, subnets, IGW, NAT).  
- Bastión con AWS SSM para acceso seguro.  
- Base de datos MySQL en RDS (privada, cifrada).  
- Capa de aplicación (EC2, ALB, AutoScaling).  
- Monitorización (CloudWatch + SNS).  
- Scripts de despliegue (CloudFormation + Bash).


---

## 4. Cronograma y Hitos

| Hito                  | Fecha Inicio | Fecha Fin |
|-----------------------|--------------|-----------|
| Diseño de red         | [16/05]      | [30/05]   |
| Infraestructura de BD | [16/05]      | [01/06]   |
| Capa de aplicación    | [27/05]      | [03/06]   |
| Monitorización        | [01/06]      | [05/06]   |
| Pruebas de despliegue | [01/06]      | [05/06]   |
| Documentación final   | [01/06]      | [06/06]   |

---

## 5. Recursos

| Recurso / Herramienta       | Descripción                  |
|-----------------------------|------------------------------| 
| AWS CLI & CloudFormation    | Infraestructura como código  |
| Git/GitHub                  | Control de versiones         |
| VS Code                     | Editor                       |
| Cuenta AWS sandbox          | Cuenta otorgada por el curso |
| Node.js                     | Pruebas locales              |

---

## 6. Gestión de Riesgos

| Riesgo                              | Probabilidad | Impacto | Mitigación                                    |
|-------------------------------------|--------------|---------|-----------------------------------------------|
| Límites de instancias en sandbox    | Media        | Alto    | Usar instancias t2.micro; optimizar ASG       |
| Errores en plantillas CFN           | Baja         | Alto    | Validar con `cfn-lint`; pruebas en dev        |
| Credenciales RDS expuestas          | Media        | Medio   | NoEcho en CloudFormation; usar Secrets Manager |
| Fallos en UserData                  | Media        | Medio   | Añadir logs; bucles de espera en arranque     |


```
