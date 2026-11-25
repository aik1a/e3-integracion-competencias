# Especificación canónica del proyecto

## 1. Autoridad y propósito

Este es el único documento operativo canónico del proyecto. Reúne lo solicitado por el docente y las decisiones mínimas necesarias para implementarlo sin sobreingeniería.

Los archivos de `sources/originales/` se conservan como evidencia institucional inmutable. Si este documento transcribe incorrectamente una fuente, prevalece el original y se corrige esta especificación.

Las marcas utilizadas son:

- **Docente:** requisito o entrega expresamente presente en una fuente oficial.
- **Decisión mínima:** precisión interna imprescindible para programar sin ampliar el producto.
- **Pendiente:** punto que requiere confirmación y no puede ser inventado por un agente.

Los archivos de sprint y tarea organizan la ejecución, pero no pueden modificar esta especificación.

## 2. Nivel académico y límite de esfuerzo

El resultado esperado es un proyecto de segundo año que funcione, sea comprensible y pueda ser explicado por el equipo. Se aplica POO sencilla y buenas prácticas básicas; no se intenta reproducir una arquitectura o proceso empresarial.

Una actividad solo se realiza si cumple al menos una condición:

- satisface uno de los ocho requerimientos;
- corresponde a una pauta o entregable oficial;
- aporta evidencia exigida por la rúbrica;
- es indispensable para ejecutar o probar el MVP.

Si no cumple ninguna, queda fuera del MVP.

## 3. Producto y alcance docente

**Docente:** construir una aplicación web mínima para controlar la asistencia de una empresa de 25 personas dedicada a la compra y venta de productos químicos.

El MVP incluye:

- ingreso con correo y contraseña;
- marcación de entrada y salida;
- almacenamiento de usuario, acción, fecha y hora;
- creación, modificación y eliminación operativa de usuarios por un administrador;
- reportes de atrasos, salidas anticipadas e inasistencias;
- elementos gráficos apropiados para presentar los reportes;
- API REST de solo lectura para listar empleados por estado;
- base de datos relacional, pruebas y entregables académicos.

## 4. Requerimientos y aceptación mínima

| ID | Solicitud docente | Aceptación mínima del MVP | Fase |
| --- | --- | --- | --- |
| CA-01 | Acceso con correo y contraseña; botones de entrada y salida; guardar identificador, acción, fecha y hora; confirmar el registro. | Un usuario existente inicia sesión, registra una entrada o salida válida y recibe confirmación; la marcación queda en MySQL. | Sprint 02 |
| GU-01 | El administrador crea usuarios. | El administrador ingresa los datos mínimos, el sistema valida, guarda y confirma. | Sprint 02 |
| GU-02 | El administrador modifica usuarios. | El administrador selecciona un usuario, cambia datos permitidos y el sistema valida, guarda y confirma. | Sprint 02 |
| GU-03 | El administrador elimina usuarios. | El administrador selecciona y confirma la eliminación definitiva. Si el usuario tiene marcaciones históricas, el borrado físico se rechaza y se informa que puede desactivarse para conservar el historial. | Sprint 02, corrección Sprint 04 |
| RE-01 | Mostrar entradas posteriores a las 09:30, con identificador y días de atraso. | El administrador obtiene desde MySQL el listado correcto para el período o fecha consultada. | Sprint 03 |
| RE-02 | Mostrar salidas anteriores a las 17:30, con identificador y días correspondientes. | El administrador obtiene desde MySQL el listado correcto para el período o fecha consultada. | Sprint 03 |
| RE-03 | Mostrar usuarios y días sin entrada ni salida. | El administrador obtiene el listado de usuarios activos sin marcaciones en la fecha consultada. | Sprint 03 |
| AP-01 | API REST que devuelve JSON de empleados filtrados por Activo, Inactivo o Todos, sin alterar datos. | Una solicitud de lectura con un filtro válido devuelve el conjunto correspondiente en JSON. | Sprint 03 |

## 5. Decisiones funcionales mínimas

Estas decisiones hacen ejecutables las descripciones oficiales; no crean módulos nuevos.

### Usuarios

