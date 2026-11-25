# Plan de pruebas unitarias

## Introducción

Este plan organiza las comprobaciones del MVP de control de asistencia. Su propósito es detectar errores en cada módulo antes de integrarlo con el resto del sistema y dejar evidencia reproducible de los resultados.

## Objetivo de las pruebas unitarias

Validar de manera individual las reglas y funciones principales del sistema, comprobando que cada resultado coincida con lo esperado y que las entradas previsiblemente inválidas se rechacen de forma controlada.

## Alcance

Se planifican pruebas para:

- clases iniciales `Usuario` y `Marcacion`;
- acceso con correo y contraseña;
- creación, modificación, desactivación y eliminación protegida de usuarios;
- reglas de entrada, salida, atraso, salida anticipada e inasistencia;
- filtro de empleados por estado.

La conexión con MySQL y los recorridos HTTP completos se comprobarán mediante pruebas de integración en las fases correspondientes. No se incluyen pruebas de carga, seguridad avanzada ni una suite E2E extensa.

## Herramientas de prueba

- Lenguaje: JavaScript.
- Ejecutor unitario: módulo nativo `node:test` de Node.js.
- Aserciones: módulo nativo `node:assert`.
- Pruebas HTTP iniciales: `fetch` incorporado en Node.js.

## Casos de prueba

Los casos de las clases iniciales se ejecutaron en Sprint 00 y los casos funcionales se incorporaron en sus fases correspondientes.

| Caso N° | Nombre del caso | Módulo/Función | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| PU-001 | Crear usuario válido | `Usuario` | Identificador, nombre, correo y perfil válidos | Se construye un usuario activo | Se construyó un empleado activo | Correcto |
| PU-002 | Rechazar perfil inválido | `Usuario` | Perfil distinto de administrador o empleado | Se rechaza la creación | Se rechazó el perfil `supervisor` | Correcto |
| PU-003 | Crear marcación válida | `Marcacion` | Usuario, acción entrada y fecha válida | Se construye una marcación | Se construyó una entrada con objeto `Date` | Correcto |
| PU-004 | Rechazar acción inválida | `Marcacion` | Acción distinta de entrada o salida | Se rechaza la marcación | Se rechazó la acción `pausa` | Correcto |
| PU-005 | Validar credenciales | Acceso | Contraseña correcta e incorrecta frente a un hash `scrypt` | Se autoriza solo la contraseña correcta | Se validó la contraseña correcta y se rechazó la incorrecta | Correcto |
| PU-006 | Rechazar salida sin entrada | Regla de marcación | Salida sin entrada previa en la fecha | Se rechaza la salida | Se rechazó con mensaje controlado | Correcto |
| PU-007 | Detectar atraso | Regla de horario | Entradas 09:30 y 09:31 | 09:30 no es atraso y 09:31 sí | Los dos límites se clasificaron correctamente | Correcto |
| PU-008 | Detectar salida anticipada | Regla de horario | Salidas 17:29 y 17:30 | 17:29 es anticipada y 17:30 no | Los dos límites se clasificaron correctamente | Correcto |
| PU-009 | Filtrar usuarios activos | Filtro de estado | Estado Activo | Se retornan solo usuarios activos | Se aceptó el filtro y la integración devolvió solo activos | Correcto |
| PU-010 | Filtrar todos los usuarios | Filtro de estado | Estado Todos | Se retornan usuarios activos e inactivos | La integración devolvió activos e inactivos | Correcto |

## Criterios de aceptación

Una prueba se considera **Correcta** cuando:

- el resultado obtenido coincide exactamente con el esperado;
- no se generan errores no controlados;
- la prueba puede repetirse con el mismo resultado;
- la función cumple la especificación canónica sin añadir reglas nuevas.

Si cualquiera de estas condiciones no se cumple, su estado será **Fallo** y se registrará la causa.

## Evidencias del desarrollo de las pruebas unitarias

Para cada ejecución se incorporará evidencia verificable, según corresponda:

- salida de `npm test` en consola;
- fragmentos del código de prueba;
- capturas de pantalla;
- informes automáticos sencillos.

Evidencia de Sprint 00: `node --test` ejecutó cinco pruebas, incluidas PU-001 a PU-004 y la respuesta HTTP de `/salud`; resultado: cinco correctas y cero fallos.

Evidencia local de Sprint 01: `npm test` ejecutó las cinco pruebas anteriores más una comprobación estructural de `database/schema.sql`; resultado: seis correctas y cero fallos. La integración no pudo comprobarse localmente por ausencia de MySQL y Docker.

Evidencia reproducible de Sprint 01: el workflow `Sprint 01 - Validacion MySQL` se ejecutó en GitHub Actions run `35058288461` con MySQL 8.4 y Node 20.20.2. `database/schema.sql` se aplicó desde cero; `npm test` obtuvo 6/6 pruebas correctas; `npm run test:db` obtuvo 1/1 prueba correcta y verificó conexión, tablas, claves y restricciones principales; la aplicación inició, respondió en `/salud`, confirmó la conexión con MySQL y se cerró de forma controlada. GitHub Actions se usa únicamente como entorno de pruebas de este sprint, no como infraestructura productiva ni pipeline de despliegue.

