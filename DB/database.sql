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
