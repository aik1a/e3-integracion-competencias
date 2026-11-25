CREATE DATABASE IF NOT EXISTS control_asistencia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE control_asistencia;

DROP TABLE IF EXISTS marcaciones;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  identificador VARCHAR(30) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  perfil ENUM('administrador', 'empleado') NOT NULL,
  estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_identificador UNIQUE (identificador),
  CONSTRAINT uq_usuarios_correo UNIQUE (correo),
  CONSTRAINT chk_usuarios_perfil
    CHECK (perfil IN ('administrador', 'empleado')),
  CONSTRAINT chk_usuarios_estado
    CHECK (estado IN ('Activo', 'Inactivo'))
) ENGINE=InnoDB;

CREATE TABLE marcaciones (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  accion ENUM('entrada', 'salida') NOT NULL,
  fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha DATE GENERATED ALWAYS AS (DATE(fecha_hora)) STORED,
  PRIMARY KEY (id),
  CONSTRAINT fk_marcaciones_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT uq_marcaciones_usuario_fecha_accion
    UNIQUE (usuario_id, fecha, accion),
  CONSTRAINT chk_marcaciones_accion
    CHECK (accion IN ('entrada', 'salida'))
) ENGINE=InnoDB;
