const test = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');

require('dotenv').config({ quiet: true });

test('MySQL aplica el schema y sus restricciones principales', async (t) => {
  const conexion = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'control_asistencia',
    user: process.env.DB_USER || 'app',
    password: process.env.DB_PASSWORD || ''
  });

  let transaccionIniciada = false;
  t.after(async () => {
    if (transaccionIniciada) {
      await conexion.rollback();
    }
    await conexion.end();
  });

  const [conexionActiva] = await conexion.execute('SELECT 1 AS conectado');
  assert.equal(conexionActiva[0].conectado, 1);

  const [tablas] = await conexion.execute(
    `SELECT TABLE_NAME
       FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME`,
    [process.env.DB_NAME || 'control_asistencia']
  );
  assert.deepEqual(tablas.map((fila) => fila.TABLE_NAME), ['marcaciones', 'usuarios']);

  const [claveForanea] = await conexion.execute(
    `SELECT REFERENCED_TABLE_NAME
       FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'marcaciones'
        AND COLUMN_NAME = 'usuario_id'
        AND REFERENCED_TABLE_NAME IS NOT NULL`,
    [process.env.DB_NAME || 'control_asistencia']
  );
  assert.equal(claveForanea[0].REFERENCED_TABLE_NAME, 'usuarios');

  const [clavesPrimarias] = await conexion.execute(
    `SELECT TABLE_NAME
       FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = ?
        AND CONSTRAINT_TYPE = 'PRIMARY KEY'
        AND TABLE_NAME IN ('usuarios', 'marcaciones')
      ORDER BY TABLE_NAME`,
    [process.env.DB_NAME || 'control_asistencia']
  );
  assert.deepEqual(
    clavesPrimarias.map((fila) => fila.TABLE_NAME),
    ['marcaciones', 'usuarios']
  );

  await conexion.beginTransaction();
  transaccionIniciada = true;

  const identificador = `TEST-${Date.now()}`;
  const correo = `${identificador.toLowerCase()}@example.test`;
  const [usuario] = await conexion.execute(
    `INSERT INTO usuarios
       (identificador, nombre, correo, password_hash, perfil, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [identificador, 'Usuario de prueba', correo, '$2b$12$hashFicticioNoUtilizable', 'empleado', 'Activo']
  );

  await assert.rejects(
    conexion.execute(
      `INSERT INTO usuarios
         (identificador, nombre, correo, password_hash, perfil, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`${identificador}-2`, 'Correo repetido', correo, '$2b$12$hashFicticioNoUtilizable', 'empleado', 'Activo']
    ),
    (error) => error.code === 'ER_DUP_ENTRY'
  );

  await assert.rejects(
    conexion.execute(
      `INSERT INTO usuarios
         (identificador, nombre, correo, password_hash, perfil, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`${identificador}-4`, 'Estado inválido', `${identificador}-4@example.test`, '$2b$12$hashFicticioNoUtilizable', 'empleado', 'Suspendido']
    )
  );

  await assert.rejects(
    conexion.execute(
      `INSERT INTO usuarios
         (identificador, nombre, correo, password_hash, perfil, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`${identificador}-3`, 'Perfil inválido', `${identificador}-3@example.test`, '$2b$12$hashFicticioNoUtilizable', 'supervisor', 'Activo']
    )
  );

  await conexion.execute(
    'INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES (?, ?, ?)',
    [usuario.insertId, 'entrada', '2026-09-14 09:00:00']
  );

  await assert.rejects(
    conexion.execute(
      'INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES (?, ?, ?)',
      [usuario.insertId, 'pausa', '2026-09-14 12:00:00']
    )
  );

  await assert.rejects(
    conexion.execute(
      'INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES (?, ?, ?)',
      [4294967295, 'entrada', '2026-09-14 09:00:00']
    ),
    (error) => error.code === 'ER_NO_REFERENCED_ROW_2'
  );

  await assert.rejects(
    conexion.execute(
      'INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES (?, ?, ?)',
      [usuario.insertId, 'entrada', '2026-09-14 09:15:00']
    ),
    (error) => error.code === 'ER_DUP_ENTRY'
  );
});