- Se utilizan dos perfiles: administrador y empleado.
- Los datos mínimos son identificador, nombre, correo único, contraseña protegida, perfil y estado.
- **Docente:** GU-03 exige literalmente eliminar usuarios; la desactivación no sustituye este requisito.
- **Decisión mínima:** se mantienen dos operaciones distintas:
  - **Desactivar** realiza una baja lógica, cambia el estado a Inactivo, impide el ingreso y conserva el usuario y sus marcaciones. Antes de ejecutarla se debe confirmar que el usuario no podrá ingresar y que su historial se conservará.
  - **Eliminar** realiza el borrado físico definitivo y debe advertir, antes de confirmarse, que la acción es irreversible.
- Si el usuario tiene marcaciones históricas, **Eliminar** no puede borrar físicamente el registro. El sistema debe indicarlo y ofrecer **Desactivar** como alternativa para conservar el historial. Esta regla es coherente con la clave foránea actual `marcaciones.usuario_id`, definida con `ON DELETE RESTRICT`.
- No se implementan permisos configurables, recuperación de contraseña ni verificación de correo.

### Asistencia

- Cada empleado registra como máximo una entrada y una salida por fecha.
- No se acepta una salida sin entrada previa.
- Una marcación repetida se rechaza con un mensaje comprensible.
- Atraso significa entrada posterior a las 09:30.
- Salida anticipada significa salida anterior a las 17:30.
- Inasistencia significa usuario activo sin entrada ni salida en la fecha consultada.
- Las marcaciones, el día vigente y las comparaciones horarias se deben guardar e interpretar coherentemente en la zona `America/Santiago`. Una ejecución Docker en UTC no satisface esta decisión porque puede cambiar el día de la marcación y la clasificación de CA-01, RE-01, RE-02 y RE-03.
- No se modelan turnos, feriados, calendarios avanzados ni edición de marcaciones.

### Reportes y API

- Los reportes usan pantallas y tablas simples. Solo se añade un gráfico estadístico si el docente confirma que lo espera como parte de los “elementos gráficos apropiados”.
- Las fechas visibles en los resultados se presentan en formato humano `dd-mm-aaaa`; no se muestra al usuario el objeto `Date` ni una representación GMT cruda.
- No se construye un tablero analítico.
- AP-01 tendrá un único endpoint de lectura con filtro Activo, Inactivo o Todos.
- La ruta y los nombres exactos del JSON se fijan en el documento de Sprint 03 antes de programar ese endpoint.

### Mejora UX posterior a Sprint 04

- Como parche menor de bajo riesgo, el formulario de Reportes puede precargar la fecha actual calculada en `America/Santiago`.
- La precarga no ejecuta automáticamente la consulta; el administrador debe presionar el botón correspondiente.
- Esta mejora no es un requisito docente obligatorio y no condiciona el cumplimiento de RE-01, RE-02 ni RE-03.

## 6. Stack y diseño reducido

### Decisión mínima

- JavaScript como lenguaje principal.
- Node.js con Express para el backend.
- HTML, CSS y JavaScript sencillo para la interfaz; sin React.
- Vistas renderizadas en servidor cuando reduzcan trabajo.
- MySQL con SQL directo y parametrizado; sin ORM.
- Sesiones tradicionales y hash de contraseñas.
- Una herramienta de pruebas unitarias y una utilidad de pruebas HTTP.
- Docker Compose limitado a aplicación y base de datos para reproducibilidad.

Las versiones y dependencias exactas se fijan una vez al iniciar el código. No se instalan bibliotecas duplicadas para el mismo propósito.

### POO simple

La pauta solicita clases y programación orientada a objetos. Se cumple con clases pequeñas para los conceptos principales, por ejemplo Usuario y Marcación, y servicios simples para las reglas de asistencia y reportes. No se fuerzan patrones ni jerarquías artificiales.

Estructura orientativa máxima:

```text
src/
├── routes/
├── services/
├── db/
├── views/
└── public/

tests/
database/
```

Una división adicional solo se acepta si resuelve una complejidad ya existente.

## 7. Fuera de alcance

