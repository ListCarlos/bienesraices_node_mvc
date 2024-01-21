/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensaje` varchar(200) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `propiedadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `propiedadId` (`propiedadId`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`propiedadId`) REFERENCES `propiedades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `precios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `propiedades` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `habitaciones` int NOT NULL,
  `estacionamiento` int NOT NULL,
  `wc` int NOT NULL,
  `calle` varchar(60) NOT NULL,
  `lat` varchar(60) NOT NULL,
  `lng` varchar(60) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PrecioId` int DEFAULT NULL,
  `CategoriaId` int DEFAULT NULL,
  `UsuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PrecioId` (`PrecioId`),
  KEY `CategoriaId` (`CategoriaId`),
  KEY `UsuarioId` (`UsuarioId`),
  CONSTRAINT `propiedades_ibfk_1` FOREIGN KEY (`PrecioId`) REFERENCES `precios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_2` FOREIGN KEY (`CategoriaId`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_3` FOREIGN KEY (`UsuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `confirmado` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, 'Casa', '2024-01-12 12:02:06', '2024-01-12 12:02:06');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(2, 'Piso', '2024-01-12 12:02:06', '2024-01-12 12:02:06');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(3, 'Almacen', '2024-01-12 12:02:06', '2024-01-12 12:02:06');
INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(4, 'Terreno', '2024-01-12 12:02:06', '2024-01-12 12:02:06'),
(5, 'Cabaña', '2024-01-12 12:02:06', '2024-01-12 12:02:06');

INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(1, 'me gusta tu casa', '2024-01-21 00:49:38', '2024-01-21 00:49:38', 'e3885e0e-666f-4345-8d2c-4c5f1290bb24', 2);


INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, '0 - $10,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(2, '$10,000 - $30,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(3, '$30,000 - $50,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06');
INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(4, '$50,000 - $75,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06'),
(5, '$75,000 - $100,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06'),
(6, '$100,000 - $150,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06'),
(7, '$150,000 - $200,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06'),
(8, '$200,000 - $300,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06'),
(9, '$300,000 - $500,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06'),
(10, '+ $500,000 USD', '2024-01-12 12:02:06', '2024-01-12 12:02:06');

INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `PrecioId`, `CategoriaId`, `UsuarioId`) VALUES
('1741ce1c-f018-47b2-ad80-c6add6a9f20a', 'Casa De la Playa', 'Casa de Mazagón', 3, 2, 4, 'Calle Murillo 2', '37.254789863587', '-6.951856613159', 'nq4qoleqbng1hk1q6kkg.png', 1, '2024-01-13 16:24:04', '2024-01-21 20:47:04', 6, 1, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `PrecioId`, `CategoriaId`, `UsuarioId`) VALUES
('4963c675-7906-46e2-83c2-6a7d52e354f9', 'piso morañlea', 'piso grande', 4, 1, 4, 'Calle Rascón 8', '37.25683', '-6.95309', '240gmhnvnp1hk6aovob.png', 1, '2024-01-15 10:30:11', '2024-01-21 20:22:34', 9, 2, 1);
INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `PrecioId`, `CategoriaId`, `UsuarioId`) VALUES
('e3885e0e-666f-4345-8d2c-4c5f1290bb24', 'Cabaña campo', 'Cabaña pequeña', 1, 1, 1, 'Calle Sanlúcar de Barrameda 9', '37.253769988778', '-6.958349992967', 'oe212r0tsjg1hk6aq6f9.jpg', 1, '2024-01-15 10:31:22', '2024-01-15 10:31:27', 2, 5, 1);

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `token`, `confirmado`, `createdAt`, `updatedAt`) VALUES
(1, 'Carlos', 'carfuacebes@hotmail.com', '$2b$10$uWXEgELIYWiubLK738WeueEjq/sPAJlP0ASResl/HhbHYT69nrfnG', NULL, 1, '2024-01-12 12:02:06', '2024-01-12 12:02:06');
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `token`, `confirmado`, `createdAt`, `updatedAt`) VALUES
(2, 'otroUsuario', 'correo@correo.com', '$2b$10$hTC9hKPOffrYSf0g30zT8.snuO1sp.6K2n4kBoJ.BtzvSc6xBnipq', NULL, 1, '2024-01-20 19:46:59', '2024-01-20 19:46:59');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;