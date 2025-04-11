-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: elvturc_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'orange','2024-12-07 01:55:26','2024-12-07 01:55:26'),(2,'pinaple','2024-12-07 01:57:06','2024-12-07 01:57:06'),(3,'multifruiter','2024-12-07 14:06:03','2024-12-07 14:06:03');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (23,'2024-12-28 00:00:00',60,0,'2024-12-28 00:16:25','2024-12-28 01:10:14',1,2,2480,2500),(24,'2025-01-01 00:00:00',2,0,'2025-01-01 16:22:12','2025-01-01 16:22:12',1,2,86.4,0),(25,'2025-01-01 00:00:00',2,0,'2025-01-01 17:12:22','2025-01-01 17:12:22',1,2,86.4,0),(26,'2025-01-01 00:00:00',6,0,'2025-01-01 17:13:16','2025-01-01 17:13:34',1,1,257.2,200),(27,'2025-01-01 00:00:00',12,0,'2025-01-01 17:19:40','2025-01-01 17:19:40',1,1,579.6,120),(28,'2025-04-08 00:00:00',125,0,'2025-04-08 19:04:18','2025-04-08 23:16:50',1,2,7375,4000);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `item_categories`
--

LOCK TABLES `item_categories` WRITE;
/*!40000 ALTER TABLE `item_categories` DISABLE KEYS */;
INSERT INTO `item_categories` VALUES ('2025-01-01 17:13:16','2025-01-01 17:13:16',1,1),('2024-12-07 13:47:56','2024-12-15 21:00:42',1,2),('2024-12-07 14:03:21','2024-12-07 14:03:21',2,2),('2024-12-07 14:06:24','2024-12-07 14:06:24',3,3),('2024-12-08 01:16:16','2024-12-08 01:16:16',8,1),('2024-12-27 07:10:33','2024-12-27 07:10:33',8,2),('2025-04-08 19:04:17','2025-04-08 19:04:17',8,3),('2024-12-08 13:59:26','2024-12-08 13:59:26',9,2),('2024-12-08 14:44:37','2024-12-08 14:44:37',10,3),('2024-12-15 20:57:40','2024-12-15 20:57:40',11,3),('2024-12-27 07:28:39','2024-12-27 07:28:39',12,3),('2025-04-08 18:29:25','2025-04-08 18:29:25',13,3);
/*!40000 ALTER TABLE `item_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `item_invoices`
--

LOCK TABLES `item_invoices` WRITE;
/*!40000 ALTER TABLE `item_invoices` DISABLE KEYS */;
INSERT INTO `item_invoices` VALUES (50,2160,'2024-12-28 00:16:25','2024-12-28 00:16:25',23,2),(10,320,'2024-12-28 00:16:25','2024-12-28 00:16:25',23,3),(2,86.4,'2025-01-01 16:22:12','2025-01-01 16:22:12',24,2),(2,86.4,'2025-01-01 17:12:22','2025-01-01 17:12:22',25,2),(4,193.2,'2025-01-01 17:13:16','2025-01-01 17:13:16',26,8),(2,64,'2025-01-01 17:13:16','2025-01-01 17:13:16',26,10),(12,579.6,'2025-01-01 17:19:40','2025-01-01 17:19:40',27,8),(125,7375,'2025-04-08 19:04:18','2025-04-08 19:04:18',28,13);
/*!40000 ALTER TABLE `item_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,22,48.4,'2024-12-07 13:47:56','2025-01-01 17:19:40',1),(2,53,43.2,'2024-12-07 14:03:21','2025-01-01 17:12:22',1),(3,177,32,'2024-12-07 14:06:24','2025-01-01 17:13:16',2),(8,299,48.3,'2024-12-08 01:16:16','2025-04-08 19:04:18',5),(9,5,43.2,'2024-12-08 13:59:26','2025-01-01 14:48:34',5),(10,71,32,'2024-12-08 14:44:37','2025-01-01 17:13:16',6),(11,76,70,'2024-12-15 20:57:40','2024-12-27 19:49:48',3),(12,14,70,'2024-12-27 07:28:39','2024-12-27 08:47:03',7),(13,275,59,'2025-04-08 18:29:25','2025-04-08 19:04:17',1);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_logs`
--

LOCK TABLES `product_logs` WRITE;
/*!40000 ALTER TABLE `product_logs` DISABLE KEYS */;
INSERT INTO `product_logs` VALUES (1,'2024-12-27 19:49:48','2024-12-27 19:49:48','{\"date\":\"2024-12-27T00:00:00.000Z\",\"recipientId\":null,\"soreId\":1,\"store\":{\"location\":\"main store\"},\"recipient\":{\"location\":null},\"Items\":[{\"Categories\":[{\"id\":3,\"name\":\"multifruiter\"}],\"Product\":{\"id\":3,\"name\":\"Juicee\",\"description\":\"another Drink\",\"StoreId\":1},\"item_invoice\":{\"quantity\":76,\"unitPrice\":70,\"subtotal\":5320}}]}',1,'store'),
(2,'2024-12-27 20:41:42','2024-12-27 20:41:42','{\"date\":\"2024-12-27T00:00:00.000Z\",\"recipientId\":null,\"soreId\":2,\"store\":{\"location\":\"gr-2302-18\"},\"recipient\":{\"location\":null},\"Items\":[{\"Categories\":[{\"id\":2,\"name\":\"pinaple\"}],\"Product\":{\"id\":5,\"name\":\"Kalipo\",\"description\":\"from Aquafresh n\",\"StoreId\":2},\"item_invoice\":{\"quantity\":113,\"unitPrice\":48.3,\"subtotal\":5457.9}},{\"Categories\":[{\"id\":3,\"name\":\"multifruiter\"}],\"Product\":{\"id\":6,\"name\":\"fruteli\",\"description\":\"from Aquafresh\",\"StoreId\":2},\"item_invoice\":{\"quantity\":63,\"unitPrice\":32,\"subtotal\":2016}}]}',1,'store'),(3,'2024-12-28 00:16:25','2024-12-28 00:16:25','{\"id\":23,\"date\":\"2024-12-28T00:00:00.000Z\",\"total_items\":60,\"total_amount\":2480,\"amount_paid\":0,\"is_balanced\":false,\"createdAt\":\"2024-12-28T00:16:25.000Z\",\"updatedAt\":\"2024-12-28T00:16:25.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":2,\"unitPrice\":43.2,\"Categories\":[{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":2,\"CategoryId\":2}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":50,\"subtotal\":2160}},{\"id\":3,\"unitPrice\":32,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":3,\"CategoryId\":3}}],\"Product\":{\"id\":2,\"name\":\"fruteli\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":10,\"subtotal\":320}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice created'),(9,'2024-12-28 01:09:26','2024-12-28 01:09:26','{\"id\":23,\"date\":\"2024-12-28T00:00:00.000Z\",\"total_items\":60,\"total_amount\":2480,\"amount_paid\":700,\"is_balanced\":false,\"createdAt\":\"2024-12-28T00:16:25.000Z\",\"updatedAt\":\"2024-12-28T01:09:26.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":2,\"unitPrice\":43.2,\"Categories\":[{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":2,\"CategoryId\":2}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":50,\"subtotal\":2160}},{\"id\":3,\"unitPrice\":32,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":3,\"CategoryId\":3}}],\"Product\":{\"id\":2,\"name\":\"fruteli\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":10,\"subtotal\":320}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(10,'2024-12-28 01:09:55','2024-12-28 01:09:55','{\"id\":23,\"date\":\"2024-12-28T00:00:00.000Z\",\"total_items\":60,\"total_amount\":2480,\"amount_paid\":1700,\"is_balanced\":false,\"createdAt\":\"2024-12-28T00:16:25.000Z\",\"updatedAt\":\"2024-12-28T01:09:55.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":2,\"unitPrice\":43.2,\"Categories\":[{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":2,\"CategoryId\":2}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":50,\"subtotal\":2160}},{\"id\":3,\"unitPrice\":32,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":3,\"CategoryId\":3}}],\"Product\":{\"id\":2,\"name\":\"fruteli\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":10,\"subtotal\":320}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(11,'2024-12-28 01:10:14','2024-12-28 01:10:14','{\"id\":23,\"date\":\"2024-12-28T00:00:00.000Z\",\"total_items\":60,\"total_amount\":2480,\"amount_paid\":2500,\"is_balanced\":false,\"createdAt\":\"2024-12-28T00:16:25.000Z\",\"updatedAt\":\"2024-12-28T01:10:14.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":2,\"unitPrice\":43.2,\"Categories\":[{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":2,\"CategoryId\":2}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":50,\"subtotal\":2160}},{\"id\":3,\"unitPrice\":32,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":3,\"CategoryId\":3}}],\"Product\":{\"id\":2,\"name\":\"fruteli\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":10,\"subtotal\":320}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(12,'2025-01-01 16:22:12','2025-01-01 16:22:12','{\"id\":24,\"date\":\"2025-01-01T00:00:00.000Z\",\"total_items\":2,\"total_amount\":86.4,\"amount_paid\":0,\"is_balanced\":false,\"createdAt\":\"2025-01-01T16:22:12.000Z\",\"updatedAt\":\"2025-01-01T16:22:12.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":2,\"unitPrice\":43.2,\"Categories\":[{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":2,\"CategoryId\":2}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":2,\"subtotal\":86.4}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice created'),(13,'2025-01-01 17:12:22','2025-01-01 17:12:22','{\"id\":25,\"date\":\"2025-01-01T00:00:00.000Z\",\"total_items\":2,\"total_amount\":86.4,\"amount_paid\":0,\"is_balanced\":false,\"createdAt\":\"2025-01-01T17:12:22.000Z\",\"updatedAt\":\"2025-01-01T17:12:22.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":2,\"unitPrice\":43.2,\"Categories\":[{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":2,\"CategoryId\":2}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":2,\"subtotal\":86.4}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice created'),(14,'2025-01-01 17:13:16','2025-01-01 17:13:16','{\"id\":26,\"date\":\"2025-01-01T00:00:00.000Z\",\"total_items\":6,\"total_amount\":257.2,\"amount_paid\":0,\"is_balanced\":false,\"createdAt\":\"2025-01-01T17:13:16.000Z\",\"updatedAt\":\"2025-01-01T17:13:16.000Z\",\"recipientId\":1,\"UserId\":1,\"Items\":[{\"id\":8,\"unitPrice\":48.3,\"Categories\":[{\"id\":1,\"name\":\"orange\",\"item_categories\":{\"ItemId\":8,\"CategoryId\":1}},{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":8,\"CategoryId\":2}}],\"Product\":{\"id\":5,\"name\":\"Kalipo\",\"description\":\"from Aquafresh n\",\"StoreId\":2},\"item_invoice\":{\"quantity\":4,\"subtotal\":193.2}},{\"id\":10,\"unitPrice\":32,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":10,\"CategoryId\":3}}],\"Product\":{\"id\":6,\"name\":\"fruteli\",\"description\":\"from Aquafresh\",\"StoreId\":2},\"item_invoice\":{\"quantity\":2,\"subtotal\":64}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"}}',1,'invoice created'),(15,'2025-01-01 17:13:34','2025-01-01 17:13:34','{\"id\":26,\"date\":\"2025-01-01T00:00:00.000Z\",\"total_items\":6,\"total_amount\":257.2,\"amount_paid\":200,\"is_balanced\":false,\"createdAt\":\"2025-01-01T17:13:16.000Z\",\"updatedAt\":\"2025-01-01T17:13:34.000Z\",\"recipientId\":1,\"UserId\":1,\"Items\":[{\"id\":8,\"unitPrice\":48.3,\"Categories\":[{\"id\":1,\"name\":\"orange\",\"item_categories\":{\"ItemId\":8,\"CategoryId\":1}},{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":8,\"CategoryId\":2}}],\"Product\":{\"id\":5,\"name\":\"Kalipo\",\"description\":\"from Aquafresh n\",\"StoreId\":2},\"item_invoice\":{\"quantity\":4,\"subtotal\":193.2}},{\"id\":10,\"unitPrice\":32,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":10,\"CategoryId\":3}}],\"Product\":{\"id\":6,\"name\":\"fruteli\",\"description\":\"from Aquafresh\",\"StoreId\":2},\"item_invoice\":{\"quantity\":2,\"subtotal\":64}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(16,'2025-01-01 17:19:40','2025-01-01 17:19:40','{\"id\":27,\"date\":\"2025-01-01T00:00:00.000Z\",\"total_items\":12,\"total_amount\":579.6,\"amount_paid\":120,\"is_balanced\":false,\"createdAt\":\"2025-01-01T17:19:40.000Z\",\"updatedAt\":\"2025-01-01T17:19:40.000Z\",\"recipientId\":1,\"UserId\":1,\"Items\":[{\"id\":8,\"unitPrice\":48.3,\"Categories\":[{\"id\":1,\"name\":\"orange\",\"item_categories\":{\"ItemId\":8,\"CategoryId\":1}},{\"id\":2,\"name\":\"pinaple\",\"item_categories\":{\"ItemId\":8,\"CategoryId\":2}}],\"Product\":{\"id\":5,\"name\":\"Kalipo\",\"description\":\"from Aquafresh n\",\"StoreId\":2},\"item_invoice\":{\"quantity\":12,\"subtotal\":579.6}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"}}',1,'invoice created'),(17,'2025-04-08 18:34:45','2025-04-08 18:34:45','{\"date\":\"2025-04-08T00:00:00.000Z\",\"recipientId\":null,\"soreId\":1,\"store\":{\"location\":\"main store\"},\"recipient\":{\"location\":null},\"Items\":[{\"Categories\":[{\"id\":3,\"name\":\"multifruiter\"}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":400,\"unitPrice\":59,\"subtotal\":23600}}]}',1,'store'),(18,'2025-04-08 19:04:18','2025-04-08 19:04:18','{\"id\":28,\"date\":\"2025-04-08T00:00:00.000Z\",\"total_items\":125,\"total_amount\":7375,\"amount_paid\":0,\"is_balanced\":false,\"createdAt\":\"2025-04-08T19:04:18.000Z\",\"updatedAt\":\"2025-04-08T19:04:18.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":13,\"unitPrice\":59,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":13,\"CategoryId\":3}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":125,\"subtotal\":7375}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice created'),(19,'2025-04-08 19:15:48','2025-04-08 19:15:48','{\"id\":28,\"date\":\"2025-04-08T00:00:00.000Z\",\"total_items\":125,\"total_amount\":7375,\"amount_paid\":2000,\"is_balanced\":false,\"createdAt\":\"2025-04-08T19:04:18.000Z\",\"updatedAt\":\"2025-04-08T19:15:48.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":13,\"unitPrice\":59,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":13,\"CategoryId\":3}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":125,\"subtotal\":7375}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(20,'2025-04-08 19:16:24','2025-04-08 19:16:24','{\"id\":28,\"date\":\"2025-04-08T00:00:00.000Z\",\"total_items\":125,\"total_amount\":7375,\"amount_paid\":2500,\"is_balanced\":false,\"createdAt\":\"2025-04-08T19:04:18.000Z\",\"updatedAt\":\"2025-04-08T19:16:24.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":13,\"unitPrice\":59,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":13,\"CategoryId\":3}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":125,\"subtotal\":7375}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(21,'2025-04-08 21:36:13','2025-04-08 21:36:13','{\"id\":28,\"date\":\"2025-04-08T00:00:00.000Z\",\"total_items\":125,\"total_amount\":7375,\"amount_paid\":3000,\"is_balanced\":false,\"createdAt\":\"2025-04-08T19:04:18.000Z\",\"updatedAt\":\"2025-04-08T21:36:13.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":13,\"unitPrice\":59,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":13,\"CategoryId\":3}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":125,\"subtotal\":7375}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(22,'2025-04-08 23:13:05','2025-04-08 23:13:05','{\"id\":28,\"date\":\"2025-04-08T00:00:00.000Z\",\"total_items\":125,\"total_amount\":7375,\"amount_paid\":3600,\"is_balanced\":false,\"createdAt\":\"2025-04-08T19:04:18.000Z\",\"updatedAt\":\"2025-04-08T23:13:05.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":13,\"unitPrice\":59,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":13,\"CategoryId\":3}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":125,\"subtotal\":7375}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(23,'2025-04-08 23:14:23','2025-04-08 23:14:23','{\"id\":28,\"date\":\"2025-04-08T00:00:00.000Z\",\"total_items\":125,\"total_amount\":7375,\"amount_paid\":3800,\"is_balanced\":false,\"createdAt\":\"2025-04-08T19:04:18.000Z\",\"updatedAt\":\"2025-04-08T23:14:23.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":13,\"unitPrice\":59,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":13,\"CategoryId\":3}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":125,\"subtotal\":7375}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated'),(24,'2025-04-08 23:16:50','2025-04-08 23:16:50','{\"id\":28,\"date\":\"2025-04-08T00:00:00.000Z\",\"total_items\":125,\"total_amount\":7375,\"amount_paid\":4000,\"is_balanced\":false,\"createdAt\":\"2025-04-08T19:04:18.000Z\",\"updatedAt\":\"2025-04-08T23:16:50.000Z\",\"recipientId\":2,\"UserId\":1,\"Items\":[{\"id\":13,\"unitPrice\":59,\"Categories\":[{\"id\":3,\"name\":\"multifruiter\",\"item_categories\":{\"ItemId\":13,\"CategoryId\":3}}],\"Product\":{\"id\":1,\"name\":\"Kalipo\",\"description\":\"from Aquafresh\",\"StoreId\":1},\"item_invoice\":{\"quantity\":125,\"subtotal\":7375}}],\"User\":{\"username\":\"superAdmin\",\"phone\":\"0544069203\"},\"recipient\":{\"username\":\"johnDoe\",\"phone\":\"0544069203\"}}',1,'invoice updated');
/*!40000 ALTER TABLE `product_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Kalipo','from Aquafresh','2024-12-07 02:03:18','2024-12-07 02:03:18',1),(2,'fruteli','from Aquafresh','2024-12-07 02:24:30','2024-12-07 02:24:30',1),(3,'Juicee','another Drink','2024-12-07 12:40:16','2024-12-07 12:40:16',1),(5,'Kalipo','from Aquafresh','2024-12-08 01:16:16','2024-12-15 18:40:12',2),(6,'fruteli','from Aquafresh','2024-12-08 14:44:37','2024-12-08 14:44:37',2),(7,'Juicee','another Drink','2024-12-27 07:28:39','2024-12-27 07:28:39',2);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'main store','main warehouse at the offficeee','2024-12-06 20:32:08','2024-12-15 17:56:16',1),(2,'gr-2302-18','johns truck','2024-12-06 20:41:56','2024-12-06 20:41:56',2),(3,'ga-8921-20','mensah\'s car','2024-12-06 20:44:00','2024-12-06 20:44:00',2);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'superAdmin','$2b$10$q0x5c8Cx7d//E7KqZn/egOBvDjeAsZcLEyRxOr7pxjraEk0QGe6z.','0544069203','admin','2024-12-06 00:13:46','2024-12-06 00:13:46'),(2,'johnDoe','$2b$10$zSoGE4NWlfcdTnhZnZMRwuI/lfA5vNZIflB9k1r91a0tKgHZh0ura','0544069203','sales','2024-12-06 22:58:56','2024-12-06 22:58:56'),(3,'manager.admin','$2b$10$VcTkHnloRPDXBhxVdch.fer4vJn7ujVnw.mefhDsX.g0OTGPDfJpy','0544069203','admin','2025-04-08 18:16:30','2025-04-08 18:16:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-09  8:13:57
