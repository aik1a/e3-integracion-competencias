# AGENTS.md — Reglas operativas de E3

## Misión

Desarrollar únicamente la E3 de control de asistencia: **Android Java + XML + Gradle Groovy**, reutilizando el backend **Node.js/Express y MySQL local** de la E2. Calidad **MVP académico**, sin sobreingeniería.

## Autoridad y fuentes

1. Instrucciones y rúbrica docentes **verificadas** > propuestas de funcionalidad.
2. `E3_CONTRATO.md`: alcance técnico E3 aceptado por el responsable.
3. `E3_ESTADO.md`: única fuente de estado operativo entre sesiones.
4. Código y pruebas del repositorio: fuente de verdad para afirmar que una función existe y funciona.
5. Documentación original E2: referencia para reutilización; no modificar `sources/originales/`.

No presentar hipótesis ni propuestas como obligaciones docentes. Si aparece una contradicción material, registrarla y pedir decisión concreta; continuar con trabajo no afectado si es seguro.

## Exactamente dos roles

**Orquestador/Auditor**
- Comprueba la versión de E2, identifica archivos reutilizables y bloqueos.
- Define qué iteración está activa y entrega criterios de aceptación.
- Audita cambios Git, pruebas y alcance; aprueba cierre o solicita correcciones puntuales.
- No desarrolla código en paralelo con el Codificador.

**Codificador**
- Lee `AGENTS.md`, `E3_CONTRATO.md`, `E3_ESTADO.md` y el código afectado antes de cambiar nada.
- Implementa solo la iteración autorizada, prueba, hace cambios mínimos y actualiza `E3_ESTADO.md`.
- Informa comandos, resultados reales, archivos modificados, commit y bloqueos.
- No abre una nueva iteración ni hace merge a `main` por iniciativa propia.

## Política Git y reciclaje

- Nunca modificar ni eliminar la carpeta/entrega E2 original.
- Verificar directorio, remoto, rama, HEAD, árbol de trabajo y diferencias locales frente a GitHub **antes de copiar o modificar**.
- No perder cambios E2 sin commit; preservar y solicitar decisión si hay conflictos.
- Usar **una rama E3**: `e3/android-mvp`, dentro de un checkout/copia independiente.
- Un conjunto de commits claros por iteración; no crear ramas, tickets ni sprints extra.
- Revisar `git diff` y archivos no rastreados; excluir credenciales y artefactos locales.
- No reemplazar el antiguo `AGENTS.md` de E2 sin revisar sus reglas y mantenerlo recuperable por Git.

## Prohibiciones

- Kotlin, archivos Gradle `.kts`, Firebase, SQLite, hosting, API pública, publicación de producción.
- Reescribir el backend o migrar de lenguaje/framework.
- Nuevos módulos, exportaciones, dashboards, notificaciones, autenticación adicional o mapas visuales.
- Cambios cosméticos no indispensables, refactorizaciones amplias, arquitectura empresarial, cobertura exhaustiva, CI/CD nuevo.
- Crear agentes adicionales, tareas paralelas o documentación duplicada.
- Inventar pruebas ejecutadas, resultados, capturas, versiones, commits o cumplimiento docente.

## Calidad mínima

- Una sola iteración activa, en orden 1 → 2 → 3.
- Solución entendible para un alumno: clases sencillas, manejo básico de errores y consultas parametrizadas.
- Reutilizar la sesión/autenticación existente sin guardar contraseñas en el móvil.
- No almacenar ni transmitir huellas; Android resuelve la validación con `BiometricPrompt`.
- El servidor debe comprobar coordenadas en la operación móvil; **no afirmar que valida criptográficamente una huella** si solo recibe una bandera del cliente.
- Evaluar explícitamente que la ruta web antigua no facilite eludir el flujo móvil de la demostración; corregir o documentar honestamente la limitación.
- No guardar marcaciones locales para sincronización posterior.

## Handoff obligatorio entre agentes

Al terminar cada ejecución actualizar `E3_ESTADO.md` y responder con:

1. Iteración, rama, último commit (si existe).
2. Archivos realmente modificados y resumen.
3. Comandos/pruebas ejecutadas y resultado real; señalar las no ejecutadas.
4. Bloqueos y decisiones pendientes.
5. Próxima acción exacta para el otro agente.

**Cierre de iteración:** el Orquestador acepta solo si cumple su criterio de cierre, sin defectos bloqueantes y con evidencia verificable. Correcciones dentro de la misma iteración. No pulir por pulir.
