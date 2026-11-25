# Caso y listado de requerimientos

<!-- Copia de consulta derivada de ../originales/01_caso_y_listado_de_requerimientos.docx. El DOCX original es la fuente canónica. -->

## INTEGRACIÓN DE COMPETENCIAS II

### Etapa I

Presentación y Descripción del Caso

Una pequeña empresa de 25 trabajadores y trabajadoras dedicada a la compra y venta de productos químicos ha solicitado la creación de un Mínimo Producto Viable (MVP) para un sistema de registro de asistencia de empleados. La empresa necesita una aplicación web que permita gestionar eficientemente la entrada y salida de sus trabajadores y trabajadoras. Esta solicitud es fundamental para mejorar la organización interna y asegurar el cumplimiento de las normativas laborales, además de optimizar la administración del tiempo, los recursos humanos y dar disponibilidad de datos para integraciones con otros dispositivos en implementaciones futuras.

Listado de Requerimientos:

Desde su jefatura, tradujeron los requerimientos y necesidades de la empresa cliente y se les entregan, a ustedes como equipo de desarrolladores y desarrolladoras, el siguiente listado de requerimientos:

- Requerimientos Funcionales

Descripción detallada de las funciones y características que el software debe cumplir.

| ID | Requerimiento | Descripción |
| --- | --- | --- |
| CA-01 | Control de asistencia | La aplicación debe poder permitir el control de asistencia de los empleados y empleadas de la empresa. Los usuarios deben entrar con correo y contraseña. Los usuarios marcarán su entrada con un botón y su salida de la misma forma. |
| RE-01 | Reporte de atrasos. | La aplicación debe permitir al Administrador, elaborar un reporte de todos y todas aquellas que entre post 9:30 am, lo cual se considera una “entrada atrasada” |
| RE-02 | Reporte de salidas anticipadas. | La aplicación debe permitir al Administrador, elaborar un reporte de todos y todas aquellas que salgan antes de las 17:30 pm, lo cual se considera una “salida anticipada”. |
| RE-03 | Reporte de inasistencias. | La aplicación debe permitir al Administrador, elaborar un reporte de todos y todas aquellas que no registraron ni entrada ni salida un día. |
| GU-01 | Crear usuarios | El administrador debe ser capaz de crear usuarios. |
| GU-02 | Modificar usuarios | El administrador debe ser capaz de modificar usuarios. |
| GU-03 | Eliminar usuarios | El administrador debe ser capaz de eliminar usuarios. |
| AP-01 | Listar empleados | API Rest que retorne un listado de todos los empleados registrados en el sistema según un parámetro de estado. |

Detalle de Requerimientos

| ID | CA-01 |
| --- | --- |
| Nombre | Control de asistencia |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | La aplicación debe poder permitir el control de asistencia de los empleados y empleadas de la empresa. Los usuarios marcarán su entrada con un botón y su salida de la misma forma. |
| Actor | Usuario |
| Precondiciones | Los usuarios deben estar creados Los usuarios deben haber ingresado a la plataforma mediante la ventana login. |
| Flujo Normal | Usuario presiona botón Entrada/salida El sistema almacena el identificador del usuario, acción (entrada/salida), la fecha y hora actual. Sistema emite una confirmación del registro correcto de la entrada/salida. Usuario presiona botón Cerrar sesión. |
| Flujo Alterno | Usuario Presiona botón Cerrar sesión sin presionar botón Entrada/salida. |
| Excepciones |   |
| Postcondiciones | Sistema presenta ventana de Login. |

| ID | RE-01 |
| --- | --- |
| Nombre | Reporte de atrasos |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | La aplicación debe permitir al Administrador, elaborar un reporte de todos y todas aquellas que entre post 9:30 am, lo cual se considera una “entrada atrasada” |
| Actor | Usuario Administrador |
| Precondiciones | Usuario debe haber ingresado Usuario debe tener privilegios de administrador |
| Flujo Normal | Usuario selecciona opción “reporte de entradas atrasadas” Sistema presenta en pantalla todas las entradas que sean posteriores a 9:30 desde la base de datos. Indicando el identificador de cada usuario y los dias que llegó atrasado. |
| Flujo Alterno |   |
| Excepciones |   |
| Postcondiciones | El administrador puede visualizar el reporte de atrasos |

