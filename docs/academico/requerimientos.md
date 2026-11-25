# Requerimientos del sistema

## Contexto

El proyecto corresponde a una aplicación web mínima para controlar la asistencia de una empresa de 25 trabajadores y trabajadoras dedicada a la compra y venta de productos químicos.

## Requerimientos funcionales

| ID | Requerimiento | Descripción oficial resumida | Sprint de implementación |
| --- | --- | --- | --- |
| CA-01 | Control de asistencia | Los usuarios ingresan con correo y contraseña, marcan entrada o salida mediante botones y el sistema almacena identificador, acción, fecha y hora, además de confirmar el registro. | Sprint 02 |
| RE-01 | Reporte de atrasos | El administrador visualiza las entradas posteriores a las 09:30, con el identificador de cada usuario y los días de atraso. | Sprint 03 |
| RE-02 | Reporte de salidas anticipadas | El administrador visualiza las salidas anteriores a las 17:30, con el identificador de cada usuario y los días correspondientes. | Sprint 03 |
| RE-03 | Reporte de inasistencias | El administrador visualiza los usuarios y días en que no se registró entrada ni salida. | Sprint 03 |
| GU-01 | Crear usuarios | El administrador crea usuarios y el sistema valida, guarda y confirma la información. | Sprint 02 |
| GU-02 | Modificar usuarios | El administrador selecciona un usuario, modifica sus datos y el sistema valida, guarda y confirma los cambios. | Sprint 02 |
| GU-03 | Eliminar usuarios | El administrador selecciona un usuario y confirma la eliminación definitiva. Si existen marcaciones históricas, el borrado físico se rechaza y se indica que puede desactivarlo para conservar el historial. **Desactivar** se mantiene como una operación distinta de baja lógica. | Sprint 02, corrección Sprint 04 |
| AP-01 | Listar empleados | Una API REST de solo lectura retorna un objeto JSON con los empleados filtrados por estado Activo, Inactivo o Todos. | Sprint 03 |

## Alcance de Sprint 00

En esta fase los requerimientos quedan analizados y documentados. No se implementa todavía ninguno de forma funcional completa.

## Fuente

Este documento resume el caso institucional según `sources/originales/01_caso_y_listado_de_requerimientos.docx` y las decisiones mínimas aprobadas en `docs/project/ESPECIFICACION_CANONICA.md`.
