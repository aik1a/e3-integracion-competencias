# E3_CONTRATO.md — Especificación operativa

**Asignatura:** Integración de Competencias II — Etapa III.  
**Producto:** MVP de control de asistencia Android.  
**Estado:** propuesta técnica aprobada para desarrollar; **pendiente contraste con caso/rúbrica completos del docente**.  
**Base:** versión E2 realmente terminada, a identificar y preservar por Orquestador.

## 1. Objetivo y reutilización

Adaptar el control de asistencia que ya funciona en navegador a una **aplicación Android** con verificación de ubicación y biometría **simuladas en Android Studio Emulator**, manteniendo el login, usuarios, entradas/salidas y almacenamiento MySQL existentes.

El codificador **audita primero el código efectivo**. Archivos orientativos del repositorio histórico: `src/app.js`, `src/views/pages.js`, `src/services/`, `src/db/`, `database/`, `tests/`, `package.json`. El nombre, comportamiento y versión local de cada archivo deben confirmarse antes de modificarlo.

## 2. Stack autorizado

| Capa | Solución |
|---|---|
| Cliente | Android Studio, **Java**, XML, **Gradle Groovy** (`build.gradle`) |
| Pantallas | WebView de la interfaz E2, con puente mínimo a funciones Android nativas si hace falta |
| GPS | API de ubicación Android; coordenadas simuladas desde el emulador |
| Biometría | `BiometricPrompt` (huella simulada en emulador) |
| API | Node.js + Express reutilizados |
| Persistencia | MySQL **solo en servidor local** |
| Acceso del emulador | `http://10.0.2.2:3000` como valor de desarrollo, sujeto a verificación |

No introducir SQLite, Kotlin, Firebase ni hosting.

## 3. Requisitos funcionales de E3

| ID | Requisito | Validación mínima |
|---|---|---|
| E3-01 | Abrir la aplicación Android y utilizar el login existente | Autenticación de prueba exitosa y fallo controlado |
| E3-02 | Exigir disponibilidad del backend antes de marcar | Si Node.js no responde, no se registra nada |
| E3-03 | Obtener la ubicación del emulador | Permiso solicitado, coordenadas leídas, error controlado si no hay ubicación |
| E3-04 | Aceptar únicamente ubicación dentro del perímetro | Radio de **200 m** alrededor de punto de prueba configurado de Santo Tomás/IP San Joaquín; verificar coordenadas de referencia |
| E3-05 | Pedir autenticación biométrica antes de marcar | Éxito simulado continúa; rechazo/cancelación bloquean el flujo |
| E3-06 | Marcar entrada o salida solo tras validaciones | Se conserva regla de negocio E2 y se guarda en MySQL una sola vez |
| E3-07 | Rechazar coordenadas inválidas desde el backend | Fuera de perímetro o sin coordenadas no deben crear marcación móvil |

**Distinción importante:** requisito de “conexión” significa alcanzar el **servidor local**, no solo detectar Wi-Fi/Internet. La biometría nativa se valida en Android; no prometer que el servidor pueda probar por sí mismo que una huella fue presentada. Esto es un prototipo académico, no una garantía antifraude.

## 4. Alcance técnico recomendado

1. Preservar la autenticación HTTP/cookies de E2 o adaptar mínimamente su uso con WebView.
2. Mantener la interfaz HTML previa dentro de WebView (sin rediseñarla).
3. Vincular la acción *Marcar* con código nativo Java para comprobar ubicación y lanzar `BiometricPrompt`, sin almacenar datos biométricos.
4. Integrar una ruta/flujo de marcación móvil que verifique coordenadas en el servidor y reutilice el servicio existente de asistencia. **Auditar la ruta web antigua para evitar un bypass involuntario**. Documentar cualquier límite de seguridad inevitable en MVP.
5. Mantener la configuración local de servidor y radio fuera de valores productivos.
6. Para HTTP local durante desarrollo, configurar permiso `INTERNET` y autorización de tráfico HTTP no cifrado solo para entorno académico/local; no presentarlo como configuración segura para producción.

El mecanismo exacto (puente JavaScript/WebView, endpoint y obtención de sesión) se decide al inspeccionar la versión real de E2. No inventar nombres de rutas ni sustituir módulos funcionales.

## 5. Iteraciones, criterios y orden

### Iteración 1 — Base Android

**Implementar:** preparar checkout E3, proyecto Android en `android/`, WebView, permisos de conectividad, URL local configurable o fija para emulador, conservar login y pantallas E2.

**Cierre:** app compila y, con Node/MySQL iniciados, login y visualización de asistencia funcionan desde Android Emulator. Registrar prueba y limitaciones. **No implementar GPS o huella aún.**

### Iteración 2 — Validaciones y marcado

**Implementar:** GPS de emulador, zona de prueba configurada, `BiometricPrompt`, conexión nativa/HTML, flujo de entrada/salida y validación de coordenadas en Node. Reutilizar lógica existente de asistencia.

**Cierre:** dentro de zona + biometría exitosa = marcación persistida; fuera de zona, biometría rechazada, GPS ausente o backend inaccesible = sin marcación. Comprobar intento de elusión por ruta antigua y registrar resultado.

### Iteración 3 — Verificación y entrega

**Implementar:** corregir exclusivamente bloqueos, compilar APK de demostración, probar casos de aceptación y rellenar `E3_GUIA_DOCENTE.md` con resultados y evidencias auténticas.

**Cierre:** APK compilado, resultados reproducibles, trazabilidad y análisis de impacto completados con datos reales. Declarar pendientes que no pudieron validarse.

## 6. Pruebas mínimas planeadas

- **PT-01:** login correcto y marcación normal válida con backend activo.
- **PT-02:** GPS fuera del radio: no registra.
- **PT-03:** biometría cancelada/rechazada: no registra.
- **PT-04:** Node.js apagado o inaccesible: no registra, muestra error claro.
- **PT-05:** ubicación ausente o permiso rechazado: no registra.
- **PT-06:** coordenadas inválidas enviadas al backend móvil: rechazo y ningún registro MySQL.

Los estados son **pendientes** hasta ejecución real. No confundir modo demo del emulador con verificación física de presencia.

## 7. Fuera de alcance

SQLite, sincronización offline, mapa gráfico, registro facial, GPS en segundo plano, despliegue público, notificaciones, CI nuevo, diseños pulidos, cambios extensos a la estructura E2 o funciones no exigidas.

## 8. Pendientes docentes y decisiones

- [ ] Confirmar casos de uso nuevos de E3 con el documento institucional correcto.
- [ ] Contrastar con rúbrica de Actividad 3.1 y plantillas oficiales.
- [ ] Confirmar ubicación/latitud/longitud del punto de prueba y radio de 200 m.
- [ ] Confirmar que la versión local final de E2 es la utilizada como base.
- [ ] Confirmar fecha y hora final de entrega en Aula Virtual.

**Conocido del material parcial:** para especialidad solución informática se menciona app móvil Android o .NET MAUI, análisis de impacto de cambios, RTM y reporte de pruebas/incidencias; actividades 3.2/3.3 son reflexivas y serán tratadas por el estudiante. **No se han recuperado íntegramente todos los anexos/rúbricas oficiales.**