Evidencia reproducible de Sprint 02: el workflow `Sprint 02 - Validacion funcional MySQL` run `35119603201` se ejecutó con MySQL 8.4 y Node 20.20.2. `npm test` obtuvo 11/11 pruebas correctas. `npm run test:db` obtuvo 2/2 pruebas correctas y comprobó schema, acceso correcto e incorrecto, pantallas autenticadas, creación, modificación y desactivación de usuarios, restricción de rol, entrada, salida, secuencias inválidas y persistencia MySQL. La aplicación inició y la pantalla `/login` respondió correctamente. `npm audit --audit-level=high` se ejecutó localmente después de actualizar `mysql2` y reportó 0 vulnerabilidades.

Evidencia reproducible de Sprint 03: el workflow `Sprint 03 - Reportes y API MySQL` run `35300816939` se ejecutó con MySQL 8.4 y Node 20.20.2. `npm test` obtuvo 15/15 pruebas correctas. `npm run test:db` obtuvo 3/3 pruebas correctas y mantuvo aprobadas las integraciones anteriores. La prueba de Sprint 03 verificó los límites 09:30/09:31 y 17:29/17:30, usuarios activos con y sin marcaciones, exclusión de inactivos en RE-03, acceso administrativo a reportes, filtros activo/inactivo/todos, filtro inválido, contrato JSON y ausencia de modificaciones por AP-01. La aplicación inició y confirmó la conexión con MySQL. La revisión local con `npm audit --audit-level=high` reportó 0 vulnerabilidades.

Validación final de Sprint 03: GitHub Actions run `35303900433`, ejecutado sobre el commit `f390f3d4b73211dbfd16bd7338d62b37dc30a350`, terminó con resultado `success`. `npm test` mantuvo 15/15 pruebas correctas y `npm run test:db` mantuvo 3/3 pruebas de integración correctas con MySQL 8.4. AP-01 con `estado=todos` comprobó explícitamente la presencia de usuarios activos e inactivos, además de conservar las validaciones de `activo`, `inactivo`, filtro inválido, contrato JSON y ausencia de modificación de datos.

El 16 de septiembre de 2026 se intentó el recorrido visual manual con navegador. No pudo ejecutarse porque el navegador remoto no admitía acceso al servidor local del checkout y, en ese momento, el entorno local no disponía de MySQL ni Docker. Posteriormente, Docker fue estabilizado e integrado en `main`. El responsable informó un recorrido manual general satisfactorio de Sprint 04; no se recibieron capturas ni detalle por acción. La cobertura automatizada se documenta por separado.

## Casos de integración y requisitos

Los resultados siguientes corresponden a ejecuciones históricas verificadas en GitHub Actions. No constituyen una nueva ejecución de Sprint 04.

| Caso N° | Nombre del caso | Módulo/Función | Datos de entrada | Resultado esperado | Resultado obtenido | Estado | Evidencia |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IT-001 | Acceso y asistencia | CA-01 | Credenciales válidas e inválidas; entrada, repetición y salida | Autenticar solo al activo, persistir secuencia válida y rechazar secuencias inválidas | Flujo HTTP y persistencia MySQL aprobados | Correcto | Run `35119603201` |
| IT-002 | Crear usuario | GU-01 | Datos válidos de empleado | Validar, proteger contraseña, guardar y confirmar | Creación y hash comprobados | Correcto | Run `35119603201` |
| IT-003 | Modificar usuario | GU-02 | Cambio de nombre conservando contraseña | Validar, guardar y permitir acceso posterior | Modificación y acceso aprobados | Correcto | Run `35119603201` |
| IT-004 | Desactivar usuario | Operación complementaria de GU-03 | Usuario activo | Cambiar a Inactivo e impedir ingreso | Desactivación e ingreso rechazado comprobados | Correcto | Run `35119603201` |
| IT-005 | Reporte de atrasos | RE-01 | Entradas 09:30 y 09:31 | Excluir 09:30 e incluir 09:31 | Límites y tabla HTML comprobados | Correcto | Run `35303900433` |
| IT-006 | Reporte de salidas anticipadas | RE-02 | Salidas 17:29 y 17:30 | Incluir 17:29 y excluir 17:30 | Límites y tabla HTML comprobados | Correcto | Run `35303900433` |
| IT-007 | Reporte de inasistencias | RE-03 | Activo sin marcas e inactivo sin marcas | Incluir solo al activo sin marcaciones | Inclusión y exclusión comprobadas | Correcto | Run `35303900433` |
| IT-008 | API de empleados por estado | AP-01 | `activo`, `inactivo`, `todos` e inválido | Retornar JSON filtrado, responder 400 al inválido y no modificar datos | Contrato, filtros y ausencia de modificación comprobados | Correcto | Run `35303900433` |

