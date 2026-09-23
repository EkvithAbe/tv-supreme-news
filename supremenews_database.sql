-- MySQL dump 10.13  Distrib 26.7.0, for macos15.7 (arm64)
--
-- Host: 127.0.0.1    Database: supremenews
-- ------------------------------------------------------
-- Server version	26.7.0

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

-- Ensure database is created and selected with full utf8mb4 multi-byte character support
CREATE DATABASE IF NOT EXISTS `supremenews` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `supremenews`;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

--
-- Table structure for table `ActivityLog`
--

DROP TABLE IF EXISTS `ActivityLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActivityLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resourceType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resourceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ActivityLog_actorId_createdAt_idx` (`actorId`,`createdAt`),
  KEY `ActivityLog_resourceType_resourceId_idx` (`resourceType`,`resourceId`),
  CONSTRAINT `ActivityLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActivityLog`
--

LOCK TABLES `ActivityLog` WRITE;
/*!40000 ALTER TABLE `ActivityLog` DISABLE KEYS */;
INSERT INTO `ActivityLog` VALUES ('cmucah4ug0006tlwf6a08xf2u','cmu6tvec10000ecwfvdxwxns3','ARTICLE_SCHEDULED','ARTICLE','cmucah4u70004tlwf40nlxiy9','Scheduled article: erg','2026-09-22 06:24:29.896'),('cmucaiq720007tlwfp9c6qnm0','cmu6tvec10000ecwfvdxwxns3','ARTICLE_SCHEDULED','ARTICLE','cmucah4u70004tlwf40nlxiy9','Scheduled article: erg','2026-09-22 06:25:44.222'),('cmucak36y0008tlwfaq2mo0n6','cmu6tvec10000ecwfvdxwxns3','ARTICLE_STATUS_APPROVED','ARTICLE','cmucah4u70004tlwf40nlxiy9','Changed article status to APPROVED: erg','2026-09-22 06:26:47.722'),('cmucawn45000btlwfgsod67v9','cmu6tvec10000ecwfvdxwxns3','ARTICLE_CREATED','ARTICLE','cmucawn3u0009tlwfeyx1ocnt','Created article: Railway Strike Disruptions','2026-09-22 06:36:33.413'),('cmucaz72l000gtlwfmpbxbj3a','cmu6tvec10000ecwfvdxwxns3','ARTICLE_PUBLISHED','ARTICLE','cmucaz727000etlwfn9rtq275','Published article: Railway Strike Disruptions','2026-09-22 06:38:32.589'),('cmucb8zs8000ktlwf0ydueopk','cmu6tvec10000ecwfvdxwxns3','ARTICLE_PUBLISHED','ARTICLE','cmucb8zry000htlwfqb0xix3i','Published article: Railway Strike Disruptions','2026-09-22 06:46:09.704'),('cmucc9p9a000otlwf1invjlxg','cmu6tvec10000ecwfvdxwxns3','ARTICLE_PUBLISHED','ARTICLE','cmucc9p91000mtlwfr13diqem','Published article: Sri Lanka–Thailand Cooperation','2026-09-22 07:14:42.334'),('cmuccof4p000stlwfyemdvp2l','cmu6tvec10000ecwfvdxwxns3','ARTICLE_PUBLISHED','ARTICLE','cmucah4u70004tlwf40nlxiy9','Published article: Revenue Milestones','2026-09-22 07:26:09.049'),('cmucdzay8000wtlwfcf3a7vp1','cmu6tvec10000ecwfvdxwxns3','ARTICLE_PUBLISHED','ARTICLE','cmucdzaxy000utlwfc5y2x1uf','Published article: National Squad Rebuilding','2026-09-22 08:02:36.464');
/*!40000 ALTER TABLE `ActivityLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Article`
--

DROP TABLE IF EXISTS `Article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Article` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DRAFT','REVIEW','APPROVED','SCHEDULED','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mainImageId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isBreaking` tinyint(1) NOT NULL DEFAULT '0',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `showOnHomepage` tinyint(1) NOT NULL DEFAULT '0',
  `showInLatest` tinyint(1) NOT NULL DEFAULT '1',
  `views` int NOT NULL DEFAULT '0',
  `publishedAt` datetime(3) DEFAULT NULL,
  `scheduledAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Article_slug_key` (`slug`),
  KEY `Article_categoryId_fkey` (`categoryId`),
  KEY `Article_authorId_fkey` (`authorId`),
  KEY `Article_mainImageId_fkey` (`mainImageId`),
  CONSTRAINT `Article_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Article_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Article_mainImageId_fkey` FOREIGN KEY (`mainImageId`) REFERENCES `Media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Article`
--

LOCK TABLES `Article` WRITE;
/*!40000 ALTER TABLE `Article` DISABLE KEYS */;
INSERT INTO `Article` VALUES ('cmu6tvedl001decwfqjaio98p','sri-lanka-economic-growth-accelerates','PUBLISHED','cmu6tvecd0001ecwf8cfel2nj','cmu6tvec10000ecwfvdxwxns3',NULL,1,1,1,1,0,'2026-09-18 10:40:51.079',NULL,'2026-09-18 10:40:51.081','2026-09-18 10:40:51.081'),('cmu6tvedp001hecwfod5lxvud','global-climate-summit-agrees-on-new-goals','PUBLISHED','cmu6tvecg0005ecwf6m9bjtzi','cmu6tvec10000ecwfvdxwxns3',NULL,0,1,1,1,0,'2026-09-18 10:40:51.084',NULL,'2026-09-18 10:40:51.085','2026-09-18 10:40:51.085'),('cmu6tveds001jecwfn1jk9f1a','parliament-debates-key-reforms','PUBLISHED','cmu6tvecj0009ecwfwjm3ydtf','cmu6tvec10000ecwfvdxwxns3',NULL,0,0,1,1,0,'2026-09-18 10:40:51.087',NULL,'2026-09-18 10:40:51.088','2026-09-18 10:40:51.088'),('cmu6tvedu001lecwfd1roz6zz','tech-innovations-power-next-generation-ai','PUBLISHED','cmu6tvecr000pecwfhw2wdkjn','cmu6tvec10000ecwfvdxwxns3',NULL,0,1,1,1,0,'2026-09-18 10:40:51.089',NULL,'2026-09-18 10:40:51.090','2026-09-18 10:40:51.090'),('cmu6tvedv001necwf8ei1yadt','cricket-national-team-gears-up-for-series','PUBLISHED','cmu6tvecn000hecwfzozt6se2','cmu6tvec10000ecwfvdxwxns3',NULL,1,0,1,1,0,'2026-09-18 10:40:51.091',NULL,'2026-09-18 10:40:51.091','2026-09-18 10:40:51.091'),('cmu6tvedx001pecwfsz7im1o6','markets-rally-as-investor-confidence-surges','PUBLISHED','cmu6tvecl000decwfzffb693q','cmu6tvec10000ecwfvdxwxns3',NULL,0,0,1,1,0,'2026-09-18 10:40:51.093',NULL,'2026-09-18 10:40:51.093','2026-09-18 10:40:51.093'),('cmu6wa1ks0000ewwfaa94a3vs','supreme-news-launches-next-gen-digital-platform','PUBLISHED','cmu6tvecl000decwfzffb693q','cmu6tvec10000ecwfvdxwxns3',NULL,0,1,1,1,0,'2026-09-18 11:48:13.553',NULL,'2026-09-18 11:48:13.564','2026-09-18 11:48:13.564'),('cmucah4u70004tlwf40nlxiy9','revenue-milestones','PUBLISHED','cmu6tvecl000decwfzffb693q','cmu6tvec10000ecwfvdxwxns3','cmuccnvtx000rtlwf9z1k0csw',0,1,1,1,0,'2026-09-22 06:27:00.000',NULL,'2026-09-22 06:24:29.887','2026-09-22 07:26:09.031'),('cmucawn3u0009tlwfeyx1ocnt','railway-strike-disruptions','REVIEW','cmu6tvecd0001ecwf8cfel2nj','cmu6tvec10000ecwfvdxwxns3',NULL,0,1,1,1,0,NULL,NULL,'2026-09-22 06:36:33.402','2026-09-22 06:36:33.402'),('cmucaz727000etlwfn9rtq275','strike-disruptions','PUBLISHED','cmu6tvecd0001ecwf8cfel2nj','cmu6tvec10000ecwfvdxwxns3','cmucaxtzo000ctlwfts11o70l',0,1,1,1,0,'2026-09-22 06:38:32.572',NULL,'2026-09-22 06:38:32.576','2026-09-22 06:38:32.576'),('cmucb8zry000htlwfqb0xix3i','train','PUBLISHED','cmu6tvecd0001ecwf8cfel2nj','cmu6tvec10000ecwfvdxwxns3','cmucaxtzo000ctlwfts11o70l',0,1,1,1,0,'2026-09-22 06:46:09.692',NULL,'2026-09-22 06:46:09.694','2026-09-22 06:46:09.694'),('cmucc9p91000mtlwfr13diqem','sri-lankathailand-cooperation','PUBLISHED','cmu6tvecg0005ecwf6m9bjtzi','cmu6tvec10000ecwfvdxwxns3','cmucc9ij8000ltlwfejccdjtq',0,0,0,1,0,'2026-09-22 07:14:42.322',NULL,'2026-09-22 07:14:42.325','2026-09-22 07:14:42.325'),('cmucdzaxy000utlwfc5y2x1uf','national-squad-rebuilding','PUBLISHED','cmu6tvecn000hecwfzozt6se2','cmu6tvec10000ecwfvdxwxns3','cmucdz0tj000ttlwfv11ce051',0,0,0,1,0,'2026-09-22 08:02:36.452',NULL,'2026-09-22 08:02:36.454','2026-09-22 08:02:36.454');
/*!40000 ALTER TABLE `Article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ArticleMedia`
--

DROP TABLE IF EXISTS `ArticleMedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ArticleMedia` (
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mediaId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`articleId`,`mediaId`),
  KEY `ArticleMedia_mediaId_fkey` (`mediaId`),
  CONSTRAINT `ArticleMedia_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ArticleMedia_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArticleMedia`
--

LOCK TABLES `ArticleMedia` WRITE;
/*!40000 ALTER TABLE `ArticleMedia` DISABLE KEYS */;
INSERT INTO `ArticleMedia` VALUES ('cmucaz727000etlwfn9rtq275','cmucayzl0000dtlwfap9tsooj',0);
/*!40000 ALTER TABLE `ArticleMedia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ArticleTag`
--

DROP TABLE IF EXISTS `ArticleTag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ArticleTag` (
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`articleId`,`tagId`),
  KEY `ArticleTag_tagId_fkey` (`tagId`),
  CONSTRAINT `ArticleTag_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ArticleTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArticleTag`
--

LOCK TABLES `ArticleTag` WRITE;
/*!40000 ALTER TABLE `ArticleTag` DISABLE KEYS */;
/*!40000 ALTER TABLE `ArticleTag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ArticleTranslation`
--

DROP TABLE IF EXISTS `ArticleTranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ArticleTranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` enum('EN','SI','TA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDescription` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ArticleTranslation_articleId_language_key` (`articleId`,`language`),
  CONSTRAINT `ArticleTranslation_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArticleTranslation`
--

LOCK TABLES `ArticleTranslation` WRITE;
/*!40000 ALTER TABLE `ArticleTranslation` DISABLE KEYS */;
INSERT INTO `ArticleTranslation` VALUES ('cmu6tvedm001eecwf2az7py6k','cmu6tvedl001decwfqjaio98p','EN','Sri Lanka\'s Economic Recovery Gains Momentum in Key Sectors','Tourism, industrial exports, and foreign remittances record a strong surge this quarter.','<p>Sri Lanka\'s economy is experiencing positive momentum driven by a strong rebound in tourism and robust export earnings. Industry leaders and financial analysts express optimism as fiscal indicators remain stable.</p>',NULL,NULL),('cmu6tvedm001fecwflibyd751','cmu6tvedl001decwfqjaio98p','SI','ශ්‍රී ලංකා ආර්ථික පුනර්ජීවනය ප්‍රධාන ක්ෂේත්‍ර හරහා වේගවත් වෙයි','සංචාරක සහ විදේශ ප්‍රේෂණ ආදායම් සැලකිය යුතු ලෙස වර්ධනය වෙයි.','<p>ශ්‍රී ලංකාවේ ආර්ථික වර්ධනය ස්ථාවර මට්ටමක පවතින බව මූල්‍ය විශේෂඥයින් පවසයි.</p>',NULL,NULL),('cmu6tvedm001gecwfwu6tmam1','cmu6tvedl001decwfqjaio98p','TA','இலங்கையின் பொருளாதார மீட்சி முக்கிய துறைகளில் வேகம் பெறுகிறது','சுற்றுலா மற்றும் வெளிநாட்டு வருவாய் கணிசமாக அதிகரித்துள்ளது.','<p>இலங்கையின் பொருளாதாரம் தொடர்ச்சியான முன்னேற்றத்தை எட்டி வருகிறது.</p>',NULL,NULL),('cmu6tvedp001iecwfgu0fse83','cmu6tvedp001hecwfod5lxvud','EN','Global Leaders Reach Historic Consensus at International Climate Summit','Delegates commit to doubling renewable energy investments by 2030.','<p>World leaders gathered this week to finalize groundbreaking agreements aimed at accelerating green energy transition and reducing emissions globally.</p>',NULL,NULL),('cmu6tveds001kecwf42xgmega','cmu6tveds001jecwfn1jk9f1a','EN','Parliamentary Session Focuses on Institutional Transparency Reforms','Bipartisan discussions held to enhance governance and public sector efficiency.','<p>A comprehensive legislative reform package was tabled today, receiving broad attention across party lines.</p>',NULL,NULL),('cmu6tvedu001mecwfvndlblsr','cmu6tvedu001lecwfd1roz6zz','EN','Next-Generation AI Technologies Redefine Productivity and Creative Workflows','New neural breakthroughs provide unprecedented efficiency for software and research.','<p>Breakthrough advancements in machine intelligence are reshaping how global enterprises approach complex problem-solving.</p>',NULL,NULL),('cmu6tvedw001oecwfu6ulto3u','cmu6tvedv001necwf8ei1yadt','EN','National Cricket Team Finalizes Squad Ahead of Upcoming Championship','Coaching staff announces balanced combination of experience and dynamic young talent.','<p>The national selectors have unveiled the final squad for the upcoming tournament with high expectations from fans.</p>',NULL,NULL),('cmu6tvedx001qecwfniho2hnn','cmu6tvedx001pecwfsz7im1o6','EN','Colombo Stock Exchange Indices Rise on Strong Institutional Buying','Banking and manufacturing counters drive significant turnover and positive sentiment.','<p>Trading indices closed higher today amidst increased participation from both institutional and retail investors.</p>',NULL,NULL),('cmu6wa1kw0001ewwfn7frjehq','cmu6wa1ks0000ewwfaa94a3vs','EN','Supreme News Launches Next-Gen Digital Platform','Experience real-time breaking news, live broadcasts, and multi-language reporting on our upgraded platform.','<p>Supreme News today officially unveiled its cutting-edge broadcasting network powered by high-performance architecture, bringing trusted news across English, Sinhala, and Tamil audiences.</p>',NULL,NULL),('cmucah4uc0005tlwfn3kx35eq','cmucah4u70004tlwf40nlxiy9','EN','Revenue Milestones','Revenue Milestones','Sri Lanka Customs recorded steady revenue growth during the third quarter, positioning the department to achieve its annual national revenue targets.','Revenue Milestones',NULL),('cmucawn3y000atlwf00l4jz4m','cmucawn3u0009tlwfeyx1ocnt','EN','Railway Strike Disruptions','Railway Strike Disruptions','Railway trade unions launched a token strike over service demands, resulting in cancellations of several train runs and leaving commuters stranded.',NULL,NULL),('cmucaz72a000ftlwfb7a8ek70','cmucaz727000etlwfn9rtq275','EN','Railway Strike Disruptions','Railway Strike Disruptions','Railway trade unions launched a token strike over service demands, resulting in cancellations of several train runs and leaving commuters stranded.',NULL,NULL),('cmucb8zs1000itlwfui0m08o2','cmucb8zry000htlwfqb0xix3i','EN','Railway Strike Disruptions','Railway Strike Disruptions','Railway trade unions launched a token strike over service demands, resulting in cancellations of several train runs and leaving commuters stranded.',NULL,NULL),('cmucb8zs1000jtlwfcl4jap7r','cmucb8zry000htlwfqb0xix3i','SI','දුම්රිය වැඩවර්ජනය හේතුවෙන් මගී අපහසුතා','දුම්රිය වැඩවර්ජනය හේතුවෙන් මගී අපහසුතා','සේවා ඉල්ලීම් කිහිපයක් මුල් කරගනිමින් දුම්රිය වෘත්තීය සමිති ආරම්භ කළ සංකේත වැඩවර්ජනය නිසා දුම්රිය ගමන්වාර රැසක් අවලංගු වී මගී ජනතාව දැඩි අපහසුතාවට පත්ව ඇත.',NULL,NULL),('cmucc9p94000ntlwfwj64rovt','cmucc9p91000mtlwfr13diqem','EN','Sri Lanka–Thailand Cooperation','Sri Lanka–Thailand Cooperation','Bilateral ties between Sri Lanka and Thailand have strengthened, opening new employment opportunities for Sri Lankan workers under a bilateral framework.',NULL,NULL),('cmucdzay1000vtlwfj6tpv75o','cmucdzaxy000utlwfc5y2x1uf','EN','National Squad Rebuilding','National Squad Rebuilding','Key national cricket players undergo rehabilitation for fitness and minor injuries as selectors look ahead to team combinations for upcoming international fixtures.',NULL,NULL);
/*!40000 ALTER TABLE `ArticleTranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES ('cmu6tvecd0001ecwf8cfel2nj','sri-lanka','2026-09-18 10:40:51.037','2026-09-18 10:40:51.037'),('cmu6tvecg0005ecwf6m9bjtzi','world','2026-09-18 10:40:51.040','2026-09-18 10:40:51.040'),('cmu6tvecj0009ecwfwjm3ydtf','politics','2026-09-18 10:40:51.043','2026-09-18 10:40:51.043'),('cmu6tvecl000decwfzffb693q','business','2026-09-18 10:40:51.045','2026-09-18 10:40:51.045'),('cmu6tvecn000hecwfzozt6se2','sports','2026-09-18 10:40:51.047','2026-09-18 10:40:51.047'),('cmu6tvecp000lecwf4b67x5ay','entertainment','2026-09-18 10:40:51.049','2026-09-18 10:40:51.049'),('cmu6tvecr000pecwfhw2wdkjn','technology','2026-09-18 10:40:51.051','2026-09-18 10:40:51.051'),('cmu6tvecu000tecwfb0a88tgx','lifestyle','2026-09-18 10:40:51.054','2026-09-18 10:40:51.054'),('cmu6tvecw000xecwfgqcg0sfq','video','2026-09-18 10:40:51.056','2026-09-18 10:40:51.056');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CategoryTranslation`
--

DROP TABLE IF EXISTS `CategoryTranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CategoryTranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` enum('EN','SI','TA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CategoryTranslation_categoryId_language_key` (`categoryId`,`language`),
  CONSTRAINT `CategoryTranslation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CategoryTranslation`
--

LOCK TABLES `CategoryTranslation` WRITE;
/*!40000 ALTER TABLE `CategoryTranslation` DISABLE KEYS */;
INSERT INTO `CategoryTranslation` VALUES ('cmu6tvecd0002ecwfdsj1vjwj','cmu6tvecd0001ecwf8cfel2nj','EN','Sri Lanka','The latest news and developments from Sri Lanka.'),('cmu6tvecd0003ecwfmdtsjfnb','cmu6tvecd0001ecwf8cfel2nj','SI','ශ්‍රී ලංකා','ශ්‍රී ලංකාවේ නවතම පුවත් සහ තොරතුරු.'),('cmu6tvecd0004ecwfoxup6ohf','cmu6tvecd0001ecwf8cfel2nj','TA','இலங்கை','இலங்கையின் சமீபத்திய செய்திகள் மற்றும் நிகழ்வுகள்.'),('cmu6tvech0006ecwfqgsygwgu','cmu6tvecg0005ecwf6m9bjtzi','EN','World','Important international news and global developments.'),('cmu6tvech0007ecwfrxsgzcrc','cmu6tvecg0005ecwf6m9bjtzi','SI','ලෝකය','ජාත්‍යන්තර පුවත් සහ විදේශීය තොරතුරු.'),('cmu6tvech0008ecwfpi5ckvh4','cmu6tvecg0005ecwf6m9bjtzi','TA','உலகம்','முக்கிய சர்வதேச செய்திகள்.'),('cmu6tvecj000aecwfsx7xlwl0','cmu6tvecj0009ecwfwjm3ydtf','EN','Politics','Political insights, government updates and policy news.'),('cmu6tvecj000becwfqhumd8n2','cmu6tvecj0009ecwfwjm3ydtf','SI','දේශපාලනය','දේශපාලන පුවත්, විග්‍රහ සහ තීරණ.'),('cmu6tvecj000cecwf5qng5qc6','cmu6tvecj0009ecwfwjm3ydtf','TA','அரசியல்','அரசியல் முக்கிய நிகழ்வுகள்.'),('cmu6tvecl000eecwfuup456kj','cmu6tvecl000decwfzffb693q','EN','Business','Economy, markets, trade and finance news.'),('cmu6tvecl000fecwfvjw6va2s','cmu6tvecl000decwfzffb693q','SI','ව්‍යාපාරික','ආර්ථික, මූල්‍ය සහ වෙළඳපල පුවත්.'),('cmu6tvecl000gecwf8wdv8lcl','cmu6tvecl000decwfzffb693q','TA','வணிகம்','பொருளாதாரம் மற்றும் நிதி செய்திகள்.'),('cmu6tvecn000iecwflqjjy3ml','cmu6tvecn000hecwfzozt6se2','EN','Sports','Live scores, match reports and sports updates.'),('cmu6tvecn000jecwfvubulfwi','cmu6tvecn000hecwfzozt6se2','SI','ක්‍රීඩා','ක්‍රිකට් ඇතුළු දේශීය හා විදේශීය ක්‍රීඩා පුවත්.'),('cmu6tvecn000kecwfq16myd7h','cmu6tvecn000hecwfzozt6se2','TA','விளையாட்டு','விளையாட்டு செய்திகள் மற்றும் முடிவுகள்.'),('cmu6tvecp000mecwf64hrlsl5','cmu6tvecp000lecwf4b67x5ay','EN','Entertainment','Cinema, celebrity, music and cultural stories.'),('cmu6tvecp000necwf6x20stor','cmu6tvecp000lecwf4b67x5ay','SI','විනෝදාස්වාදය','සිනමා, සංගීත සහ කලා ක්ෂේත්‍රයේ පුවත්.'),('cmu6tvecp000oecwfym8vx68r','cmu6tvecp000lecwf4b67x5ay','TA','பொழுதுபோக்கு','சினிமா மற்றும் பொழுதுபோக்கு செய்திகள்.'),('cmu6tvecs000qecwfh1cua8r6','cmu6tvecr000pecwfhw2wdkjn','EN','Technology','AI, gadgets, innovation and tech trends.'),('cmu6tvecs000recwfwci1raiz','cmu6tvecr000pecwfhw2wdkjn','SI','තාක්ෂණය','නව තාක්ෂණික සොයාගැනීම් සහ තොරතුරු තාක්ෂණ පුවත්.'),('cmu6tvecs000secwf7g0ttvf8','cmu6tvecr000pecwfhw2wdkjn','TA','தொழில்நுட்பம்','சமீபத்திய தொழில்நுட்ப தகவல்கள்.'),('cmu6tvecu000uecwfkqfkzaxl','cmu6tvecu000tecwfb0a88tgx','EN','Lifestyle','Health, travel, culture and modern living.'),('cmu6tvecu000vecwfpuynsxqu','cmu6tvecu000tecwfb0a88tgx','SI','ජීවන රටාව','සෞඛ්‍යය, සංචාර සහ සුවපහසු ජීවන රටාව.'),('cmu6tvecu000wecwfjee4o1qj','cmu6tvecu000tecwfb0a88tgx','TA','வாழ்க்கை முறை','உடல்நலம் மற்றும் வாழ்க்கை முறை தகவல்கள்.'),('cmu6tvecx000yecwfn28qdu5j','cmu6tvecw000xecwfgqcg0sfq','EN','Videos','Watch TV Supreme video stories and highlights.'),('cmu6tvecx000zecwfwey24ekf','cmu6tvecw000xecwfgqcg0sfq','SI','වීඩියෝ','නවතම වීඩියෝ පුවත් සහ වැඩසටහන්.'),('cmu6tvecx0010ecwfgnb439h5','cmu6tvecw000xecwfgqcg0sfq','TA','காணொளிகள்','செய்தி காணொளிகள்.');
/*!40000 ALTER TABLE `CategoryTranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContactMessage`
--

DROP TABLE IF EXISTS `ContactMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ContactMessage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('NEW','READ','REPLIED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEW',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContactMessage`
--

LOCK TABLES `ContactMessage` WRITE;
/*!40000 ALTER TABLE `ContactMessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `ContactMessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomepageSection`
--

DROP TABLE IF EXISTS `HomepageSection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomepageSection` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('HERO','FEATURED','LATEST','TRENDING','TOP_STORIES','VIDEOS','PROMO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` int NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `videoId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mediaId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HomepageSection_articleId_fkey` (`articleId`),
  KEY `HomepageSection_videoId_fkey` (`videoId`),
  KEY `HomepageSection_mediaId_fkey` (`mediaId`),
  CONSTRAINT `HomepageSection_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `HomepageSection_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `HomepageSection_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomepageSection`
--

LOCK TABLES `HomepageSection` WRITE;
/*!40000 ALTER TABLE `HomepageSection` DISABLE KEYS */;
/*!40000 ALTER TABLE `HomepageSection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LiveStream`
--

DROP TABLE IF EXISTS `LiveStream`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LiveStream` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channelName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `streamUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `streamType` enum('HLS','MP4','EMBED','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HLS',
  `isLive` tinyint(1) NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LiveStream`
--

LOCK TABLES `LiveStream` WRITE;
/*!40000 ALTER TABLE `LiveStream` DISABLE KEYS */;
INSERT INTO `LiveStream` VALUES ('cmudmd0gy00006twfuoppe4ai','TV SUPREME','https://player.castr.com/live_3b18e370d0f011efa5904f4336ecbf7e','EMBED',1,1,'2026-09-23 04:44:59.171','2026-09-23 04:44:59.171');
/*!40000 ALTER TABLE `LiveStream` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Media`
--

DROP TABLE IF EXISTS `Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Media` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('IMAGE','VIDEO','AUDIO','DOCUMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `altText` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Media`
--

LOCK TABLES `Media` WRITE;
/*!40000 ALTER TABLE `Media` DISABLE KEYS */;
INSERT INTO `Media` VALUES ('cmucaxtzo000ctlwfts11o70l','ChatGPT Image Aug 25, 2026, 02_12_37 PM.png','/uploads/media/1790059048976-ChatGPT_Image_Aug_25__2026__02_12_37_PM.png','IMAGE','image/png',2510818,NULL,NULL,NULL,'2026-09-22 06:37:28.980','2026-09-22 06:37:28.980'),('cmucayzl0000dtlwfap9tsooj','finel edit universal woman.mov','/uploads/media/1790059102752-finel_edit_universal_woman.mov','VIDEO','video/quicktime',357398762,NULL,NULL,NULL,'2026-09-22 06:38:22.884','2026-09-22 06:38:22.884'),('cmucc9ij8000ltlwfejccdjtq','ChatGPT Image Aug 24, 2026, 04_49_52 PM.png','/uploads/media/1790061273616-ChatGPT_Image_Aug_24__2026__04_49_52_PM.png','IMAGE','image/png',2370939,NULL,NULL,NULL,'2026-09-22 07:14:33.620','2026-09-22 07:14:33.620'),('cmucccosb000ptlwfgd6ruh95','perahara 01 .mov','/uploads/media/1790061421550-perahara_01_.mov','VIDEO','video/quicktime',336459183,NULL,NULL,NULL,'2026-09-22 07:17:01.691','2026-09-22 07:17:01.691'),('cmuccnvtx000rtlwf9z1k0csw','IMG_1199.JPG','/uploads/media/1790061944033-IMG_1199.JPG','IMAGE','image/jpeg',4066956,NULL,NULL,NULL,'2026-09-22 07:25:44.037','2026-09-22 07:25:44.037'),('cmucdz0tj000ttlwfv11ce051','IMG_6182.JPG','/uploads/media/1790064143333-IMG_6182.JPG','IMAGE','image/jpeg',536338,NULL,NULL,NULL,'2026-09-22 08:02:23.335','2026-09-22 08:02:23.335'),('cmucl3yks000ytlwfh0p6j9hw','ChatGPT Image Sep 10, 2026, 05_43_38 PM.png','/uploads/media/1790076131016-ChatGPT_Image_Sep_10__2026__05_43_38_PM.png','IMAGE','image/png',1785336,NULL,NULL,'','2026-09-22 11:22:11.020','2026-09-22 11:22:11.020'),('cmuclagzo00007lwf44dg4i13','ChatGPT Image Sep 10, 2026, 05_43_38 PM.png','/uploads/media/1790076434808-ChatGPT_Image_Sep_10__2026__05_43_38_PM.png','IMAGE','image/png',1785336,NULL,NULL,'','2026-09-22 11:27:14.820','2026-09-22 11:27:14.820');
/*!40000 ALTER TABLE `Media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MenuItem`
--

DROP TABLE IF EXISTS `MenuItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MenuItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` enum('EN','SI','TA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN',
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `href` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int NOT NULL DEFAULT '0',
  `isVisible` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MenuItem`
--

LOCK TABLES `MenuItem` WRITE;
/*!40000 ALTER TABLE `MenuItem` DISABLE KEYS */;
INSERT INTO `MenuItem` VALUES ('cmu6tved20011ecwfsvywuntm','SI','මුල් පිටුව','/',2,1,'2026-09-18 10:40:51.062','2026-09-22 06:10:57.371'),('cmu6tved40012ecwf93uq53a8','EN','Latest','/latest',1,1,'2026-09-18 10:40:51.064','2026-09-22 06:07:09.728'),('cmu6tved60013ecwfninzlnis','TA','இலங்கை','/',0,1,'2026-09-18 10:40:51.066','2026-09-22 06:10:57.390'),('cmu6tved70014ecwfy4zv98b3','EN','World','/world',2,1,'2026-09-18 10:40:51.067','2026-09-22 06:07:09.731'),('cmu6tved90015ecwf2a20azgw','EN','Politics','/politics',3,1,'2026-09-18 10:40:51.069','2026-09-22 06:07:09.732'),('cmu6tveda0016ecwf6wr2zhx5','EN','Business','/business',4,1,'2026-09-18 10:40:51.070','2026-09-22 06:07:09.733'),('cmu6tvedb0017ecwfign5k4kf','EN','Sports','/sports',5,1,'2026-09-18 10:40:51.071','2026-09-22 06:07:09.734'),('cmu6tvedd0018ecwfx9o35n64','EN','Entertainment','/entertainment',6,1,'2026-09-18 10:40:51.073','2026-09-22 06:07:09.735'),('cmu6tvede0019ecwf3jgtw02k','EN','Technology','/technology',7,1,'2026-09-18 10:40:51.074','2026-09-22 06:07:09.736'),('cmu6tvedf001aecwfo4d9vguq','EN','Lifestyle','/lifestyle',8,1,'2026-09-18 10:40:51.075','2026-09-22 06:07:09.737'),('cmu6tvedh001becwfza5zo0n1','EN','Video','/video',9,1,'2026-09-18 10:40:51.077','2026-09-22 06:07:09.738'),('cmu6tvedi001cecwf7mdxjgar','EN','Watch Live','/watch-live',10,1,'2026-09-18 10:40:51.078','2026-09-22 06:07:09.739'),('cmuc9z0kn0000tlwfky7goy0k','SI','නවතම','/latest',0,1,'2026-09-22 06:10:24.551','2026-09-22 06:10:57.366'),('cmuc9zpuz0001tlwfozvlizyj','SI','නවතම','/business',1,1,'2026-09-22 06:10:57.323','2026-09-22 06:10:57.369');
/*!40000 ALTER TABLE `MenuItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kind` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `href` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `readAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Notification_userId_isRead_createdAt_idx` (`userId`,`isRead`,`createdAt`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Page` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Page_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
/*!40000 ALTER TABLE `Page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageTranslation`
--

DROP TABLE IF EXISTS `PageTranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageTranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pageId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` enum('EN','SI','TA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDescription` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PageTranslation_pageId_language_key` (`pageId`,`language`),
  CONSTRAINT `PageTranslation_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageTranslation`
--

LOCK TABLES `PageTranslation` WRITE;
/*!40000 ALTER TABLE `PageTranslation` DISABLE KEYS */;
/*!40000 ALTER TABLE `PageTranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProfileChangeRequest`
--

DROP TABLE IF EXISTS `ProfileChangeRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfileChangeRequest` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('EMAIL','PASSWORD') COLLATE utf8mb4_unicode_ci NOT NULL,
  `requestedEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestedPasswordHash` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reviewedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewNote` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reviewedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ProfileChangeRequest_userId_status_createdAt_idx` (`userId`,`status`,`createdAt`),
  KEY `ProfileChangeRequest_status_createdAt_idx` (`status`,`createdAt`),
  KEY `ProfileChangeRequest_reviewedById_fkey` (`reviewedById`),
  CONSTRAINT `ProfileChangeRequest_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ProfileChangeRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfileChangeRequest`
--

LOCK TABLES `ProfileChangeRequest` WRITE;
/*!40000 ALTER TABLE `ProfileChangeRequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `ProfileChangeRequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Session`
--

DROP TABLE IF EXISTS `Session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Session` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenHash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_tokenHash_key` (`tokenHash`),
  KEY `Session_userId_idx` (`userId`),
  KEY `Session_expiresAt_idx` (`expiresAt`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
INSERT INTO `Session` VALUES ('cmub3nlk40000hpwf7wf9h9xn','1b07699095d08469bb6207deeb1c14100fa8a7c055b7ef5f1a2511d00df32e7f','cmu6tvec10000ecwfvdxwxns3','2026-09-28 10:25:47.988','2026-09-21 10:25:48.004','2026-09-21 10:25:48.004'),('cmub3qyvx0001hpwfmsqx7ig8','1bf1c9f08884a4bd63ae277c1518088eb866fe0352e5d6bcc45676b23f990c02','cmu6tvec10000ecwfvdxwxns3','2026-09-28 10:28:25.243','2026-09-21 10:28:25.245','2026-09-21 10:28:25.245'),('cmub6rhww0005hpwfm1vvols6','935beb2066b5947f652f75b428fe454edbc3461111d5302714dd05627e61f2cb','cmu6tvec10000ecwfvdxwxns3','2026-09-28 11:52:48.747','2026-09-21 11:52:48.752','2026-09-21 11:52:48.752'),('cmucckegy000qtlwfon02my6j','e15cab1e42a87ee0b721e6797eef3e2bf0cd23858c9bf00e473350ac4f79c876','cmu6tvec10000ecwfvdxwxns3','2026-09-29 07:23:01.568','2026-09-22 07:23:01.570','2026-09-22 07:23:01.570'),('cmud35nrq00000ewfo4wl1c4b','c7bc18775213bd84f3c7365522bf86d8059fed4dfb1083298d6eceede9f5ad3a','cmu6tvec10000ecwfvdxwxns3','2026-09-29 19:47:23.400','2026-09-22 19:47:23.414','2026-09-22 19:47:23.414'),('cmudn0zhh0000h3wf2zcg002d','98d395af3f47cb900a9971398b417981bacf51d325497c9cb8426f7fd52e1a9f','cmu6tvec10000ecwfvdxwxns3','2026-09-30 05:03:37.628','2026-09-23 05:03:37.637','2026-09-23 05:03:37.637'),('cmudp1mq800001owflmbdy61a','c80748e3ee26723a98fd7dbb8706b80074631e7c50ed315c57f5eeb3f08ecda8','cmu6tvec10000ecwfvdxwxns3','2026-09-30 06:00:06.984','2026-09-23 06:00:06.992','2026-09-23 06:00:06.992');
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteSetting`
--

DROP TABLE IF EXISTS `SiteSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SiteSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SiteSetting_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteSetting`
--

LOCK TABLES `SiteSetting` WRITE;
/*!40000 ALTER TABLE `SiteSetting` DISABLE KEYS */;
INSERT INTO `SiteSetting` VALUES ('cmuaxj3xa0002kvwf7p0vjvzf','menu_item_metadata','{\"cmuaxj3wx0001kvwfcdhvlg8t\":{\"type\":\"Custom Link\",\"desktop\":true,\"mobile\":true,\"openNewTab\":false},\"cmu6tved60013ecwfninzlnis\":{\"type\":\"Custom Link\",\"desktop\":true,\"mobile\":true,\"openNewTab\":false},\"cmu6tved20011ecwfsvywuntm\":{\"type\":\"Custom Link\",\"desktop\":true,\"mobile\":true,\"openNewTab\":false},\"cmuc9z0kn0000tlwfky7goy0k\":{\"type\":\"Custom Link\",\"desktop\":true,\"mobile\":true,\"openNewTab\":false},\"cmuc9zpuz0001tlwfozvlizyj\":{\"type\":\"Custom Link\",\"desktop\":true,\"mobile\":true,\"openNewTab\":false}}','2026-09-21 07:34:20.830','2026-09-22 06:10:57.327'),('cmublo6i30001dgwfyk4rj9xp','site_name','TV SUPREME','2026-09-21 18:50:08.235','2026-09-23 06:21:18.664'),('cmublo6i50002dgwfgw8hw37s','site_tagline','Your trusted source for Sri Lankan and world news.','2026-09-21 18:50:08.237','2026-09-23 06:21:18.667'),('cmublo6i60003dgwfdbg5gitc','website_url','https://www.tvsupreme.lk','2026-09-21 18:50:08.238','2026-09-23 06:21:18.669'),('cmublo6i70004dgwf02tjjqh7','default_language','Tamil','2026-09-21 18:50:08.239','2026-09-23 06:21:18.671'),('cmublo6i80005dgwfi58juw1l','timezone','Asia/Colombo','2026-09-21 18:50:08.240','2026-09-23 06:21:18.672'),('cmublo6i90006dgwft896vgkl','site_theme','Dark','2026-09-21 18:50:08.241','2026-09-23 06:21:18.674'),('cmublo6ib0007dgwf8lu4l1ri','primary_color','#EC008C','2026-09-21 18:50:08.243','2026-09-23 06:21:18.676'),('cmublo6ic0008dgwf41uleanp','site_logo_url','/logo.png','2026-09-21 18:50:08.244','2026-09-23 06:21:18.677'),('cmublo6id0009dgwfcnf8b7eo','social_facebook','https://www.facebook.com/tvsupremenews/','2026-09-21 18:50:08.245','2026-09-23 06:21:18.679'),('cmublo6ie000adgwfldygsn01','social_youtube','https://www.youtube.com/@tvsupremenews','2026-09-21 18:50:08.246','2026-09-23 06:21:18.680'),('cmublo6ie000bdgwfxj59f1vp','social_instagram','https://www.instagram.com/tvsupremenews.lk/','2026-09-21 18:50:08.246','2026-09-23 06:21:18.682'),('cmublo6if000cdgwfv5rvx6l2','social_x','https://x.com/tvsupreme','2026-09-21 18:50:08.247','2026-09-23 06:21:18.683'),('cmublo6ih000ddgwfakliadd1','social_tiktok','https://www.tiktok.com/@tvsupremenews','2026-09-21 18:50:08.249','2026-09-23 06:21:18.684'),('cmublo6ii000edgwfexqwsjhb','meta_title','TV SUPREME | Sri Lanka News','2026-09-21 18:50:08.250','2026-09-23 06:21:18.685'),('cmublo6ij000fdgwflav1mmtr','meta_description','TV SUPREME delivers the latest Sri Lankan, world, political, business, sports, entertainment and technology news.','2026-09-21 18:50:08.251','2026-09-23 06:21:18.686'),('cmublo6ik000gdgwfod9gtpib','meta_keywords','Sri Lanka news, TV SUPREME, breaking news, world news, politics, business, sports','2026-09-21 18:50:08.252','2026-09-23 06:21:18.688'),('cmublo6il000hdgwfuzobmgof','maintenance_mode','false','2026-09-21 18:50:08.253','2026-09-23 06:21:18.689'),('cmublo6im000idgwfx4we05a0','comments_enabled','true','2026-09-21 18:50:08.254','2026-09-23 06:21:18.690'),('cmublo6in000jdgwfnp2jbqeq','analytics_enabled','true','2026-09-21 18:50:08.255','2026-09-23 06:21:18.691'),('cmublo6io000kdgwf4epr03ty','email_notifications','true','2026-09-21 18:50:08.256','2026-09-23 06:21:18.692'),('cmudmd0h900016twfeyy4fzyf','live_tv_player_title','TV SUPREME Live','2026-09-23 04:44:59.181','2026-09-23 04:44:59.181'),('cmudmd0hc00026twflolt6fhc','live_tv_fallback_url','','2026-09-23 04:44:59.184','2026-09-23 04:44:59.184'),('cmudmd0he00036twfj1h0w3eq','live_tv_autoplay','true','2026-09-23 04:44:59.186','2026-09-23 04:44:59.186'),('cmudmd0hg00046twfwk6m6jvv','live_tv_show_chat','false','2026-09-23 04:44:59.188','2026-09-23 04:44:59.188');
/*!40000 ALTER TABLE `SiteSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_slug_key` (`slug`),
  UNIQUE KEY `Tag_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','EDITOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EDITOR',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `jobTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profileImageId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_profileImageId_fkey` (`profileImageId`),
  CONSTRAINT `User_profileImageId_fkey` FOREIGN KEY (`profileImageId`) REFERENCES `Media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cmu6tvec10000ecwfvdxwxns3','Supreme Admin','admin@supremenews.com','scrypt:07ae225c665b1c199746700d3a1d303f:e8f11543ea9373e6efc4f4021daa6fa55a4f0c1ff4b8fcb327e066617ad5362dcffddde6549d54ae9d89218925e550e4450aedd405ef1737c02c12a985918a21','ADMIN','2026-09-18 10:40:51.025','2026-09-21 15:50:25.760',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Video`
--

DROP TABLE IF EXISTS `Video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Video` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `language` enum('EN','SI','TA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN',
  `status` enum('DRAFT','REVIEW','SCHEDULED','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnailId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `videoUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `publishedAt` datetime(3) DEFAULT NULL,
  `scheduledAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `videoCategoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Video_slug_key` (`slug`),
  KEY `Video_categoryId_fkey` (`categoryId`),
  KEY `Video_thumbnailId_fkey` (`thumbnailId`),
  KEY `Video_videoCategoryId_fkey` (`videoCategoryId`),
  CONSTRAINT `Video_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Video_thumbnailId_fkey` FOREIGN KEY (`thumbnailId`) REFERENCES `Media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Video_videoCategoryId_fkey` FOREIGN KEY (`videoCategoryId`) REFERENCES `VideoCategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Video`
--

LOCK TABLES `Video` WRITE;
/*!40000 ALTER TABLE `Video` DISABLE KEYS */;
INSERT INTO `Video` VALUES ('cmuau0dbs0000kvwf2g3cr8g5','samsung-fold','samsung fold','new phone','EN','PUBLISHED','cmu6tvecw000xecwfgqcg0sfq',NULL,'https://www.youtube.com/watch?v=_4d8xaprJXE',NULL,0,0,'2026-09-21 05:55:47.687',NULL,'2026-09-21 05:55:47.704','2026-09-21 05:55:47.704',NULL);
/*!40000 ALTER TABLE `Video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VideoCategory`
--

DROP TABLE IF EXISTS `VideoCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VideoCategory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `VideoCategory_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VideoCategory`
--

LOCK TABLES `VideoCategory` WRITE;
/*!40000 ALTER TABLE `VideoCategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `VideoCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VideoCategoryTranslation`
--

DROP TABLE IF EXISTS `VideoCategoryTranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VideoCategoryTranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `videoCategoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` enum('EN','SI','TA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `VideoCategoryTranslation_videoCategoryId_language_key` (`videoCategoryId`,`language`),
  CONSTRAINT `VideoCategoryTranslation_videoCategoryId_fkey` FOREIGN KEY (`videoCategoryId`) REFERENCES `VideoCategory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VideoCategoryTranslation`
--

LOCK TABLES `VideoCategoryTranslation` WRITE;
/*!40000 ALTER TABLE `VideoCategoryTranslation` DISABLE KEYS */;
/*!40000 ALTER TABLE `VideoCategoryTranslation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-23 11:51:42
