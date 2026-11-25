const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');

test('GET /salud confirma que la aplicación responde', async (t) => {
  const servidor = app.listen(0);
  t.after(() => servidor.close());

  await new Promise((resolve) => servidor.once('listening', resolve));
  const { port } = servidor.address();
  const respuesta = await fetch(`http://127.0.0.1:${port}/salud`);

  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), { estado: 'ok' });
});
