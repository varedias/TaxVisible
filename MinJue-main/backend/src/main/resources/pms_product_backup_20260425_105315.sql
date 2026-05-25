-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: minjue_db
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `pms_product`
--

DROP TABLE IF EXISTS `pms_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `name` varchar(200) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `image` varchar(255) DEFAULT NULL COMMENT 'Main Image',
  `album` text COMMENT 'Image Album (JSON)',
  `description` text,
  `specs` text COMMENT 'Specifications (JSON)',
  `status` tinyint DEFAULT '1' COMMENT '1:On Sale, 0:Off Sale',
  `sales` int DEFAULT '0',
  `views` int DEFAULT '0',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Products';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_product`
--

LOCK TABLES `pms_product` WRITE;
/*!40000 ALTER TABLE `pms_product` DISABLE KEYS */;
INSERT INTO `pms_product` VALUES (1,1,1,'民崛智能模具视觉监测装置 MJ-VIS-A8',35800.00,42000.00,100,'/products/minjue-product-1.png',NULL,'专业模具视觉监测系统，实时监控模具状态，AI智能识别异常，适用于注塑、压铸等行业','[\"高清工业相机\",\"智能算法\",\"实时监控\",\"异常报警\"]',1,856,12500,'2026-01-29 11:04:41'),(2,1,1,'民崛智能模具保护监视器 MJ-MP-PRO',28900.00,35000.00,80,'/products/mold-protector.svg',NULL,'实时监控模具运行状态，自动检测异常，防止模具损坏，降低生产成本','[\"模具保护\",\"实时检测\",\"自动报警\",\"数据记录\"]',1,1023,15800,'2026-01-29 11:04:41'),(3,1,1,'民崛智能缺陷检测系统 MJ-QC-3000',42000.00,50000.00,50,'/products/minjue-product-3.png',NULL,'采用深度学习算法，精准识别产品表面缺陷，检测精度高达99.5%','[\"深度学习\",\"高精度检测\",\"多种缺陷识别\",\"自动分类\"]',1,645,9800,'2026-01-29 11:04:41'),(4,2,2,'牧河自动化上料机 MH-FL-200',18900.00,22000.00,200,'/products/auto-feeder.svg',NULL,'全自动上料系统，适用于各类生产线，提升生产效率','[\"自动上料\",\"高效稳定\",\"多规格适配\"]',1,1234,18502,'2026-01-29 11:04:41'),(5,3,1,'海康威视AI视觉检测系统 VIS-2000',28900.00,35000.00,60,'/products/ai-vision-system.svg',NULL,'2D+3D双模式, 深度学习算法, 0.1mm精度','[\"2D+3D双模式\",\"深度学习算法\",\"0.1mm精度\"]',1,1245,15600,'2026-01-29 11:04:41'),(6,4,3,'Basler ace系列工业相机套装',4299.00,4999.00,500,'/products/industrial-camera.svg',NULL,'200万像素, GigE接口, 含镜头','[\"200万像素\",\"GigE接口\",\"含镜头\"]',1,2234,25004,'2026-01-29 11:04:41'),(7,5,4,'CCS LED环形光源 LDR2-100',680.00,800.00,1000,'/products/led-ring-light.svg',NULL,'高亮度, 可调光, 多种规格','[\"高亮度\",\"可调光\",\"多种规格\"]',1,5678,35006,'2026-01-29 11:04:41'),(8,6,5,'基恩士3D激光轮廓仪',15800.00,18000.00,30,'/products/vision-monitor.svg',NULL,'超高精度3D测量, 适用于各种材质','[\"微米级精度\",\"抗干扰\",\"多材质适用\"]',1,567,8900,'2026-01-29 11:04:41'),(9,6,6,'ABB工业机器人IRB 1200',45000.00,52000.00,20,'/products/qc-system.svg',NULL,'5kg/7kg负载, 适用于装配和物料搬运','[\"高速\",\"紧凑型\",\"5kg/7kg负载\"]',1,345,6500,'2026-01-29 11:04:41'),(10,4,4,'远心镜头 50mm',1200.00,1500.00,300,'/products/telecentric-lens.svg',NULL,'支持2/3英寸靶面, C接口','[\"低畸变\",\"高分辨率\",\"C接口\"]',1,890,11200,'2026-01-29 11:04:41');
/*!40000 ALTER TABLE `pms_product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-25 10:53:15
