const test = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');

require('dotenv').config({ quiet: true });
const { crearApp } = require('../src/app');
const { crearHash } = require('../src/services/passwordService');

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'control_asistencia',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || '',
  dateStrings: true
};

test('QA-001 a QA-008 en MySQL y HTTP', async (t) => {
  const db = await mysql.createConnection(config);
  const marca = Date.now().toString(36);
  const ids = [];
  const app = crearApp({ pool: db });
  const servidor = app.listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));
  t.after(async () => {
    await new Promise((resolve) => servidor.close(resolve));
    await db.query('SET timestamp = DEFAULT');
    if (ids.length) {
      await db.query('DELETE FROM marcaciones WHERE usuario_id IN (?)', [ids]);
      await db.query('DELETE FROM usuarios WHERE id IN (?)', [ids]);
    }
    await db.end();
  });
  const base = `http://127.0.0.1:${servidor.address().port}`;
  async function solicitar(ruta, cookie = '', body) {
    return fetch(base + ruta, { redirect: 'manual', method: body ? 'POST' : 'GET',
      headers: { ...(cookie ? { cookie } : {}), ...(body ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
      body: body ? new URLSearchParams(body) : undefined });
  }
  async function crear(nombre, perfil = 'empleado') {
    const [result] = await db.execute(
      `INSERT INTO usuarios (identificador, nombre, correo, password_hash, perfil, estado)
       VALUES (?, ?, ?, ?, ?, 'Activo')`,
      [`QA-${nombre}-${marca}`, nombre, `${nombre}-${marca}@example.test`,
        await crearHash('Prueba1234'), perfil]
    );
    ids.push(result.insertId);
    return { id: result.insertId, correo: `${nombre}-${marca}@example.test` };
  }
  async function login(correo) {
    const res = await solicitar('/login', '', { correo, password: 'Prueba1234' });
    assert.equal(res.status, 302);
    return res.headers.get('set-cookie').split(';')[0];
  }

  const admin = await crear('admin', 'administrador');
  const empleado = await crear('empleado');
  const libre = await crear('libre');
  const puntual = await crear('puntual');
  const cookieAdmin = await login(admin.correo);
  const cookieEmpleado = await login(empleado.correo);
  const partesFecha = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const valoresFecha = Object.fromEntries(partesFecha.map(({ type, value }) => [type, value]));
  const fechaChile = `${valoresFecha.year}-${valoresFecha.month}-${valoresFecha.day}`;
  const sinConsulta = await (await solicitar('/reportes', cookieAdmin)).text();
  assert.match(sinConsulta, new RegExp(`name="fecha" type="date" required value="${fechaChile}"`));
  assert.doesNotMatch(sinConsulta, /<table|Reporte de atrasos|Reporte de salidas anticipadas|Reporte de inasistencias/);

  const lista = await (await solicitar('/usuarios', cookieAdmin)).text();
  assert.match(lista, /Desactivar.*Eliminar/s);
  assert.match(lista, /onsubmit="return confirm\('[^']*historial se conservará/);
  assert.match(lista, /onsubmit="return confirm\('[^']*irreversible/);

  // QA-001: la fecha y la hora presentes en MySQL corresponden a Chile.
  if (process.env.TZ === 'America/Santiago') {
    const [clock] = await db.query('SELECT NOW() AS ahora, CURDATE() AS hoy, @@session.time_zone AS zona');
    const ahora = new Date();
    const partes = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(ahora);
    const valor = Object.fromEntries(partes.map((p) => [p.type, p.value]));
    const fechaChile = `${valor.year}-${valor.month}-${valor.day}`;
    assert.equal(clock[0].hoy, fechaChile);
    assert.equal(clock[0].ahora.slice(0, 16), `${fechaChile} ${valor.hour}:${valor.minute}`);
    assert.ok(clock[0].zona === 'SYSTEM' || clock[0].zona === 'America/Santiago');

    // QA-002: simular ambos lados de medianoche chilena, no la UTC.
    await db.query('SET timestamp = ?', [Date.parse('2026-09-26T02:59:00Z') / 1000]);
    assert.equal((await solicitar('/asistencia/marcar', cookieEmpleado, { accion: 'entrada' })).status, 302);
    await db.query('SET timestamp = ?', [Date.parse('2026-09-26T03:01:00Z') / 1000]);
    assert.equal((await solicitar('/asistencia/marcar', cookieEmpleado, { accion: 'entrada' })).status, 302);
    const [marcas] = await db.execute(
      'SELECT fecha, fecha_hora FROM marcaciones WHERE usuario_id = ? ORDER BY fecha_hora', [empleado.id]
    );
    assert.deepEqual(marcas.map((m) => m.fecha), ['2026-09-25', '2026-09-26']);
    assert.deepEqual(marcas.map((m) => m.fecha_hora), ['2026-09-25 23:59:00', '2026-09-26 00:01:00']);
    const hoy = await (await solicitar('/asistencia', cookieEmpleado)).text();
    assert.match(hoy, /2026-09-26 00:01:00/);
    assert.doesNotMatch(hoy, /2026-09-25 23:59:00/);
    const reporteAyer = await (await solicitar('/reportes?fecha=2026-09-25', cookieAdmin)).text();
    const reporteHoy = await (await solicitar('/reportes?fecha=2026-09-26', cookieAdmin)).text();
    assert.match(reporteAyer, /23:59:00/);
    assert.doesNotMatch(reporteHoy, /23:59:00/);
    assert.doesNotMatch(reporteHoy, /00:01:00/); // No es atraso.
    await db.query('SET timestamp = DEFAULT');
  } else {
    t.diagnostic('QA-001/QA-002 de Docker pendientes: ejecutar con TZ=America/Santiago y MySQL configurado para Chile');
  }

  // QA-003/QA-004: los límites y el formato se comprueban por HTTP con MySQL.
  await db.execute(`INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES
    (?, 'entrada', '2026-09-18 09:31:00'), (?, 'salida', '2026-09-18 17:29:00')`, [empleado.id, empleado.id]);
  await db.execute(`INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES
    (?, 'entrada', '2026-09-18 09:30:00'), (?, 'salida', '2026-09-18 17:30:00')`, [puntual.id, puntual.id]);
  const html = await (await solicitar('/reportes?fecha=2026-09-18', cookieAdmin)).text();
  assert.match(html, /name="fecha" type="date" required value="2026-09-18"/);
  assert.match(html, /Reporte de atrasos/);
  assert.match(html, /Reporte de salidas anticipadas/);
  assert.match(html, /Reporte de inasistencias/);
  assert.ok((html.match(/<td>18-09-2026<\/td>/g) || []).length >= 4);
  assert.doesNotMatch(html, /GMT|UTC|Fri Sep/);
  assert.match(html, /09:31:00/);
  assert.match(html, /17:29:00/);
  assert.doesNotMatch(html, /09:30:00|17:30:00|QA-puntual/);

  // QA-005/QA-008: cancelar confirm() equivale a no enviar POST; la fila sigue intacta.
  const [antes] = await db.execute('SELECT estado FROM usuarios WHERE id = ?', [libre.id]);
  assert.equal(antes[0].estado, 'Activo');
  const desactivar = await solicitar(`/usuarios/${libre.id}/desactivar`, cookieAdmin, {});
  assert.equal(desactivar.status, 302);
  const [inactivo] = await db.execute('SELECT estado FROM usuarios WHERE id = ?', [libre.id]);
  assert.equal(inactivo[0].estado, 'Inactivo');

  // QA-007: la FK RESTRICT impide borrar al usuario con historia.
  const protegido = await solicitar(`/usuarios/${empleado.id}/eliminar`, cookieAdmin, {});
  assert.equal(protegido.status, 302);
  assert.match(decodeURIComponent(protegido.headers.get('location')), /marcaciones históricas.*Desactivar/);
  const [conHistorial] = await db.execute('SELECT id FROM usuarios WHERE id = ?', [empleado.id]);
  assert.equal(conHistorial.length, 1);

  // QA-006: un usuario sin historia desaparece de MySQL.
  const eliminar = await solicitar(`/usuarios/${libre.id}/eliminar`, cookieAdmin, {});
  assert.equal(eliminar.status, 302);
  const [borrado] = await db.execute('SELECT id FROM usuarios WHERE id = ?', [libre.id]);
  assert.equal(borrado.length, 0);
});