## Casos QA del cierre técnico de Sprint 04

La ejecución final de GitHub Actions run `36467694142` validó el SHA `b5baa96f6fa70fa68dc926f7ff90ceddb74a6336` con `TZ=America/Santiago`: `npm test` 19/19 y `npm run test:db` 4/4, sin fallos ni omisiones. Los casos QA se comprueban dentro de esas suites; el recorrido manual general y Docker Compose local fueron informados por el responsable y no se atribuyen al workflow.

| Caso N° | Nombre del caso | Requisito | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| QA-001 | Registrar marcación en hora de Chile | CA-01 | Node.js y MySQL bajo `America/Santiago` | `fecha_hora`, fecha generada, `CURDATE()` y “Marcaciones de hoy” representan día/hora de Chile | Integración MySQL/HTTP aprobada; reloj y día verificados, junto a validación Docker local informada | Correcto |
| QA-002 | Mantener el día en el límite UTC/Chile | CA-01, RE-01, RE-02, RE-03 | Dos instantes a ambos lados de medianoche chilena | Cada marca pertenece al día chileno y solo aparece donde corresponde | Integración simuló 23:59/00:01 en MySQL y comprobó marcas, vista y reportes | Correcto |
| QA-003 | Clasificar límites horarios | RE-01, RE-02 | Entradas 09:30/09:31 y salidas 17:29/17:30 | Clasificar únicamente 09:31 y 17:29 | Límites verificados por HTTP con MySQL | Correcto |
| QA-004 | Mostrar fecha humana en Reportes | RE-01, RE-02, RE-03 | Consulta con resultados | Fechas `dd-mm-aaaa`, sin `Date`/GMT crudo | Vista unitaria y HTTP MySQL aprobados | Correcto |
| QA-005 | Confirmar desactivación | Operación complementaria de GU-03 | Usuario activo | Formulario solicita confirmación; al enviar queda Inactivo | Confirmación presente en HTML y transición verificada con HTTP/MySQL | Correcto automatizado |
| QA-006 | Eliminar usuario sin historial | GU-03 | Usuario sin marcaciones | Confirmación de irreversibilidad y borrado físico | Confirmación presente en HTML; `DELETE` y ausencia posterior verificados con MySQL | Correcto automatizado |
| QA-007 | Proteger usuario con historial | GU-03 | Usuario con marcaciones | Rechazar eliminación y ofrecer Desactivar | FK real impidió el borrado; redirección mostró alternativa y usuario persistió | Correcto |
| QA-008 | Cancelar acciones destructivas | GU-03 | Confirmaciones de Desactivar y Eliminar | Sin envío del formulario al cancelar | Ambas vistas usan `return confirm(...)`; la suite verifica la presencia de ambas confirmaciones. No existe registro individual de cancelación en navegador | Correcto en comprobación automatizada; cancelación manual sin registro individual |

La posible inclusión de `Administrador demo` en RE-03 sigue como decisión de dominio pendiente y no es un bug confirmado.

El parche final de `/reportes` se verificó en la integración HTTP/MySQL: el GET sin `fecha` precarga el día de `America/Santiago` sin tablas, y el GET con `fecha=AAAA-MM-DD` conserva la fecha y presenta los reportes. Es mejora UX y no requisito docente.

## Verificación de entrega de Sprint 04

| Verificación | Resultado real de esta fase | Estado |
| --- | --- | --- |
| Revisión estática de los ocho requisitos | Implementación, rutas y pruebas localizadas en trazabilidad | Completada |
| Revisión de secretos y archivos accidentales | Revisión previa de árbol remoto; `.env` ignorado, valores demo ficticios | Completada |
| GitHub Actions, run `36467694142` | `success` sobre `b5baa96f6fa70fa68dc926f7ff90ceddb74a6336`; schema/seed y arranque MySQL correctos | Correcto |
| Unitarias en GitHub Actions | `npm test`: 19/19, 0 fallos, 0 omitidas | Correcto |
| Integración MySQL en GitHub Actions | `npm run test:db`: 4/4, 0 fallos, 0 omitidas | Correcto |
| Docker Compose local | Responsable informó `app` levantada, `mysql` healthy, 19/19 unitarias, 4/4 integración y `NOW()`/`CURDATE()` de Chile | Correcto según responsable; sin log adjunto |
| Recorrido manual general | Responsable informó ejecución satisfactoria; capturas y desglose individual no incorporados | Correcto según responsable; evidencia externa |

## Conclusión y observaciones

El CODE FREEZE técnico de Sprint 04 quedó validado por el run final `36467694142` sobre el SHA indicado. Los runs históricos prueban sus propios SHA y no sustituyen esta evidencia. El recorrido manual y Docker Compose local constan como resultados informados por el responsable, sin atribuirlos a este agente ni al workflow. No se declara entregado el proyecto académico: faltan formatos y evidencias externas.
