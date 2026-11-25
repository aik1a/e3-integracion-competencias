# Trazabilidad de entrega

Esta tabla localiza cada requisito oficial sin duplicar el código en scripts separados.

| ID | Implementación principal | Interfaz o ruta | Prueba asociada | Evidencia |
| --- | --- | --- | --- | --- |
| CA-01 | `src/app.js`, `src/services/asistenciaService.js`, `src/db/connection.js`, `compose.yml`, `database/schema.sql` | `POST /login`, `GET /asistencia`, `POST /asistencia/marcar` | `tests/sprint02.unit.test.js`, `tests/sprint02.integration.test.js`, `tests/sprint04.integration.test.js` | Runs `35119603201` y final `36467694142`: QA-001/002 con MySQL |
| GU-01 | `src/app.js`, `src/services/usuarioService.js`, `src/views/pages.js` | `GET /usuarios/nuevo`, `POST /usuarios` | `tests/sprint02.integration.test.js` | Runs `35119603201` y final `36467694142` |
| GU-02 | `src/app.js`, `src/services/usuarioService.js`, `src/views/pages.js` | `GET /usuarios/:id/editar`, `POST /usuarios/:id` | `tests/sprint02.integration.test.js` | Runs `35119603201` y final `36467694142` |
| GU-03 | `src/app.js`, `src/services/usuarioService.js`, `src/views/pages.js`; FK `ON DELETE RESTRICT` en `database/schema.sql` | `POST /usuarios/:id/desactivar` y `POST /usuarios/:id/eliminar`, confirmaciones distintas | `tests/sprint04.unit.test.js`, `tests/sprint04.integration.test.js` | Run `36467694142`: borrado físico y FK real; confirmaciones en HTML. Cancelación en navegador sin registro individual |
| RE-01 | `src/services/reporteService.js`, `src/app.js`, `src/views/pages.js`, `compose.yml` | `GET /reportes?fecha=AAAA-MM-DD` | `tests/sprint03.unit.test.js`, `tests/sprint04.unit.test.js`, `tests/sprint04.integration.test.js` | Runs `35303900433` y final `36467694142`: QA MySQL aprobado |
| RE-02 | `src/services/reporteService.js`, `src/app.js`, `src/views/pages.js`, `compose.yml` | `GET /reportes?fecha=AAAA-MM-DD` | `tests/sprint03.unit.test.js`, `tests/sprint04.unit.test.js`, `tests/sprint04.integration.test.js` | Runs `35303900433` y final `36467694142`: QA MySQL aprobado |
| RE-03 | `src/services/reporteService.js`, `src/app.js`, `src/views/pages.js`, `compose.yml` | `GET /reportes?fecha=AAAA-MM-DD` | `tests/sprint03.integration.test.js`, `tests/sprint04.unit.test.js`, `tests/sprint04.integration.test.js` | Runs `35303900433` y final `36467694142`: QA MySQL aprobado |
| AP-01 | `src/services/usuarioService.js`, `src/app.js` | `GET /api/empleados?estado=activo|inactivo|todos` | `tests/sprint03.unit.test.js`, `tests/sprint03.integration.test.js` | Runs `35303900433` y final `36467694142` |

## Límites de la evidencia

- Los runs anteriores son históricos; el run final `36467694142` concluyó `success` sobre `sprint/04-entrega` en `b5baa96f6fa70fa68dc926f7ff90ceddb74a6336`, con 19/19 unitarias y 4/4 integraciones MySQL, sin fallos ni omisiones.
- Docker Compose local y recorrido manual general satisfactorio fueron informados por el responsable. No se adjuntaron logs ni capturas manuales; el run no acredita cancelaciones individuales en navegador.
- `database/schema.sql` es el script definitivo de creación; `database/seed.sql` contiene datos ficticios.

## Correcciones verificadas de Sprint 04

| Alcance | Implementación | Prueba/evidencia |
| --- | --- | --- |
| CA-01, RE-01, RE-02, RE-03 | `TZ=America/Santiago` en aplicación y MySQL; fecha/hora sin conversión implícita del driver | QA-001/002/003 en MySQL/HTTP, run `36467694142`; Docker local informado |
| RE-01, RE-02, RE-03 | Fecha visible `dd-mm-aaaa`, consulta técnica `AAAA-MM-DD`; fecha actual precargada sin consulta automática | QA-004 y prueba HTTP de `/reportes`, run `36467694142` |
| GU-03 | **Desactivar** es baja lógica; **Eliminar** es borrado físico. Ambas acciones piden confirmación. La FK `ON DELETE RESTRICT` impide eliminar con marcaciones históricas y se indica Desactivar como alternativa | QA-005/006/007/008 automatizadas, run `36467694142`; cancelación manual sin evidencia individual |

`Administrador demo` en RE-03 permanece como decisión de dominio pendiente, no como defecto confirmado.
