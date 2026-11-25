const ACCIONES = ['entrada', 'salida'];

class Marcacion {
  constructor({ usuarioIdentificador, accion, fechaHora = new Date() }) {
    if (!usuarioIdentificador) {
      throw new Error('El identificador del usuario es obligatorio');
    }

    if (!ACCIONES.includes(accion)) {
      throw new Error('La acción debe ser entrada o salida');
    }

    const fechaNormalizada = new Date(fechaHora);
    if (Number.isNaN(fechaNormalizada.getTime())) {
      throw new Error('La fecha y hora deben ser válidas');
    }

    this.usuarioIdentificador = usuarioIdentificador;
    this.accion = accion;
    this.fechaHora = fechaNormalizada;
  }
}

module.exports = Marcacion;
