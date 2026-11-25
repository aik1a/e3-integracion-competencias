require('dotenv').config({ quiet: true });

const app = require('./app');
const { comprobarConexion, cerrarConexion } = require('./db/connection');

const port = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  await comprobarConexion();

  const servidor = app.listen(port, () => {
    console.log(`Servidor disponible en http://localhost:${port}`);
    console.log('Conexión con MySQL comprobada');
  });

  async function cerrarServidor() {
    servidor.close(async () => {
      await cerrarConexion();
      process.exit(0);
    });
  }

  process.on('SIGINT', cerrarServidor);
  process.on('SIGTERM', cerrarServidor);
}

iniciarServidor().catch((error) => {
  console.error('No fue posible iniciar la aplicación:', error.message);
  process.exitCode = 1;
});
