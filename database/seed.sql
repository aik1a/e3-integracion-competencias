USE control_asistencia;

-- Datos ficticios únicamente para demostrar el MVP local.
-- Credenciales: admin@empresa.test / Admin1234
--                empleado@empresa.test / Empleado1234
INSERT INTO usuarios
  (identificador, nombre, correo, password_hash, perfil, estado)
VALUES
  ('ADM-001', 'Administrador demo', 'admin@empresa.test',
   'sprint02-admin-demo:ce8984003bf13e72fa22f45e6e7587decb7428190d20def2cf59ed187f89bdea6738a5e362d81a16ef250d95699cbb2c65f86d9f83e2365936f0dc04b4980bd2',
   'administrador', 'Activo'),
  ('EMP-001', 'Empleado demo', 'empleado@empresa.test',
   'sprint02-empleado-demo:5c2979499a1908ce4f9deb5e110e36abb08a5a99b6fd7f7096e6158474582dcf2987d3407b65c2eb3382d9f0106286359604d89a7b135dfb64977cc88da071af',
   'empleado', 'Activo')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