- aplicación móvil, biometría y geolocalización;
- remuneraciones y gestión general de recursos humanos;
- turnos configurables y calendario de feriados;
- exportaciones PDF o Excel y notificaciones;
- tiempo real, múltiples empresas y permisos configurables;
- API pública adicional a lo necesario para el MVP;
- microservicios, arquitectura hexagonal, ORM y framework frontend;
- nube, infraestructura productiva, monitoreo y CI/CD complejo;
- sistema de diseño, animaciones o acabado visual avanzado;
- pruebas de carga, cobertura total o matrices de navegadores;
- métricas Scrum, story points, velocidad, burndown y porcentajes automáticos.

## 8. Fases de desarrollo

Solo puede existir una fase activa.

| Fase | Resultado mínimo | Correspondencia docente |
| --- | --- | --- |
| Sprint 00 — Base y clases iniciales | Especificación aprobada, plan de pruebas, proyecto mínimo y clases iniciales del dominio. | Pauta 1.2, semana 2. |
| Sprint 01 — Base de datos | Modelo relacional, script MySQL, datos ficticios y conexión básica. | Pauta 1.3, semana 3. |
| Sprint 02 — Núcleo funcional | Acceso, usuarios y marcaciones con pruebas. | Pauta 1.4, semana 4; CA-01 y GU-01 a GU-03. |
| Sprint 03 — Reportes y API | Tres reportes con presentación visual funcional, AP-01 y pruebas de integración. | Pauta 1.5, semana 5; RE-01 a RE-03 y AP-01. |
| Sprint 04 — Entrega | Correcciones, evidencias, plan de pruebas completo, PPT e informe. | Evaluación práctica, semana 6. |

### Ciclo de cada fase

1. Revisar esta especificación y la fuente relacionada.
2. Completar y aprobar el archivo del sprint.
3. Crear `sprint/NN-nombre` desde `main`.
4. Implementar únicamente lo incluido.
5. Ejecutar las pruebas definidas y registrar resultados reales.
6. Revisar el diff y confirmar que no se amplió el alcance.
7. Integrar a `main` antes de abrir la siguiente fase.

Las tareas pequeñas se realizan en la rama del sprint. `task/*` se reserva para trabajo paralelo, riesgoso o claramente separable.

## 9. Entregables académicos

| Momento | Entrega solicitada |
| --- | --- |
| Pauta 1.2, semana 2 | Requerimientos, plan de pruebas, clases iniciales, ZIP, retroalimentación y carga en Aula Virtual. |
| Pauta 1.3, semana 3 | Modelo relacional, script de creación coherente, retroalimentación y archivo TXT en Aula Virtual. |
| Pauta 1.4, semana 4 | Prototipo POO con usuarios y asistencia, pruebas unitarias documentadas y ZIP. |
| Pauta 1.5, semana 5 | Reportes, elementos gráficos, pruebas unitarias e integración, base de datos y ZIP. |
| Semana 6 | MVP operativo, scripts o código de requerimientos, script de base de datos, plan de pruebas, PPT y evidencias 1.2 a 1.5. |
| Empleabilidad | Informe de resolución de problema complicado y trabajo colaborativo. |

Las preguntas de cierre de cada pauta se responden en la evidencia académica correspondiente; no generan un sistema documental adicional dentro del código.

## 10. Pruebas y evidencias

### Pruebas mínimas

- unitarias para horarios, secuencia de marcaciones y filtro de estado;
- CRUD de usuarios;
- integración básica con MySQL;
- comprobación de los ocho requerimientos;
- recorrido manual de las pantallas usadas en la demostración.

Cada caso documentado incluye identificador, módulo o función, entrada, resultado esperado, resultado obtenido y estado Correcto o Fallo. La evidencia puede ser salida de consola, captura o informe automático sencillo.

No se fija un porcentaje de cobertura. No se requieren pruebas de carga, seguridad avanzada ni una suite E2E extensa.

Una fase termina cuando funciona su alcance, pasan las pruebas acordadas, la evidencia es reproducible y no quedan fallos relevantes para la fase siguiente. Las pruebas no ejecutadas se declaran expresamente.

