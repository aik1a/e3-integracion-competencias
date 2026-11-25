const HORA_LIMITE_ENTRADA = '09:30:00';
const HORA_LIMITE_SALIDA = '17:30:00';

function validarHora(hora) {
  const valor = String(hora || '');
  if (!/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(valor)) {
    throw new Error('La hora debe tener formato HH:MM:SS');
  }
  return valor;
}

function esAtraso(hora) {
  return validarHora(hora) > HORA_LIMITE_ENTRADA;
}

function esSalidaAnticipada(hora) {
  return validarHora(hora) < HORA_LIMITE_SALIDA;
}

function validarFecha(fecha) {
  const valor = String(fecha || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    throw new Error('La fecha debe tener formato AAAA-MM-DD');
  }
  const [anio, mes, dia] = valor.split('-').map(Number);
  const fechaUtc = new Date(Date.UTC(anio, mes - 1, dia));
  if (fechaUtc.getUTCFullYear() !== anio || fechaUtc.getUTCMonth() !== mes - 1 ||
      fechaUtc.getUTCDate() !== dia) {
    throw new Error('La fecha consultada no es válida');
  }
  return valor;
}

class ReporteService {
  constructor(pool) {
    this.pool = pool;
  }

  async listarAtrasos(fecha) {
    const fechaValida = validarFecha(fecha);
    const [filas] = await this.pool.execute(
      `SELECT u.id, u.identificador, u.nombre, DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha, TIME(m.fecha_hora) AS hora
         FROM marcaciones m
         JOIN usuarios u ON u.id = m.usuario_id
        WHERE m.accion = 'entrada' AND m.fecha = ?
          AND TIME(m.fecha_hora) > ?
        ORDER BY m.fecha_hora, u.identificador`,
      [fechaValida, HORA_LIMITE_ENTRADA]
    );
    return filas;
  }

  async listarSalidasAnticipadas(fecha) {
    const fechaValida = validarFecha(fecha);
    const [filas] = await this.pool.execute(
      `SELECT u.id, u.identificador, u.nombre, DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha, TIME(m.fecha_hora) AS hora
         FROM marcaciones m
         JOIN usuarios u ON u.id = m.usuario_id
        WHERE m.accion = 'salida' AND m.fecha = ?
          AND TIME(m.fecha_hora) < ?
        ORDER BY m.fecha_hora, u.identificador`,
      [fechaValida, HORA_LIMITE_SALIDA]
    );
    return filas;
  }

  async listarInasistencias(fecha) {
    const fechaValida = validarFecha(fecha);
    const [filas] = await this.pool.execute(
      `SELECT u.id, u.identificador, u.nombre, ? AS fecha
         FROM usuarios u
        WHERE u.estado = 'Activo'
          AND NOT EXISTS (
            SELECT 1 FROM marcaciones m
             WHERE m.usuario_id = u.id AND m.fecha = ?
          )
        ORDER BY u.nombre, u.identificador`,
      [fechaValida, fechaValida]
    );
    return filas;
  }
}

module.exports = {
  ReporteService,
  esAtraso,
  esSalidaAnticipada,
  validarFecha,
  HORA_LIMITE_ENTRADA,
  HORA_LIMITE_SALIDA
};
