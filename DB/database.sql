CREATE DATABASE IF NOT EXIST brunno_y_brunnella;

USE brunno_y_brunnella;

CREATE TABLE IF NOT EXISTS `usuarios` (
	`codigo` VARCHAR(50) NOT NULL AUTO_INCREMENT COLLATE 'utf8mb4_0900_ai_ci',
	`nombre` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
  `apellido` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
  `fecha_nacimiento` DATE COLLATE 'utf8mb4_0900_ai_ci',
  `sexo` VARCHAR(50) COLLATE 'utf8mb4_0900_ai_ci',
  `correo` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
  `correo` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`password` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`tipoUsuario` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci'
  PRIMARY KEY('codigo');
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;

-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla brunnella.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `codigo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user1',
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT '2023-03-05',
  `sexo` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'F',
  `correo` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `tipoUsuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'cliente',
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;