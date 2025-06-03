-- MySQL dump 10.13  Distrib 9.3.0, for macos14.7 (arm64)
--
-- Host: localhost    Database: ponchonetaDB
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `celular` varchar(50) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `direccion` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'felipe','f@','4','bog','15#124','2025-05-22 20:12:19'),(2,'carlos medias','c@','3111','med','9012','2025-05-22 20:33:28'),(3,'col','1@','0991','lima','0983','2025-05-22 20:40:45'),(4,'ligia','r@','234','cali','23','2025-05-22 20:45:24'),(5,'me','!@','2245','cail','983','2025-05-22 20:46:50'),(6,'ligia','7@','12321','Cali','Calle 5#119-15 Living Apartaestudios','2025-05-22 20:49:51'),(7,'felipe','felipevelasco2002@hotmail.com','321','cail','Calle 5#119-15 Living Apartaestudios','2025-05-23 00:02:52'),(8,'FELIPE','@@','234','C','Calle 5#119-15 Living Apartaestudios','2025-05-23 15:52:37'),(9,'oscar','o@','3','cali','call2','2025-05-28 21:07:19'),(10,'felipe','felipevelasco2002@hotmail.com','3991111111','Cali','calle 15#123-250','2025-05-29 04:18:10'),(11,'wompi','felipevelasco2002@hotmail.com','3991111111','Cali','calle 15#13-250','2025-05-29 04:22:49');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `comprador` json NOT NULL,
  `productos` json NOT NULL,
  `fecha` datetime NOT NULL,
  `cliente_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cliente_order` (`cliente_id`),
  CONSTRAINT `fk_cliente_order` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'{\"email\": \"r@\", \"ciudad\": \"cali\", \"nombre\": \"ligia\", \"celular\": \"234\", \"direccion\": \"23\"}','[{\"id\": 4, \"name\": \"Medias antideslizantes\", \"size\": null, \"team\": \"<null>\", \"price\": \"25000.00\", \"stock\": 4, \"season\": null, \"cantidad\": 1, \"category\": \"Medias\", \"image_url\": \"https://http2.mlstatic.com/D_NQ_NP_700576-MCO76989992788_062024-O.webp\", \"created_at\": \"2025-05-21T23:56:45.000Z\", \"shirt_type\": \"FAN\", \"updated_at\": \"2025-05-22T20:31:37.000Z\", \"description\": \"FS BLANCAS\", \"availability\": \"Entrega Inmediata\", \"league_or_country\": \"<null>\"}]','2025-05-22 15:45:24',4),(2,'{\"email\": \"!@\", \"ciudad\": \"cail\", \"nombre\": \"me\", \"celular\": \"2245\", \"direccion\": \"983\"}','[{\"id\": 4, \"name\": \"Medias antideslizantes\", \"size\": null, \"team\": \"<null>\", \"price\": \"25000.00\", \"stock\": 3, \"season\": null, \"cantidad\": 3, \"category\": \"Medias\", \"image_url\": \"https://http2.mlstatic.com/D_NQ_NP_700576-MCO76989992788_062024-O.webp\", \"created_at\": \"2025-05-21T23:56:45.000Z\", \"shirt_type\": \"FAN\", \"updated_at\": \"2025-05-22T20:45:24.000Z\", \"description\": \"FS BLANCAS\", \"availability\": \"Entrega Inmediata\", \"league_or_country\": \"<null>\"}]','2025-05-22 15:46:50',5),(3,'{\"email\": \"7@\", \"ciudad\": \"Cali\", \"nombre\": \"ligia\", \"celular\": \"12321\", \"direccion\": \"Calle 5#119-15 Living Apartaestudios\"}','[{\"id\": 2, \"name\": \"Camiseta Liverpool 23/24\", \"size\": \"M\", \"team\": \"Liverpool FC\", \"price\": \"229900.00\", \"stock\": 2, \"season\": null, \"cantidad\": 1, \"category\": \"Camiseta\", \"image_url\": \"https://www.mysteryshirt.nl/cdn/shop/files/gameday-edition-mystery-shirt-mysterybox.jpg?v=1737810315\", \"created_at\": \"2025-05-21T23:56:45.000Z\", \"shirt_type\": \"PLAYER\", \"updated_at\": \"2025-05-22T20:16:14.000Z\", \"description\": \"Versión jugador local\", \"availability\": \"Entrega Inmediata\", \"league_or_country\": \"Premier League\"}]','2025-05-22 15:49:51',6),(4,'{\"email\": \"felipevelasco2002@hotmail.com\", \"ciudad\": \"cail\", \"nombre\": \"felipe\", \"celular\": \"321\", \"direccion\": \"Calle 5#119-15 Living Apartaestudios\"}','[{\"id\": 1, \"name\": \"Camiseta Retro Colombia 98\", \"size\": \"L\", \"team\": \"Selección Colombia\", \"price\": \"159900.00\", \"stock\": 1, \"season\": null, \"cantidad\": 1, \"category\": \"Camiseta\", \"image_url\": \"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTheD2W3KnXA436-CJbOifzMdBBu9eo7vsMoQ&s\", \"created_at\": \"2025-05-21T23:56:45.000Z\", \"shirt_type\": \"FAN\", \"updated_at\": \"2025-05-22T20:16:14.000Z\", \"description\": \"Versión clásica selección Colombia 1998\", \"availability\": \"Por Encargo\", \"league_or_country\": \"Colombia\"}]','2025-05-22 19:02:52',7),(5,'{\"email\": \"@@\", \"ciudad\": \"C\", \"nombre\": \"FELIPE\", \"celular\": \"234\", \"direccion\": \"Calle 5#119-15 Living Apartaestudios\"}','[{\"id\": 3, \"name\": \"Mystery Shirt\", \"size\": \"XL\", \"team\": \"Club Europeo\", \"price\": \"189900.00\", \"stock\": 3, \"season\": null, \"cantidad\": 1, \"category\": \"Camiseta\", \"image_url\": \"https://www.mysteryshirt.nl/cdn/shop/files/gameday-edition-mystery-shirt-mysterybox.jpg?v=1737810315\", \"created_at\": \"2025-05-21T23:56:45.000Z\", \"shirt_type\": \"FAN\", \"updated_at\": \"2025-05-22T20:16:14.000Z\", \"description\": \"Caja sorpresa con camiseta de club europeo\", \"availability\": \"Entrega Inmediata\", \"league_or_country\": \"Otros\"}]','2025-05-23 10:52:38',8),(6,'{\"email\": \"o@\", \"ciudad\": \"cali\", \"nombre\": \"oscar\", \"celular\": \"3\", \"direccion\": \"call2\"}','[{\"id\": 2, \"name\": \"Camiseta Liverpool 23/24\", \"size\": \"M\", \"team\": \"Liverpool FC\", \"price\": \"229900.00\", \"stock\": 1, \"season\": null, \"cantidad\": 1, \"category\": \"Camiseta\", \"image_url\": \"https://www.mysteryshirt.nl/cdn/shop/files/gameday-edition-mystery-shirt-mysterybox.jpg?v=1737810315\", \"created_at\": \"2025-05-21T23:56:45.000Z\", \"shirt_type\": \"PLAYER\", \"updated_at\": \"2025-05-22T20:49:51.000Z\", \"description\": \"Versión jugador local\", \"availability\": \"Entrega Inmediata\", \"league_or_country\": \"Premier League\"}]','2025-05-28 16:07:20',9),(7,'{\"email\": \"felipevelasco2002@hotmail.com\", \"ciudad\": \"Cali\", \"nombre\": \"felipe\", \"region\": \"Valle del Cauca\", \"celular\": \"3991111111\", \"legalId\": \"1193560893\", \"direccion\": \"calle 15#123-250\", \"legalIdType\": \"CC\"}','[{\"id\": 7, \"name\": \"Sticker\", \"size\": null, \"team\": null, \"price\": \"1500.00\", \"stock\": 50, \"season\": null, \"cantidad\": 1, \"category\": \"Medias\", \"image_url\": \"https://cdn-icons-png.flaticon.com/256/8906/8906010.png\", \"created_at\": \"2025-05-28T23:30:50.000Z\", \"shirt_type\": null, \"updated_at\": \"2025-05-28T23:39:36.000Z\", \"description\": null, \"availability\": null, \"league_or_country\": null}]','2025-05-28 23:18:10',10),(8,'{\"email\": \"felipevelasco2002@hotmail.com\", \"ciudad\": \"Cali\", \"nombre\": \"wompi\", \"region\": \"Valle del Cauca\", \"celular\": \"3991111111\", \"legalId\": \"193\", \"direccion\": \"calle 15#13-250\", \"legalIdType\": \"CC\"}','[{\"id\": 4, \"name\": \"Medias antideslizantes\", \"size\": null, \"team\": \"<null>\", \"price\": \"25000.00\", \"stock\": 5, \"season\": null, \"cantidad\": 1, \"category\": \"Medias\", \"image_url\": \"https://http2.mlstatic.com/D_NQ_NP_700576-MCO76989992788_062024-O.webp\", \"created_at\": \"2025-05-21T23:56:45.000Z\", \"shirt_type\": \"FAN\", \"updated_at\": \"2025-05-23T15:53:04.000Z\", \"description\": \"FS BLANCAS\", \"availability\": \"Entrega Inmediata\", \"league_or_country\": \"<null>\"}]','2025-05-28 23:22:50',11);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `size` enum('S','M','L','XL','XXL','NINO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shirt_type` enum('PLAYER','FAN','RETRO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('Camiseta','Sudadera','Medias','Accesorio') COLLATE utf8mb4_unicode_ci NOT NULL,
  `team` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `league_or_country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `season` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int unsigned DEFAULT '0',
  `availability` enum('Entrega Inmediata','Por Encargo') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Camiseta Retro Colombia 98','Versión clásica selección Colombia 1998',159900.00,'L','FAN','Camiseta','Selección Colombia','Colombia',NULL,5,'Por Encargo','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTheD2W3KnXA436-CJbOifzMdBBu9eo7vsMoQ&s','2025-05-21 23:56:45','2025-05-23 15:53:04'),(2,'Camiseta Liverpool 23/24','Versión jugador local',229900.00,'M','PLAYER','Camiseta','Liverpool FC','Premier League',NULL,0,'Entrega Inmediata','https://www.mysteryshirt.nl/cdn/shop/files/gameday-edition-mystery-shirt-mysterybox.jpg?v=1737810315','2025-05-21 23:56:45','2025-05-28 21:07:19'),(3,'Mystery Shirt','Caja sorpresa con camiseta de club europeo',189900.00,'XL','FAN','Camiseta','Club Europeo','Otros',NULL,2,'Entrega Inmediata','https://www.mysteryshirt.nl/cdn/shop/files/gameday-edition-mystery-shirt-mysterybox.jpg?v=1737810315','2025-05-21 23:56:45','2025-05-23 15:52:37'),(4,'Medias antideslizantes','FS BLANCAS',25000.00,NULL,'FAN','Medias','<null>','<null>',NULL,4,'Entrega Inmediata','https://http2.mlstatic.com/D_NQ_NP_700576-MCO76989992788_062024-O.webp','2025-05-21 23:56:45','2025-05-29 04:22:49'),(5,'Sudadera AC Milan','Retro de la Champions ganada por el Milan',179900.00,'XXL','RETRO','Sudadera','AC Milan','Italia',NULL,4,'Por Encargo','https://www.mysteryshirt.nl/cdn/shop/files/gameday-edition-mystery-shirt-mysterybox.jpg?v=1737810315','2025-05-21 23:56:45','2025-05-22 20:16:14'),(6,'Camiseta Selección Argentina 2022','Versión campeón del mundo',239900.00,'S','PLAYER','Camiseta','Selección Argentina','Argentina',NULL,3,'Entrega Inmediata','https://www.mysteryshirt.nl/cdn/shop/files/gameday-edition-mystery-shirt-mysterybox.jpg?v=1737810315','2025-05-21 23:56:45','2025-05-22 20:16:14'),(7,'Sticker',NULL,1500.00,NULL,NULL,'Medias',NULL,NULL,NULL,49,NULL,'https://cdn-icons-png.flaticon.com/256/8906/8906010.png','2025-05-28 23:30:50','2025-05-29 04:18:10');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-03 16:48:21
