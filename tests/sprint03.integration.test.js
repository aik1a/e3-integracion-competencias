const test = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');

require('dotenv').config({ quiet: true });
const { crearApp } = require('../src/app');
const { crearHash } = require('../src/services/passwordService');

function configuracionDb() {
  return { host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'control_asistencia', user: process.env.DB_USER || 'app',
    password: process.env.DB_PASSWORD || '' };
}

async function solicitud(baseUrl, ruta, opciones = {}, cookie = '') {
  return fetch(`${baseUrl}${ruta}`, { redirect: 'manual', ...opciones,
    headers: { ...(cookie ? { cookie } : {}), ...(opciones.headers || {}) } });
}

test('Sprint 03 integra reportes y AP-01 contra MySQL real', async (t) => {
  const pool = mysql.createPool(configuracionDb());
  const marca = `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  const fecha = '2026-09-18';
  const passwordHash = await crearHash('Sprint03Test123');
  const ids = [];
  t.after(async () => {
    if (ids.length) {
      await pool.query('DELETE FROM marcaciones WHERE usuario_id IN (?)', [ids]);
      await pool.query('DELETE FROM usuarios WHERE id IN (?)', [ids]);
    }
    await pool.end();
  });

  async function crearUsuario(sufijo, nombre, perfil = 'empleado', estado = 'Activo') {
    const [resultado] = await pool.execute(
      `INSERT INTO usuarios (identificador, nombre, correo, password_hash, perfil, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`S03-${sufijo}-${marca}`, nombre, `${sufijo}-${marca}@example.test`, passwordHash, perfil, estado]
    );
    ids.push(resultado.insertId);
    return { id: resultado.insertId, correo: `${sufijo}-${marca}@example.test` };
  }

  const admin = await crearUsuario('admin', `Admin S03 ${marca}`, 'administrador');
  const puntual = await crearUsuario('puntual', `Puntual S03 ${marca}`);
  const incidencia = await crearUsuario('incidencia', `Incidencia S03 ${marca}`);
  const ausente = await crearUsuario('ausente', `Ausente S03 ${marca}`);
  const inactivo = await crearUsuario('inactivo', `Inactivo S03 ${marca}`, 'empleado', 'Inactivo');

  await pool.execute(
    `INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES
      (?, 'entrada', ?), (?, 'salida', ?), (?, 'entrada', ?), (?, 'salida', ?)`,
    [puntual.id, `${fecha} 09:30:00`, puntual.id, `${fecha} 17:30:00`,
      incidencia.id, `${fecha} 09:31:00`, incidencia.id, `${fecha} 17:29:00`]
  );

  const app = crearApp({ pool });
  const servidor = app.listen(0);
  t.after(() => servidor.close());
  await new Promise((resolve) => servidor.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${servidor.address().port}`;

  assert.equal((await solicitud(baseUrl, `/reportes?fecha=${fecha}`)).status, 302);

  async function iniciarSesion(correo) {
    const respuesta = await solicitud(baseUrl, '/login', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ correo, password: 'Sprint03Test123' })
    });
    assert.equal(respuesta.status, 302);
    return respuesta.headers.get('set-cookie').split(';')[0];
  }

  const cookieEmpleado = await iniciarSesion(incidencia.correo);
  assert.equal((await solicitud(baseUrl, `/reportes?fecha=${fecha}`, {}, cookieEmpleado)).status, 403);

  const cookieAdmin = await iniciarSesion(admin.correo);
  const pantalla = await solicitud(baseUrl, `/reportes?fecha=${fecha}`, {}, cookieAdmin);
  assert.equal(pantalla.status, 200);
  const html = await pantalla.text();
  assert.match(html, /Reporte de atrasos/);
  assert.match(html, /Reporte de salidas anticipadas/);
  assert.match(html, /Reporte de inasistencias/);
  assert.match(html, new RegExp(`Incidencia S03 ${marca}`));
  assert.doesNotMatch(html, new RegExp(`Puntual S03 ${marca}.*09:31`, 's'));
  assert.match(html, new RegExp(`Ausente S03 ${marca}`));
  assert.doesNotMatch(html, new RegExp(`Inactivo S03 ${marca}`));

  const [antes] = await pool.execute('SELECT COUNT(*) AS total FROM usuarios');
  for (const [filtro, nombreEsperado, nombreExcluido] of [
    ['activo', `Ausente S03 ${marca}`, `Inactivo S03 ${marca}`],
    ['inactivo', `Inactivo S03 ${marca}`, `Ausente S03 ${marca}`],
    ['todos', `Ausente S03 ${marca}`, null]
  ]) {
    const respuesta = await solicitud(baseUrl, `/api/empleados?estado=${filtro}`);
    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers.get('content-type'), /^application\/json/);
    const empleados = await respuesta.json();
    assert.ok(empleados.some((item) => item.nombre === nombreEsperado));
    if (filtro === 'todos') {
      assert.ok(empleados.some((item) => item.nombre === `Inactivo S03 ${marca}`));
    }
    if (nombreExcluido) assert.ok(!empleados.some((item) => item.nombre === nombreExcluido));
    assert.deepEqual(Object.keys(empleados[0]).sort(), ['correo', 'estado', 'id', 'nombre']);
  }

  const filtroInvalido = await solicitud(baseUrl, '/api/empleados?estado=suspendido');
  assert.equal(filtroInvalido.status, 400);
  assert.match(filtroInvalido.headers.get('content-type'), /^application\/json/);
  assert.match((await filtroInvalido.json()).error, /activo, inactivo o todos/);
  const [despues] = await pool.execute('SELECT COUNT(*) AS total FROM usuarios');
  assert.equal(despues[0].total, antes[0].total);

  const [limites] = await pool.execute(
    `SELECT accion, TIME(fecha_hora) AS hora FROM marcaciones
      WHERE usuario_id IN (?, ?) ORDER BY fecha_hora`,
    [puntual.id, incidencia.id]
  );
  assert.deepEqual(limites.map((fila) => `${fila.accion}:${fila.hora}`),
    ['entrada:09:30:00', 'entrada:09:31:00', 'salida:17:29:00', 'salida:17:30:00']);
  assert.ok(ausente.id);
  assert.ok(inactivo.id);
});
