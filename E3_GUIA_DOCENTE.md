# E3_GUIA_DOCENTE.md — Borrador de entrega técnica

**Estado:** PLANTILLA PREPARADA. No contiene resultados de pruebas ni acreditación docente.  
**Fuente:** material parcial recuperado de Etapa III de Integración de Competencias II. Debe compararse con anexos y rúbrica oficiales.

## A. Informe de análisis de impacto de cambios

### 1. Resumen ejecutivo

Se propone adaptar el sistema web de control de asistencia de la E2 a una aplicación Android, reutilizando el servidor Node.js/Express y la persistencia MySQL. La ampliación incorpora control de ubicación y biometría del dispositivo en un entorno de pruebas con Android Emulator.

**Resultado de implementación:** PENDIENTE.

### 2. Situación actual

El sistema E2 cuenta con funciones de acceso, marcaciones y persistencia. **Verificar en la versión E2 final** las rutas y módulos realmente operativos antes de describirlos de forma definitiva.

### 3. Cambios requeridos

| ID | Cambio propuesto | Motivo | Estado |
|---|---|---|---|
| E3-01 | Cliente Android en Java/XML | Incorporar canal móvil | Pendiente |
| E3-02 | Bloqueo cuando backend no responde | Evitar marcación no persistida | Pendiente |
| E3-03/04 | GPS y perímetro de sede | Condicionar lugar de marcación | Pendiente |
| E3-05 | Autenticación biométrica Android | Confirmación local del usuario | Pendiente |
| E3-06/07 | Integración de marcación con comprobación de coordenadas en servidor | Persistir solo solicitudes móviles válidas | Pendiente |

### 4. Impacto técnico

- **Cliente:** nuevo módulo Android, conexión al servidor E2 y funciones nativas de GPS/biometría.
- **Servidor:** modificación mínima de ruta y validaciones de marcación; conservar servicios de negocio.
- **Base de datos:** reutilizar MySQL; modificación de esquema solo si una regla verificada lo necesita.
- **Red:** servidor local accesible desde Android Emulator, sin despliegue público.
- **Compatibilidad:** verificar sesiones/cookies entre WebView y llamadas HTTP nativas.

**Impacto efectivo y archivos cambiados:** PENDIENTES DE IMPLEMENTACIÓN.

### 5. Impacto operacional

El empleado debe iniciar sesión, activar permisos de ubicación y realizar verificación biométrica en el equipo. La marcación requiere un servidor accesible. En el entorno académico, el emulador simula presencia y huella.

### 6. Análisis de riesgos

| Riesgo | Impacto | Mitigación mínima |
|---|---|---|
| Backend no disponible | No se puede marcar | Error explícito; no guardar offline |
| GPS sin ubicación/permisos | Rechazo de marcación | Solicitar permiso y mostrar causa |
| Emulador sin biometría configurada | No se puede demostrar flujo | Configurar huella simulada antes de probar |
| Ruta web antigua elude comprobaciones | Validación incompleta | Auditar y restringir flujo; reportar limitación si queda |
| Diferencias entre E2 local y GitHub | Pérdida de avances | Auditar y preservar antes de copiar |
| Anexos docentes incompletos | Requisito omitido | Revisar caso y rúbrica original |

### 7. Plan de pruebas asociado

Ver sección C. Se ejecutarán casos positivos y negativos y se verificarán persistencias reales en MySQL. **No registrar éxito hasta comprobarlo.**

### 8. Trazabilidad del cambio

Cada cambio E3 debe referenciar requisito, archivo principal realmente modificado, prueba y evidencia. Completar la matriz de la sección B tras la implementación.

## B. Matriz de trazabilidad de requisitos (RTM)

| Requisito | Componente/archivo real | Prueba | Evidencia | Resultado |
|---|---|---|---|---|
| E3-01 Login Android | Por confirmar | PT-01 | Pendiente | No ejecutada |
| E3-02 Conexión backend | Por confirmar | PT-04 | Pendiente | No ejecutada |
| E3-03 Ubicación disponible | Por confirmar | PT-05 | Pendiente | No ejecutada |
| E3-04 Perímetro 200 m | Por confirmar | PT-02 | Pendiente | No ejecutada |
| E3-05 Biometría | Por confirmar | PT-03 | Pendiente | No ejecutada |
| E3-06 Marcación + MySQL | Por confirmar | PT-01 | Pendiente | No ejecutada |
| E3-07 Validación en servidor | Por confirmar | PT-06 | Pendiente | No ejecutada |

## C. Informe de pruebas e incidencias

| Caso | Procedimiento mínimo | Esperado | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|
| PT-01 | Login; GPS dentro; huella aprobada; entrada/salida | Registro MySQL | Pendiente | No ejecutada | Pendiente |
| PT-02 | Emular GPS fuera del radio | No guardar | Pendiente | No ejecutada | Pendiente |
| PT-03 | Cancelar o rechazar huella simulada | No guardar | Pendiente | No ejecutada | Pendiente |
| PT-04 | Apagar o aislar Node.js | Error, sin guardar | Pendiente | No ejecutada | Pendiente |
| PT-05 | Negar permiso o ubicación ausente | Error, sin guardar | Pendiente | No ejecutada | Pendiente |
| PT-06 | Enviar coordenadas inválidas al endpoint móvil | Servidor rechaza y no guarda | Pendiente | No ejecutada | Pendiente |

### Incidencias

| ID | Descripción | Reproducción | Severidad | Resolución/limitación |
|---|---|---|---|---|
| — | A completar solo si se observa una incidencia | — | — | — |

### Evidencias permitidas

Capturas de Android Emulator, consola de Node, resultados de pruebas, consulta MySQL, APK generado y commit Git. Asociar **cada evidencia a una prueba realmente ejecutada**.

## D. Elementos no cubiertos por este kit

- Reflexión valórica (Actividad 3.2): responsabilidad del estudiante.
- Reflexión de aprendizaje/innovación (Actividad 3.3): responsabilidad del estudiante.
- Pauta, descripciones del caso y plantillas oficiales completas: **no incluidas**, pendientes de revisión contra Aula Virtual.

**Nota:** Las 8 secciones del informe de impacto siguen la estructura descrita en el material docente parcial. Adaptar encabezados y formato finales a la plantilla oficial si difieren.
