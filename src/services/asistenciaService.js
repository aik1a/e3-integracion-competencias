function validarSecuencia(accionesDelDia, accion) {
  if (!['entrada', 'salida'].includes(accion)) throw new Error('La acción debe ser entrada o salida');
  if (accionesDelDia.includes(accion)) throw new Error(`La ${accion} ya fue registrada hoy`);
  if (accion === 'salida' && !accionesDelDia.includes('entrada')) {
    throw new Error('No se puede registrar una salida sin entrada previa');
  }
}

class AsistenciaService {
  constructor(pool) {
    this.pool = pool;
  }

  async listarHoy(usuarioId) {
    const [filas] = await this.pool.execute(
      `SELECT accion, fecha_hora FROM marcaciones
        WHERE usuario_id = ? AND fecha = CURDATE() ORDER BY fecha_hora`,
      [usuarioId]
    );
    return filas;
  }

  async registrar(usuarioId, accion) {
    const marcaciones = await this.listarHoy(usuarioId);
    validarSecuencia(marcaciones.map((item) => item.accion), accion);
    try {
      const [resultado] = await this.pool.execute(
        'INSERT INTO marcaciones (usuario_id, accion, fecha_hora) VALUES (?, ?, NOW())',
        [usuarioId, accion]
      );
      return resultado.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new Error(`La ${accion} ya fue registrada hoy`);
      throw error;
    }
  }
}

module.exports = { AsistenciaService, validarSecuencia };
