-- MySQL dump 10.13  Distrib 9.5.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: parq_laravel
-- ------------------------------------------------------
-- Server version	9.5.0

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
-- GTID state at the beginning of the backup 
--


--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `provider_id` bigint unsigned NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_listing_id_foreign` (`listing_id`),
  KEY `bookings_user_id_foreign` (`user_id`),
  KEY `bookings_provider_id_foreign` (`provider_id`),
  CONSTRAINT `bookings_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_provider_id_foreign` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_fr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'LayoutGrid',
  `description` text COLLATE utf8mb4_unicode_ci,
  `description_fr` text COLLATE utf8mb4_unicode_ci,
  `description_ar` text COLLATE utf8mb4_unicode_ci,
  `parent_id` bigint unsigned DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `show_on_homepage` tinyint(1) NOT NULL DEFAULT '0',
  `schema_template` json DEFAULT NULL,
  `daily_cost` int NOT NULL DEFAULT '5',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`),
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Car Rental','Location de Voitures','كراء السيارات','car-rental','rent','car','Economy, Sedans, SUVs...','Citadines, Berlines, SUV...','سيارات اقتصادية، فاخرة، دفع رباعي...',NULL,1,1,1,NULL,5,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(2,'Heavy Machinery','Engins BTP','آليات الأشغال','heavy-machinery','rent','tractor','Excavators, Cranes, Loaders...','Trax, Poclain, Grue...','تراكس، بوكلان، رافعات...',NULL,2,1,1,NULL,10,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(3,'Transport & Logistics','Transport & Logistique','النقل واللوجستيك','transport-logistics','rent','truck','Trucks, Vans, Haulage...','Camions, Fourgons, Fret...','شاحنات، نقل البضائع...',NULL,3,1,0,NULL,7,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(4,'Lifting Equipment','Levage & Manutention','معدات الرفع','lifting-equipment','rent','crane','Forklifts, Cranes, Hoists...','Chariots, Grues...','رافعات شوكية، أوناش...',NULL,4,1,0,NULL,10,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(5,'Tourist Transport','Transport Touristique','النقل السياحي','tourist-transport','rent','bus','Luxury buses, minibuses, VTC...','Minibus, Autocars, VTC...','حافلات، سيارات فخمة...',NULL,5,1,0,NULL,7,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(6,'Personnel Transport','Transport Personnel','نقل المستخدمين','personnel-transport','rent','users','School & Staff transport...','Ouvriers, Scolaire...','نقل العمال، المدرسي...',NULL,6,1,0,NULL,5,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(7,'Professional Drivers','Chauffeurs Pros','سائقون مهنيون','professional-drivers','rent','user-check','Truck & Machinery Operators...','Permis C/EC/D, Opérateurs...','سائقين مهنيين، مشغلين...',NULL,7,1,0,NULL,3,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(8,'Heavy Machinery Sales','Vente Engins','بيع المعدات','heavy-machinery-sales','buy','shopping-cart','Used machinery & vehicles...','Machines et véhicules d\'occasion...','الآلات و المركبات المستعملة...',NULL,1,1,1,NULL,8,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(9,'Commercial Vehicles','Véhicules Commerciaux','مركبات تجارية','commercial-vehicles','buy','truck','Trucks, Vans for sale...','Camions, Utilitaires à vendre...','شاحنات، عربات للبيع...',NULL,2,1,1,NULL,6,'2026-01-25 12:30:59','2026-01-25 22:39:18'),(10,'Business & Licenses','Business & Agréments','مشاريع ورخص','business-licenses','buy','briefcase','Transport licenses & companies...','Licences de transport et entreprises...','رخص النقل و المقاولات...',NULL,3,1,0,NULL,5,'2026-01-25 12:30:59','2026-01-25 22:39:18');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_fr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Morocco',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cities_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'Casablanca','Casablanca','الدار البيضاء','casablanca','Casablanca-Settat','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(2,'Rabat','Rabat','الرباط','rabat','Rabat-Salé-Kénitra','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(3,'Marrakech','Marrakech','مراكش','marrakech','Marrakech-Safi','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(4,'Fes','Fès','فاس','fes','Fès-Meknès','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(5,'Tangier','Tanger V2','طنجة','tangier','Tanger-Tétouan-Al Hoceïma','Maroc',1,'2026-01-25 12:30:59','2026-01-26 13:55:31'),(6,'Agadir','Agadir','أكادير','agadir','Souss-Massa','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(7,'Meknes','Meknès','مكناس','meknes','Fès-Meknès','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(8,'Oujda','Oujda','وجدة','oujda','Oriental','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(9,'Kenitra','Kénitra','القنيطرة','kenitra','Rabat-Salé-Kénitra','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(10,'Tetouan','Tétouan','تطوان','tetouan','Tanger-Tétouan-Al Hoceïma','Maroc',1,'2026-01-25 12:30:59','2026-01-25 12:30:59');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_user`
--

DROP TABLE IF EXISTS `coupon_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `used_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupon_user_coupon_id_user_id_unique` (`coupon_id`,`user_id`),
  KEY `coupon_user_user_id_foreign` (`user_id`),
  CONSTRAINT `coupon_user_coupon_id_foreign` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `coupon_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_user`
--

LOCK TABLES `coupon_user` WRITE;
/*!40000 ALTER TABLE `coupon_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `credit_amount` int NOT NULL,
  `max_uses` int NOT NULL DEFAULT '1',
  `used_count` int NOT NULL DEFAULT '0',
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorites_user_id_listing_id_unique` (`user_id`,`listing_id`),
  KEY `favorites_listing_id_foreign` (`listing_id`),
  CONSTRAINT `favorites_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'default','{\"uuid\":\"db226117-a542-4e07-9768-ab2f55481275\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"cda546d5-fd8c-4a77-8d9c-78d074a394aa\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"}}',0,NULL,1769425260,1769425260),(2,'default','{\"uuid\":\"707f93f7-cc98-49ec-b460-9f2172607e69\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"cda546d5-fd8c-4a77-8d9c-78d074a394aa\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}',0,NULL,1769425260,1769425260),(3,'default','{\"uuid\":\"0afb0eb1-4f8a-452d-a78c-5abab3287b35\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"a938e0a8-e7ab-4ad7-97e3-75d5491f8500\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"}}',0,NULL,1769425849,1769425849),(4,'default','{\"uuid\":\"d6b394d4-36e9-4fd3-9814-d7f6bcf23a1a\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"a938e0a8-e7ab-4ad7-97e3-75d5491f8500\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}',0,NULL,1769425849,1769425849),(5,'default','{\"uuid\":\"ada47c20-dea0-410e-afda-5f47b17374b7\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:7;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"6c178608-843d-4b7f-8f64-7dba01f47501\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"}}',0,NULL,1769445541,1769445541),(6,'default','{\"uuid\":\"4208cd66-0137-45d7-ba00-7f0487656749\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:7;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"6c178608-843d-4b7f-8f64-7dba01f47501\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}',0,NULL,1769445541,1769445541),(7,'default','{\"uuid\":\"01bccbc6-d898-44bf-a5ec-d20427fec228\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"f0fe4fc5-1183-4d6a-92e8-76969ff945ee\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:4:\\\"mail\\\";}}\"}}',0,NULL,1769528942,1769528942),(8,'default','{\"uuid\":\"a6aed009-8664-488a-9c91-53f5e5ccdb5f\",\"displayName\":\"App\\\\Notifications\\\\TopUpApprovedNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";a:1:{i:0;i:2;}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:43:\\\"App\\\\Notifications\\\\TopUpApprovedNotification\\\":2:{s:15:\\\"\\u0000*\\u0000topUpRequest\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\TopUpRequest\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"id\\\";s:36:\\\"f0fe4fc5-1183-4d6a-92e8-76969ff945ee\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}',0,NULL,1769528942,1769528942);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_cars`
--

DROP TABLE IF EXISTS `listing_cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_cars` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `fuel_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gearbox` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seats` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_cars_listing_id_foreign` (`listing_id`),
  CONSTRAINT `listing_cars_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_cars`
--

LOCK TABLES `listing_cars` WRITE;
/*!40000 ALTER TABLE `listing_cars` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_drivers`
--

DROP TABLE IF EXISTS `listing_drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_drivers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `license_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience_years` int DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_drivers_listing_id_foreign` (`listing_id`),
  CONSTRAINT `listing_drivers_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_drivers`
--

LOCK TABLES `listing_drivers` WRITE;
/*!40000 ALTER TABLE `listing_drivers` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_images`
--

DROP TABLE IF EXISTS `listing_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_images_listing_id_foreign` (`listing_id`),
  CONSTRAINT `listing_images_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_images`
--

LOCK TABLES `listing_images` WRITE;
/*!40000 ALTER TABLE `listing_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_machineries`
--

DROP TABLE IF EXISTS `listing_machineries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_machineries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tonnage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `power` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `condition` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `with_driver` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_machineries_listing_id_foreign` (`listing_id`),
  CONSTRAINT `listing_machineries_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_machineries`
--

LOCK TABLES `listing_machineries` WRITE;
/*!40000 ALTER TABLE `listing_machineries` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_machineries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_machinery`
--

DROP TABLE IF EXISTS `listing_machinery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_machinery` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tonnage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `with_driver` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_machinery_listing_id_foreign` (`listing_id`),
  CONSTRAINT `listing_machinery_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_machinery`
--

LOCK TABLES `listing_machinery` WRITE;
/*!40000 ALTER TABLE `listing_machinery` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_machinery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_transports`
--

DROP TABLE IF EXISTS `listing_transports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_transports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `capacity` int DEFAULT NULL,
  `air_conditioning` tinyint(1) NOT NULL DEFAULT '0',
  `usage_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_transports_listing_id_foreign` (`listing_id`),
  CONSTRAINT `listing_transports_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_transports`
--

LOCK TABLES `listing_transports` WRITE;
/*!40000 ALTER TABLE `listing_transports` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_transports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing_views`
--

DROP TABLE IF EXISTS `listing_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_views` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_views_user_id_foreign` (`user_id`),
  KEY `listing_views_listing_id_created_at_index` (`listing_id`,`created_at`),
  CONSTRAINT `listing_views_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `listing_views_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_views`
--

LOCK TABLES `listing_views` WRITE;
/*!40000 ALTER TABLE `listing_views` DISABLE KEYS */;
INSERT INTO `listing_views` VALUES (1,1,NULL,'2026-01-26 10:12:54','2026-01-26 10:12:54'),(2,1,NULL,'2026-01-26 10:13:09','2026-01-26 10:13:09'),(3,1,NULL,'2026-01-26 10:19:26','2026-01-26 10:19:26'),(4,1,NULL,'2026-01-26 10:20:06','2026-01-26 10:20:06'),(5,1,NULL,'2026-01-26 10:20:07','2026-01-26 10:20:07'),(6,1,NULL,'2026-01-26 10:21:25','2026-01-26 10:21:25'),(7,1,NULL,'2026-01-26 10:25:56','2026-01-26 10:25:56'),(8,1,NULL,'2026-01-26 10:25:56','2026-01-26 10:25:56'),(9,1,NULL,'2026-01-26 10:33:13','2026-01-26 10:33:13'),(10,1,NULL,'2026-01-26 10:33:55','2026-01-26 10:33:55'),(11,1,NULL,'2026-01-26 10:34:11','2026-01-26 10:34:11'),(12,4,NULL,'2026-01-26 10:35:38','2026-01-26 10:35:38'),(13,4,NULL,'2026-01-26 10:35:38','2026-01-26 10:35:38'),(14,2,NULL,'2026-01-26 10:40:48','2026-01-26 10:40:48'),(15,2,NULL,'2026-01-26 10:40:48','2026-01-26 10:40:48'),(16,1,NULL,'2026-01-26 10:43:13','2026-01-26 10:43:13'),(17,1,NULL,'2026-01-26 10:43:25','2026-01-26 10:43:25'),(18,1,NULL,'2026-01-26 10:43:26','2026-01-26 10:43:26'),(19,1,NULL,'2026-01-26 11:34:43','2026-01-26 11:34:43'),(20,1,NULL,'2026-01-26 11:34:43','2026-01-26 11:34:43'),(21,1,NULL,'2026-01-26 11:46:02','2026-01-26 11:46:02'),(22,1,NULL,'2026-01-26 11:46:02','2026-01-26 11:46:02'),(23,2,NULL,'2026-01-26 12:54:04','2026-01-26 12:54:04'),(24,2,NULL,'2026-01-26 12:54:04','2026-01-26 12:54:04'),(25,1,NULL,'2026-01-26 13:02:08','2026-01-26 13:02:08'),(26,2,NULL,'2026-01-26 13:03:51','2026-01-26 13:03:51'),(27,2,NULL,'2026-01-26 13:04:29','2026-01-26 13:04:29'),(28,2,NULL,'2026-01-26 13:31:13','2026-01-26 13:31:13'),(29,1,NULL,'2026-01-26 13:32:50','2026-01-26 13:32:50'),(30,1,NULL,'2026-01-26 13:32:50','2026-01-26 13:32:50'),(31,1,NULL,'2026-01-26 13:44:20','2026-01-26 13:44:20'),(32,1,NULL,'2026-01-26 13:46:39','2026-01-26 13:46:39'),(33,1,NULL,'2026-01-26 13:53:29','2026-01-26 13:53:29'),(34,1,NULL,'2026-01-26 13:53:29','2026-01-26 13:53:29'),(35,1,NULL,'2026-01-26 13:53:33','2026-01-26 13:53:33'),(36,1,NULL,'2026-01-26 13:53:33','2026-01-26 13:53:33'),(37,1,NULL,'2026-01-26 13:53:42','2026-01-26 13:53:42'),(38,1,NULL,'2026-01-26 13:53:42','2026-01-26 13:53:42'),(39,1,NULL,'2026-01-26 13:54:05','2026-01-26 13:54:05'),(40,1,NULL,'2026-01-26 13:54:05','2026-01-26 13:54:05'),(41,20,NULL,'2026-01-26 13:58:07','2026-01-26 13:58:07'),(42,20,NULL,'2026-01-26 13:58:07','2026-01-26 13:58:07'),(43,1,NULL,'2026-01-26 13:59:28','2026-01-26 13:59:28'),(44,1,NULL,'2026-01-26 14:01:14','2026-01-26 14:01:14'),(45,1,NULL,'2026-01-26 14:02:23','2026-01-26 14:02:23'),(46,1,NULL,'2026-01-26 14:02:24','2026-01-26 14:02:24'),(47,1,NULL,'2026-01-26 14:06:17','2026-01-26 14:06:17'),(48,1,NULL,'2026-01-26 14:09:01','2026-01-26 14:09:01'),(49,1,NULL,'2026-01-26 14:13:40','2026-01-26 14:13:40'),(50,1,NULL,'2026-01-26 14:13:41','2026-01-26 14:13:41'),(51,1,NULL,'2026-01-26 14:16:36','2026-01-26 14:16:36'),(52,1,NULL,'2026-01-26 14:17:15','2026-01-26 14:17:15'),(53,1,NULL,'2026-01-26 14:18:29','2026-01-26 14:18:29'),(54,1,NULL,'2026-01-26 14:19:45','2026-01-26 14:19:45'),(55,1,NULL,'2026-01-26 14:28:32','2026-01-26 14:28:32'),(56,1,NULL,'2026-01-26 14:28:32','2026-01-26 14:28:32'),(57,1,NULL,'2026-01-26 14:31:24','2026-01-26 14:31:24'),(58,1,NULL,'2026-01-26 14:32:47','2026-01-26 14:32:47'),(59,1,NULL,'2026-01-26 14:32:54','2026-01-26 14:32:54'),(60,1,NULL,'2026-01-26 14:33:06','2026-01-26 14:33:06'),(61,1,NULL,'2026-01-26 14:33:06','2026-01-26 14:33:06'),(62,1,NULL,'2026-01-26 14:33:13','2026-01-26 14:33:13'),(63,1,NULL,'2026-01-26 14:33:13','2026-01-26 14:33:13'),(64,1,NULL,'2026-01-26 14:33:44','2026-01-26 14:33:44'),(65,1,NULL,'2026-01-26 14:34:13','2026-01-26 14:34:13'),(66,1,NULL,'2026-01-26 14:34:22','2026-01-26 14:34:22'),(67,1,NULL,'2026-01-26 14:34:22','2026-01-26 14:34:22'),(68,1,NULL,'2026-01-26 14:34:32','2026-01-26 14:34:32'),(69,1,NULL,'2026-01-26 14:35:17','2026-01-26 14:35:17'),(70,1,NULL,'2026-01-26 14:36:48','2026-01-26 14:36:48'),(71,1,NULL,'2026-01-26 14:43:03','2026-01-26 14:43:03'),(72,1,NULL,'2026-01-26 14:45:42','2026-01-26 14:45:42'),(73,1,NULL,'2026-01-26 14:45:43','2026-01-26 14:45:43'),(74,1,NULL,'2026-01-26 14:47:11','2026-01-26 14:47:11'),(75,1,NULL,'2026-01-26 14:47:24','2026-01-26 14:47:24'),(76,1,NULL,'2026-01-26 14:47:24','2026-01-26 14:47:24'),(77,1,NULL,'2026-01-26 14:49:01','2026-01-26 14:49:01'),(78,1,NULL,'2026-01-26 14:49:01','2026-01-26 14:49:01'),(79,1,NULL,'2026-01-26 15:36:20','2026-01-26 15:36:20'),(80,1,NULL,'2026-01-26 15:36:20','2026-01-26 15:36:20'),(81,1,NULL,'2026-01-26 15:36:46','2026-01-26 15:36:46'),(82,1,NULL,'2026-01-26 15:36:46','2026-01-26 15:36:46'),(83,1,NULL,'2026-01-26 15:36:58','2026-01-26 15:36:58'),(84,1,NULL,'2026-01-26 15:36:58','2026-01-26 15:36:58'),(85,1,NULL,'2026-01-26 15:37:18','2026-01-26 15:37:18'),(86,1,NULL,'2026-01-26 15:37:18','2026-01-26 15:37:18'),(87,1,NULL,'2026-01-26 15:42:36','2026-01-26 15:42:36'),(88,1,NULL,'2026-01-26 15:42:36','2026-01-26 15:42:36'),(89,8,NULL,'2026-01-26 15:44:49','2026-01-26 15:44:49'),(90,8,NULL,'2026-01-26 15:44:49','2026-01-26 15:44:49'),(91,8,NULL,'2026-01-26 15:44:56','2026-01-26 15:44:56'),(92,8,NULL,'2026-01-26 15:44:56','2026-01-26 15:44:56'),(93,21,NULL,'2026-01-26 15:47:03','2026-01-26 15:47:03'),(94,21,NULL,'2026-01-26 15:47:03','2026-01-26 15:47:03'),(95,1,NULL,'2026-01-26 15:47:07','2026-01-26 15:47:07'),(96,1,NULL,'2026-01-26 15:47:07','2026-01-26 15:47:07'),(97,1,NULL,'2026-01-27 10:26:14','2026-01-27 10:26:14'),(98,1,NULL,'2026-01-27 10:26:14','2026-01-27 10:26:14'),(99,8,NULL,'2026-01-28 09:19:42','2026-01-28 09:19:42'),(100,8,NULL,'2026-01-28 09:19:42','2026-01-28 09:19:42'),(101,5,NULL,'2026-02-03 09:15:39','2026-02-03 09:15:39'),(102,5,NULL,'2026-02-03 09:15:39','2026-02-03 09:15:39'),(103,24,NULL,'2026-02-03 09:25:23','2026-02-03 09:25:23'),(104,4,NULL,'2026-02-06 13:52:16','2026-02-06 13:52:16'),(105,4,NULL,'2026-02-06 13:52:16','2026-02-06 13:52:16'),(106,4,NULL,'2026-02-06 14:39:03','2026-02-06 14:39:03'),(107,4,NULL,'2026-02-06 14:39:03','2026-02-06 14:39:03'),(108,15,NULL,'2026-02-06 17:24:37','2026-02-06 17:24:37'),(109,15,NULL,'2026-02-06 17:24:37','2026-02-06 17:24:37');
/*!40000 ALTER TABLE `listing_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `city_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_fr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `description_fr` text COLLATE utf8mb4_unicode_ci,
  `description_ar` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `price_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'daily',
  `price_unit` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DH/day',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `image_hero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('active','hidden','expired','pending','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `daily_cost` decimal(10,2) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `attributes` json DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `listings_slug_unique` (`slug`),
  KEY `listings_user_id_foreign` (`user_id`),
  KEY `listings_category_id_foreign` (`category_id`),
  KEY `listings_city_id_foreign` (`city_id`),
  CONSTRAINT `listings_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `listings_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `listings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (1,2,8,5,'Dacia Logan 2025','Dacia Logan 2025','عنوان تجريبي: Dacia Logan 2025','dacia-logan-2025','Voiture économique idéale pour la ville. Climatisation, direction assistée. Kilométrage illimité. Disponible immédiatement.','Voiture économique idéale pour la ville. Climatisation, direction assistée. Kilométrage illimité. Disponible immédiatement.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',250.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800\"]','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',0,'rejected',5.00,0,NULL,784,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-19 12:48:30'),(2,3,1,7,'Renault Clio V','Renault Clio V','عنوان تجريبي: Renault Clio V','renault-clio-v','Citadine moderne et confortable. Parfaite pour vos déplacements quotidiens. Faible consommation.','Citadine moderne et confortable. Parfaite pour vos déplacements quotidiens. Faible consommation.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',300.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800\"]','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800',1,'active',5.00,1,NULL,1079,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-08 12:48:30'),(4,5,1,4,'Mercedes Classe C','Mercedes Classe C','عنوان تجريبي: Mercedes Classe C','mercedes-classe-c','Berline de luxe pour vos événements. Intérieur cuir, toit ouvrant. Service chauffeur disponible.','Berline de luxe pour vos événements. Intérieur cuir, toit ouvrant. Service chauffeur disponible.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',900.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800\"]','https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',1,'active',5.00,0,NULL,199,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-05 12:48:30'),(5,2,2,8,'Pelle Hydraulique CAT 320','Pelle Hydraulique CAT 320','عنوان تجريبي: Pelle Hydraulique CAT 320','pelle-hydraulique-cat-320','Excavatrice 20 tonnes. Parfaite pour travaux de terrassement et fondations. Opérateur expérimenté disponible.','Excavatrice 20 tonnes. Parfaite pour travaux de terrassement et fondations. Opérateur expérimenté disponible.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',3500.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800\"]','https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',1,'active',10.00,1,NULL,295,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-05 12:48:30'),(6,3,2,8,'Bulldozer Komatsu D65','Bulldozer Komatsu D65','عنوان تجريبي: Bulldozer Komatsu D65','bulldozer-komatsu-d65','Bulldozer puissant pour nivellement et défrichage. Lame 3.8m. Maintenance à jour.','Bulldozer puissant pour nivellement et défrichage. Lame 3.8m. Maintenance à jour.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',4500.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1579315044485-282424bca978?q=80&w=800\"]','https://images.unsplash.com/photo-1579315044485-282424bca978?q=80&w=800',1,'active',10.00,0,NULL,536,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-18 12:48:30'),(8,5,2,7,'Compacteur Vibrant BOMAG','Compacteur Vibrant BOMAG','عنوان تجريبي: Compacteur Vibrant BOMAG','compacteur-vibrant-bomag','Rouleau compacteur pour travaux routiers. Largeur de travail 2.1m. Parfait état.','Rouleau compacteur pour travaux routiers. Largeur de travail 2.1m. Parfait état.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',2200.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800\"]','https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',1,'active',10.00,0,NULL,1384,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-13 12:48:30'),(9,2,3,7,'Camion Benne 20T','Camion Benne 20T','عنوان تجريبي: Camion Benne 20T','camion-benne-20t','Camion benne pour transport de matériaux. Capacité 20 tonnes. Chauffeur inclus sur demande.','Camion benne pour transport de matériaux. Capacité 20 tonnes. Chauffeur inclus sur demande.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',1800.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800\"]','https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800',1,'active',7.00,0,NULL,187,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-03 12:48:30'),(10,3,3,7,'Semi-Remorque 40T','Semi-Remorque 40T','عنوان تجريبي: Semi-Remorque 40T','semi-remorque-40t','Transport longue distance. Plateau 13.6m. Idéal pour fret international Maroc-Europe.','Transport longue distance. Plateau 13.6m. Idéal pour fret international Maroc-Europe.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',3500.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1586191582066-bdb898e906bd?q=80&w=800\"]','https://images.unsplash.com/photo-1586191582066-bdb898e906bd?q=80&w=800',1,'active',7.00,0,NULL,476,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-21 12:48:30'),(12,2,5,3,'Autocar Tourisme 55 Places','Autocar Tourisme 55 Places','عنوان تجريبي: Autocar Tourisme 55 Places','autocar-tourisme-55-places','Bus grand tourisme climatisé. Sièges inclinables, WiFi, écrans LCD. Idéal excursions et événements.','Bus grand tourisme climatisé. Sièges inclinables, WiFi, écrans LCD. Idéal excursions et événements.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',4500.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800\"]','https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800',1,'rejected',7.00,1,NULL,793,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-11 12:48:30'),(13,3,5,3,'Minibus Mercedes 19 Places','Minibus Mercedes 19 Places','عنوان تجريبي: Minibus Mercedes 19 Places','minibus-mercedes-19-places','Minibus confortable pour groupes. Climatisation, bagages. Chauffeur professionnel.','Minibus confortable pour groupes. Climatisation, bagages. Chauffeur professionnel.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',2000.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800\"]','https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800',1,'active',7.00,0,NULL,1239,'2026-01-25 12:30:59','2026-02-06 17:25:39','2025-12-28 12:48:30'),(15,2,7,7,'Chauffeur Poids Lourd - Permis EC','Chauffeur Poids Lourd - Permis EC','عنوان تجريبي: Chauffeur Poids Lourd - Permis EC','chauffeur-poids-lourd-permis-ec','15 ans d\'expérience. Transport national et international. Disponible immédiatement pour missions longues.','15 ans d\'expérience. Transport national et international. Disponible immédiatement pour missions longues.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',500.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800\"]','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',1,'active',3.00,1,NULL,965,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-17 12:48:30'),(16,3,7,7,'Opérateur Grue Mobile','Opérateur Grue Mobile','عنوان تجريبي: Opérateur Grue Mobile','operateur-grue-mobile','Certifié CACES. Expérience chantiers BTP et industrie. Rigueur et sécurité.','Certifié CACES. Expérience chantiers BTP et industrie. Rigueur et sécurité.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',700.00,'daily','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800\"]','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800',1,'active',3.00,0,NULL,86,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-10 12:48:30'),(18,2,8,8,'Excavatrice Volvo EC210 - Occasion','Excavatrice Volvo EC210 - Occasion','عنوان تجريبي: Excavatrice Volvo EC210 - Occasion','excavatrice-volvo-ec210-occasion','Année 2019, 5000h. Entretien complet chez concessionnaire. Prête à travailler.','Année 2019, 5000h. Entretien complet chez concessionnaire. Prête à travailler.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',850000.00,'fixed','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800\"]','https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',1,'active',8.00,1,NULL,486,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-07 12:48:30'),(19,3,8,7,'Chargeuse Caterpillar 950H','Chargeuse Caterpillar 950H','عنوان تجريبي: Chargeuse Caterpillar 950H','chargeuse-caterpillar-950h','Année 2017, 7500h. Godet 3m³. Pneus neufs. Excellent état général.','Année 2017, 7500h. Godet 3m³. Pneus neufs. Excellent état général.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',680000.00,'fixed','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800\"]','https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',1,'active',8.00,0,NULL,1093,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-07 12:48:30'),(20,2,9,5,'Camion Renault Premium 380','Camion Renault Premium 380','عنوان تجريبي: Camion Renault Premium 380','camion-renault-premium-380','Année 2018, 450 000 km. Porteur 19T. Idéal pour transport régional.','Année 2018, 450 000 km. Porteur 19T. Idéal pour transport régional.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',320000.00,'fixed','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800\"]','https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800',1,'active',6.00,0,NULL,707,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-16 12:48:30'),(21,3,9,9,'Tracteur Routier Volvo FH','Tracteur Routier Volvo FH','عنوان تجريبي: Tracteur Routier Volvo FH','tracteur-routier-volvo-fh','Année 2020, 280 000 km. Boîte auto I-Shift. Cabine XL. Excellent état.','Année 2020, 280 000 km. Boîte auto I-Shift. Cabine XL. Excellent état.','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',580000.00,'fixed','DH',NULL,NULL,'[\"https://images.unsplash.com/photo-1586191582066-bdb898e906bd?q=80&w=800\"]','https://images.unsplash.com/photo-1586191582066-bdb898e906bd?q=80&w=800',1,'active',6.00,1,NULL,1189,'2026-01-25 12:30:59','2026-02-06 17:25:39','2026-01-18 12:48:30'),(24,7,1,NULL,'Secured Listing','Secured Listing','عنوان تجريبي: Secured Listing','sec-list-69788f45cf4ec','Secure me','Secure me','وصف تجريبي باللغة العربية لهذا الإعلان. هذا النص هو مجرد مثال لعرض الامكانيات.',1000.00,'daily','DH/day',NULL,NULL,NULL,NULL,1,'active',NULL,0,NULL,1,'2026-01-27 09:11:17','2026-02-06 17:25:39',NULL);
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint unsigned NOT NULL,
  `receiver_id` bigint unsigned NOT NULL,
  `listing_id` bigint unsigned DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_sender_id_foreign` (`sender_id`),
  KEY `messages_receiver_id_foreign` (`receiver_id`),
  KEY `messages_listing_id_foreign` (`listing_id`),
  CONSTRAINT `messages_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,2,2,NULL,'Bonjour, je suis intéressé par votre annonce \"Dacia Logan 2025\". Est-elle toujours disponible ?','2026-01-27 10:26:28','2026-01-27 10:26:20','2026-01-27 10:26:28'),(2,2,2,NULL,'re','2026-01-27 14:49:15','2026-01-27 13:29:07','2026-01-27 14:49:15');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_01_24_093419_create_categories_table',1),(5,'2026_01_24_093420_create_cities_table',1),(6,'2026_01_24_093420_create_listings_table',1),(7,'2026_01_24_093425_create_bookings_table',1),(8,'2026_01_24_093426_create_reviews_table',1),(9,'2026_01_24_093427_create_messages_table',1),(10,'2026_01_24_093435_create_wallets_table',1),(11,'2026_01_24_093436_create_wallet_transactions_table',1),(12,'2026_01_24_093440_create_notifications_table',1),(13,'2026_01_24_095326_create_settings_table',1),(14,'2026_01_24_100820_add_multilanguage_fields_to_categories_and_cities',1),(15,'2026_01_24_100957_add_multilanguage_to_settings',1),(16,'2026_01_24_141053_add_show_on_homepage_to_categories_table',1),(17,'2026_01_24_211904_create_personal_access_tokens_table',1),(18,'2026_01_24_220000_enhance_wallet_system',1),(19,'2026_01_24_220001_add_daily_cost_to_categories',1),(20,'2026_01_25_120454_update_listings_table_structure',1),(21,'2026_01_25_120455_create_listing_category_tables',1),(22,'2026_01_25_120616_change_category_type_to_string',1),(23,'2026_01_25_123214_create_otps_table',1),(24,'2026_01_25_134007_add_image_hero_to_listings_table',2),(25,'2026_01_25_134219_create_favorites_table',3),(26,'2026_01_26_103223_create_listing_views_table',4),(27,'2026_01_25_150300_create_payment_methods_table',5),(28,'2026_01_26_154504_drop_location_from_listings_table',5),(29,'2026_01_27_100436_create_listing_specifications_tables',6),(30,'2026_02_06_145428_add_bilingual_fields_to_listings_table',7);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('18997f63-8247-4ab4-b31e-41e13159f4f8','App\\Notifications\\ListingApprovedNotification','App\\Models\\User',2,'{\"listing_id\":5,\"title\":\"Annonce Valid\\u00e9e\",\"message\":\"Votre annonce \'Pelle Hydraulique CAT 320\' a \\u00e9t\\u00e9 valid\\u00e9e et est maintenant en ligne.\",\"type\":\"listing_approved\"}',NULL,'2026-02-04 19:02:06','2026-02-04 19:02:06'),('8fc3e9ec-663a-4194-8391-b9857a03bffb','App\\Notifications\\ListingApprovedNotification','App\\Models\\User',2,'{\"listing_id\":9,\"title\":\"Annonce Valid\\u00e9e\",\"message\":\"Votre annonce \'Camion Benne 20T\' a \\u00e9t\\u00e9 valid\\u00e9e et est maintenant en ligne.\",\"type\":\"listing_approved\"}',NULL,'2026-02-03 10:59:49','2026-02-03 10:59:49'),('9a0787a3-55b1-4244-b6a3-be09a6e888b6','App\\Notifications\\ListingApprovedNotification','App\\Models\\User',2,'{\"listing_id\":1,\"title\":\"Annonce Valid\\u00e9e\",\"message\":\"Votre annonce \'Dacia Logan 2025\' a \\u00e9t\\u00e9 valid\\u00e9e et est maintenant en ligne.\",\"type\":\"listing_approved\"}',NULL,'2026-02-04 19:01:38','2026-02-04 19:01:38');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_ar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `description_ar` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `config` json DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_methods_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'bank_transfer','Virement Bancaire','تحويل بنكي',NULL,NULL,1,NULL,1,'landmark','2026-01-25 13:05:12','2026-01-25 13:05:12'),(2,'cmi','Carte Bancaire (CMI)','البطاقة البنكية',NULL,NULL,1,NULL,2,'credit-card','2026-01-25 13:05:12','2026-01-25 13:05:12'),(3,'cashplus','Cash Plus','كاش بلس',NULL,NULL,1,NULL,3,'banknote','2026-01-25 13:05:12','2026-01-25 13:05:12');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (7,'App\\Models\\User',2,'parq-auth','210bf62f86ee430d5e6a897b082922e9a5d23319802c49ad5d36e1c3be431211','[\"*\"]','2026-02-06 17:24:34',NULL,'2026-02-03 09:15:03','2026-02-06 17:24:34');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  KEY `reviews_listing_id_foreign` (`listing_id`),
  CONSTRAINT `reviews_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('2bJ7VbmMmm2ze097h9UlxctlJiiq24B5L70e4xPm',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidlFuYURVRk9ib29RTnlXdFN2OU5DV0RvOHpRMUc4UVhhaGR6M2s0RSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1770388689),('5hm2VsmeZhNMkraHvSsWDi53H9bwlSCisTiw6EWI',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVmVZNG1qc2xZdU8zeWptcldtaGt6MUlIdm9LeW5kMmFNMzg2T3VGUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1769347738),('7Lco6kK3DEdMlt9paAA9zn2gjbb70Qd0hUuZRY9m',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRTlTWjRiNncyOHBiY0taZ1BsREFVcGFWeFhFaHFMZDFTNlprdmEzTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1770388724),('hfztOmvBMtKRw8wvRpv9mYuGVpnJBCr65nmlsNkk',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidUQxN29nVlo4RlRHc2RMd01sQ2wweXVWblZyOHlHd05Sa0IzSUFUZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1770388689),('VqH3GO3Seg6xuaGhVVVzPfQR1DIK5pWY9oIvSk5y',NULL,'127.0.0.1','curl/8.7.1','YToyOntzOjY6Il90b2tlbiI7czo0MDoiS2tiV3ExZFQ4dnN6VEZjWTdlZTdtZGtWYzY5VWF2aVRXalhhTlpvSSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1769439169);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `value_fr` text COLLATE utf8mb4_unicode_ci,
  `value_ar` text COLLATE utf8mb4_unicode_ci,
  `group` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'homepage_listings_count','6',NULL,NULL,'general','string','2026-01-25 22:39:18','2026-01-25 22:39:18');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topup_requests`
--

DROP TABLE IF EXISTS `topup_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topup_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `amount` int NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `proof_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `approved_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `topup_requests_user_id_foreign` (`user_id`),
  KEY `topup_requests_approved_by_foreign` (`approved_by`),
  CONSTRAINT `topup_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `topup_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topup_requests`
--

LOCK TABLES `topup_requests` WRITE;
/*!40000 ALTER TABLE `topup_requests` DISABLE KEYS */;
INSERT INTO `topup_requests` VALUES (1,2,2000,'bank_transfer','approved',NULL,'VIR-697744E1AA674-1769424097',NULL,2,'2026-01-26 10:01:00',NULL,'2026-01-26 09:41:37','2026-01-26 10:01:00'),(2,2,2000,'bank_transfer','approved',NULL,'VIR-697745B9B3D98-1769424313',NULL,2,'2026-01-26 10:10:49',NULL,'2026-01-26 09:45:13','2026-01-26 10:10:49'),(3,2,2000,'bank_transfer','approved',NULL,'VIR-697745C697E3D-1769424326',NULL,2,'2026-01-27 14:49:02',NULL,'2026-01-26 09:45:26','2026-01-27 14:49:02'),(4,2,100,'bank_transfer','pending',NULL,'VIR-6977462BD7451-1769424427',NULL,NULL,NULL,NULL,'2026-01-26 09:47:07','2026-01-26 09:47:07'),(5,2,100,'bank_transfer','pending',NULL,'VIR-6977482FA4223-1769424943',NULL,NULL,NULL,NULL,'2026-01-26 09:55:43','2026-01-26 09:55:43'),(6,2,100,'bank_transfer','pending',NULL,'VIR-6977490F3BDD4-1769425167',NULL,NULL,NULL,NULL,'2026-01-26 09:59:27','2026-01-26 09:59:27'),(7,2,5000,'bank_transfer','approved',NULL,'VIR-69779873038F2-1769445491',NULL,2,'2026-01-26 15:39:01',NULL,'2026-01-26 15:38:11','2026-01-26 15:39:01'),(8,2,100,'bank_transfer','pending',NULL,'VIR-6979E327EDC09-1769595687',NULL,NULL,NULL,NULL,'2026-01-28 09:21:27','2026-01-28 09:21:27');
/*!40000 ALTER TABLE `topup_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('user','provider','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Anas Admin','anas@parq.ma','2026-01-25 12:48:29','$2y$12$D8Shq/RgnKIzy6rLXpX/leKYDy6uUcHbtPYohXvaE7lHxs0/RD24m',NULL,'+212 6 00 00 00 01',NULL,'admin',NULL,'2026-01-25 12:30:58','2026-01-25 12:48:30'),(3,'Mohammed Khalidi','mohammed@example.com','2026-01-25 12:48:29','$2y$12$7FhUGwrHX4QUVr2/nrqxw.UYrCVENCXxAkoFTvLoXdQYp33WzPXGS',NULL,'+212 6 12 34 56 78',NULL,'user',NULL,'2026-01-25 12:30:58','2026-01-25 12:48:30'),(5,'Ahmed Bennani','ahmed@example.com','2026-01-25 12:48:30','$2y$12$wFgoZ9cqTNvm9f6XrJ3Lu.3VA9CKRKA8mmE3alLdZrx3ahtV7POh2',NULL,'+212 6 55 44 33 22',NULL,'user',NULL,'2026-01-25 12:30:58','2026-01-25 12:48:30'),(6,'Youssef Transport','youssef@example.com','2026-01-25 12:48:30','$2y$12$Pe7YVDYJU6.INxSuaf48XexR47w.OU/T4QkyeL1oeCR.hlrumRlR.',NULL,'+212 6 11 22 33 44',NULL,'user',NULL,'2026-01-25 12:30:59','2026-01-25 12:48:30'),(7,'Dr. Miguel Nitzsche','owner@test.com','2026-01-27 09:11:17','$2y$12$LZHa3DibqbX4TAf2yP0BVexXzRSH3MYCv0m0KhXe1Vdk2jMwfe8ra',NULL,NULL,NULL,'user','J39O2j5IFs','2026-01-27 09:11:17','2026-01-27 09:11:17'),(8,'Dillan Schamberger I','attacker@test.com','2026-01-27 09:11:17','$2y$12$LZHa3DibqbX4TAf2yP0BVexXzRSH3MYCv0m0KhXe1Vdk2jMwfe8ra',NULL,NULL,NULL,'user','mTkqEISbpk','2026-01-27 09:11:17','2026-01-27 09:11:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet_transactions`
--

DROP TABLE IF EXISTS `wallet_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wallet_id` bigint unsigned NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `amount` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wallet_transactions_wallet_id_foreign` (`wallet_id`),
  KEY `wallet_transactions_reference_type_reference_id_index` (`reference_type`,`reference_id`),
  CONSTRAINT `wallet_transactions_wallet_id_foreign` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_transactions`
--

LOCK TABLES `wallet_transactions` WRITE;
/*!40000 ALTER TABLE `wallet_transactions` DISABLE KEYS */;
INSERT INTO `wallet_transactions` VALUES (2,2,'bonus','system',100,'Bonus de bienvenue',NULL,NULL,NULL,'2026-01-25 12:30:58','2026-01-25 12:30:58'),(3,3,'bonus','system',100,'Bonus de bienvenue',NULL,NULL,NULL,'2026-01-25 12:30:58','2026-01-25 12:30:58'),(5,5,'bonus','system',100,'Bonus de bienvenue',NULL,NULL,NULL,'2026-01-25 12:30:58','2026-01-25 12:30:58'),(6,6,'bonus','system',100,'Bonus de bienvenue',NULL,NULL,NULL,'2026-01-25 12:30:59','2026-01-25 12:30:59'),(7,2,'topup_manual','bank_transfer',2000,'Recharge approuvée: VIR-697744E1AA674-1769424097','App\\Models\\TopUpRequest',1,'{\"approved_at\": \"2026-01-26T11:01:00+00:00\", \"approved_by\": 2}','2026-01-26 10:01:00','2026-01-26 10:01:00'),(8,2,'topup_manual','bank_transfer',2000,'Recharge approuvée: VIR-697745B9B3D98-1769424313','App\\Models\\TopUpRequest',2,'{\"approved_at\": \"2026-01-26T11:10:49+00:00\", \"approved_by\": 2}','2026-01-26 10:10:49','2026-01-26 10:10:49'),(9,2,'topup_manual','bank_transfer',5000,'Recharge approuvée: VIR-69779873038F2-1769445491','App\\Models\\TopUpRequest',7,'{\"approved_at\": \"2026-01-26T16:39:01+00:00\", \"approved_by\": 2}','2026-01-26 15:39:01','2026-01-26 15:39:01'),(10,7,'bonus','system',100,'Bonus de bienvenue',NULL,NULL,NULL,'2026-01-27 09:11:17','2026-01-27 09:11:17'),(11,8,'bonus','system',100,'Bonus de bienvenue',NULL,NULL,NULL,'2026-01-27 09:11:17','2026-01-27 09:11:17'),(12,2,'topup_manual','bank_transfer',2000,'Recharge approuvée: VIR-697745C697E3D-1769424326','App\\Models\\TopUpRequest',3,'{\"approved_at\": \"2026-01-27T15:49:02+00:00\", \"approved_by\": 2}','2026-01-27 14:49:02','2026-01-27 14:49:02');
/*!40000 ALTER TABLE `wallet_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `balance` int NOT NULL DEFAULT '0',
  `currency_label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SOLD DIRHAM',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wallets_user_id_foreign` (`user_id`),
  CONSTRAINT `wallets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
INSERT INTO `wallets` VALUES (2,2,11100,'SOLD DIRHAM','2026-01-25 12:30:58','2026-01-27 14:49:02'),(3,3,100,'SOLD DIRHAM','2026-01-25 12:30:58','2026-01-25 12:30:58'),(5,5,100,'SOLD DIRHAM','2026-01-25 12:30:58','2026-01-25 12:30:58'),(6,6,100,'SOLD DIRHAM','2026-01-25 12:30:59','2026-01-25 12:30:59'),(7,7,100,'SOLD DIRHAM','2026-01-27 09:11:17','2026-01-27 09:11:17'),(8,8,100,'SOLD DIRHAM','2026-01-27 09:11:17','2026-01-27 09:11:17');
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-07 13:04:02