| ID | RE-02 |
| --- | --- |
| Nombre | Reporte de Salidas Anticipadas |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | La aplicación debe permitir al Administrador, elaborar un reporte de todos y todas aquellas que salgan antes de las 17:30 pm, lo cual se considera una “salida anticipada”. |
| Actor | Usuario Administrador |
| Precondiciones | El usuario debe haber ingresado. El usuario debe tener privilegios de administrador. |
| Flujo Normal | El usuario selecciona la opción "reporte de salidas anticipadas". El sistema presenta en pantalla todas las salidas antes de las 17:30 desde la base de datos, indicando el identificador de cada usuario y los días que salió anticipadamente. |
| Flujo Alterno |   |
| Excepciones |   |
| Postcondiciones | El administrador puede visualizar el reporte de salidas anticipadas. |

| ID | RE-03 |
| --- | --- |
| Nombre | Reporte de Inasistencias |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | La aplicación debe permitir al Administrador, elaborar un reporte de todos y todas aquellas que no registraron ni entrada ni salida un día. |
| Actor | Usuario Administrador |
| Precondiciones | El usuario debe haber ingresado. El usuario debe tener privilegios de administrador. |
| Flujo Normal | El usuario selecciona la opción "reporte de inasistencias". El sistema presenta en pantalla todos los días en los que no se registraron ni entradas ni salidas para los usuarios, indicando el identificador de cada usuario. |
| Flujo Alterno |   |
| Excepciones |   |
| Postcondiciones | El administrador puede visualizar el reporte de inasistencias. |

| ID | GU-01 |
| --- | --- |
| Nombre | Crear Usuarios |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | El administrador debe ser capaz de crear usuarios. |
| Actor | Usuario Administrador |
| Precondiciones | El usuario debe haber ingresado. El usuario debe tener privilegios de administrador. |
| Flujo Normal | El usuario selecciona la opción "crear usuario". El usuario ingresa los datos necesarios para la creación del nuevo usuario. El sistema valida y guarda la información del nuevo usuario. El sistema confirma la creación del nuevo usuario. |
| Flujo Alterno |   |
| Excepciones |   |
| Postcondiciones | El nuevo usuario queda registrado en el sistema. |

| ID | GU-02 |
| --- | --- |
| Nombre | Modificar Usuarios |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | El administrador debe ser capaz de modificar usuarios. |
| Actor | Usuario Administrador |
| Precondiciones | El usuario debe haber ingresado. El usuario debe tener privilegios de administrador. |
| Flujo Normal | El usuario selecciona la opción "modificar usuario". El usuario selecciona el usuario que desea modificar. El usuario actualiza los datos necesarios. El sistema valida y guarda los cambios. El sistema confirma la modificación del usuario. |
| Flujo Alterno |   |
| Excepciones |   |
| Postcondiciones | Los datos del usuario son actualizados en el sistema. |

| ID | GU-03 |
| --- | --- |
| Nombre | Eliminar Usuarios |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | El administrador debe ser capaz de eliminar usuarios. |
| Actor | Usuario Administrador |
| Precondiciones | El usuario debe haber ingresado. El usuario debe tener privilegios de administrador. |
| Flujo Normal | El usuario selecciona la opción "eliminar usuario". El usuario selecciona el usuario que desea eliminar. El sistema confirma la acción de eliminación. El sistema elimina al usuario seleccionado. |
| Flujo Alterno |   |
| Excepciones |   |
| Postcondiciones | El usuario es eliminado del sistema. |

| ID | AP-01 |
| --- | --- |
| Nombre | Listar empleados |
| Autor | GG |
| Fecha de Creación | 01-01-2026 |
| Fecha de Actualización | 02-01-2026 |
|   |   |
| Descripción | La API debe ser capas de entregar un objeto JSON con todos los empleados registrados en el sistema filtrados por un estado. |
| Actor | Plataformas externas. |
| Precondiciones | La API debe aceptar un valor como filtro por estado, dicho valor debe retornar todos los empleados registrados en el sistema con dicho valor, ya sea Activo, Inactivo o todos. |
| Flujo Normal | Al momento de consumir la API, se entrega por medio de la URL el estado de los empleados a listar. |
| Flujo Alterno |   |
| Excepciones |   |
| Postcondiciones | Se retorna un objeto JSON sin alterar los datos de los empleados (solo consulta). |

## Recursos gráficos incorporados

![Recurso gráfico extraído del documento](assets/01_caso_y_listado_de_requerimientos/image_01.png)
