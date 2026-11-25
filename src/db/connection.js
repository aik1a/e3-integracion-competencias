const mysql = require('mysql2/promise');

let pool;

function obtenerPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'control_asistencia',
      user: process.env.DB_USER || 'app',
      password: process.env.DB_PASSWORD || '',
      dateStrings: true,
      waitForConnections: true,
      connectionLimit: 5
    });
  }

  return pool;
}

async function comprobarConexion() {
  const [filas] = await obtenerPool().execute('SELECT 1 AS conectado');
  return filas[0].conectado === 1;
}

async function cerrarConexion() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { obtenerPool, comprobarConexion, cerrarConexion };