## 11. Calidad y auditoría contra la rúbrica

La rúbrica completa contiene tres criterios técnicos y dos de empleabilidad. La captura de criterios contiene solo la parte técnica y usa otra escala; se conserva como apoyo secundario. Para planificar se usa la rúbrica completa y se pide confirmación al docente si la escala afecta la calificación.

| Criterio | Cómo se cubre sin sobreingeniería | Evidencia |
| --- | --- | --- |
| Condiciones del proceso | Implementar los ocho requerimientos, identificar errores y ejecutar pruebas relevantes. | MVP y resultados de pruebas. |
| Desempeño de acciones | Interfaz funcional, documentación interna y externa breve y pruebas unitarias. | Pantallas, README, código legible y plan de pruebas. |
| Cumplimiento de estándares | Mostrar la lógica, satisfacer el caso y aplicar las reglas básicas definidas aquí. | Demostración, código, estructura simple y convenciones coherentes. |
| Resolución de problema | Explicar por qué es complicado, estrategia de análisis, tres causas fundamentadas, solución seleccionada y acciones preventivas. | Informe de empleabilidad. |
| Trabajo colaborativo | Incluir tres beneficios de metas comunes, tres acciones de comunicación y tres de coordinación y compromiso. | Informe de empleabilidad. |

“Estándares” se interpreta al nivel del curso: nombres claros, POO sencilla, validación básica, SQL parametrizado, contraseñas protegidas, documentación suficiente y pruebas esenciales. No autoriza arquitectura industrial ni trabajo adicional que la rúbrica no evalúe.

### Resultado de la auditoría documental

- Requerimientos funcionales identificados: **8 de 8**.
- Pautas 1.2 a 1.5 vinculadas a fases: **4 de 4**.
- Evaluación práctica de semana 6: **cubierta documentalmente**.
- Plan de pruebas oficial: **estructura incorporada**.
- Empleabilidad y cinco criterios de la rúbrica: **cubiertos documentalmente**.
- Límites contra sobreingeniería: **definidos**.
- Cumplimiento funcional real: **pendiente hasta implementar y probar el MVP**.

Esta auditoría confirma cobertura documental, no funcionamiento del software.

## 12. Empleabilidad

El informe debe:

- explicar por qué el problema es complicado;
- describir la estrategia de análisis;
- fundamentar al menos tres causas;
- proponer soluciones y fundamentar la seleccionada;
- incluir al menos tres beneficios de metas comunes;
- incluir al menos tres acciones de comunicación efectiva;
- incluir al menos tres acciones de coordinación y compromiso.

No se implementan ceremonias Scrum ni métricas para producir esta evidencia.

## 13. Pendientes que no se deben inventar

- Fecha calendario oficial de entrega.
- Confirmación de modalidad: varias pautas dicen actividad individual, pero también hablan de grupos y roles; empleabilidad indica grupos de 4 a 5.
- Incorporación desde Aula Virtual de `Orientaciones al Trabajo Colaborativo` y `Resolución de problemas`, si están disponibles.
- Escala definitiva cuando exista diferencia entre la rúbrica completa y la captura de criterios.
- Ruta y nombres exactos del JSON de AP-01, que deben fijarse antes de Sprint 03.
- Definir si el usuario `Administrador demo` debe participar en el universo de RE-03. Su aparición en inasistencias es una decisión de dominio pendiente de revisión, no un defecto confirmado; no se modifica hasta resolverla.

Estos pendientes no impiden preparar la base técnica, pero deben resolverse antes de la entrega que corresponda.

## 14. Registro de fuentes oficiales

1. Caso y listado de requerimientos.
2. Rúbrica de evaluación Etapa 1.
3. Pauta 1.2 — Avance 1.
4. Pauta 1.3 — Avance 2.
5. Pauta 1.4 — Avance 3.
6. Pauta 1.5 — Avance 4.
7. Evaluación práctica semana 6.
8. Plan de pruebas unitarias.
9. Evaluación de empleabilidad.
10. Captura de criterios de evaluación Etapa 1.

Los originales correspondientes están en `sources/originales/` y sus copias de consulta en `sources/markdown/`.
