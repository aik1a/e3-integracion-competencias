# E3_ESTADO.md

## Estado actualizado por Orquestador

- GitHub publicado: rama `e3/android-mvp`, commit `bba1c2f3c4d4887b165b509de2cc4daa5bb024a4`. Copia local sincronizada; los 100 archivos coinciden en el arbol Git `488d8295b552a6c1a371b740b10d34dc7a47d8b9`.
- APK instalado realmente en Pixel_10_Pro (`emulator-5554`), resultado `Success`. Android sigue `RUNNING_LOCKED` y pide PIN. Login Android **NO EJECUTADO**; se solicito desbloqueo al usuario. Etapa 2 no iniciada.
- Android Studio cambio localmente wrapper a Gradle 9.9.1 y creo `android/gradle/gradle-daemon-jvm.properties` (Java 25). Cambios conservados sin publicar ni validar; APK anterior compilo con Gradle 9.8.2.
- Backend activo en 3000, MySQL aislado en 3307. Pruebas: 19/19 unitarias y 4/4 integracion MySQL correctas.

## Identidad

- Copia E3: `C:\Users\Admin\Documents\ChatGPT\e3\e3-integracion-competencias`.
- Fuente: ZIP local E2 indicado por el usuario; sin `.git`. El original no fue modificado.
- Base preservada en commit local `7409c2c` (incluye el AGENTS.md original E2).
- Remoto: `https://github.com/aik1a/e3-integracion-competencias.git`.
- Rama: `e3/android-mvp`.
- Último commit local verificado por Codificador: `7409c2c`; cambios Android todavía SIN COMMIT.

## Roadmap y estado

| Etapa | Estado | Cierre |
| --- | --- | --- |
| 1. Android Java/XML/Groovy y WebView | Implementada y compilada; pendiente auditoría y recorrido con MySQL | Login y consulta desde emulador |
| 2. GPS, perímetro 200 m y BiometricPrompt | Pendiente; no implementada | Marcación válida y bloqueos negativos |
| 3. Verificación y entrega | Pendiente | APK final, pruebas MySQL y evidencia real |

## Entrega más reciente — Codificador, 24-11-2026

- Implementado `android/`: Activity Java, layout XML, Gradle Groovy, wrapper, WebView y permiso INTERNET. Sin Kotlin de aplicación, Firebase ni SQLite.
- Reutilizados sin modificar: `src/`, `database/` y tests E2. WebView conserva cookies, permite solo el origen local y presenta confirmaciones JavaScript de E2.
- Comprueba `/salud` con timeout; muestra error y Reintentar si no hay conexión. No guarda solicitudes para enviarlas después.
- HTTP permitido únicamente a `10.0.2.2`; acceso local de desarrollo, no configuración productiva.
- Archivos modificados: `android/**`, `.gitignore`, `README.md`, este estado. AGENTS/contrato/guía fueron incorporados por Orquestador antes de codificar.
- Prueba ejecutada: Gradle `assembleDebug` terminó **BUILD SUCCESSFUL** en 32 segundos (34 tareas). Compilación con AGP 9.5.0, Gradle 9.8.2, JBR 25.0.4 y SDK 36.
- APK generado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Comando en esta sesión restringida: Gradle instalado directo, `-p android assembleDebug --no-daemon`, con JAVA_HOME del JBR, GRADLE_USER_HOME=`<repo>/.gradle`, GRADLE_RO_DEP_CACHE=`C:/Users/Admin/.gradle/caches` y ANDROID_USER_HOME=`<repo>/.android`.
- Intentos previos: wrapper con caché global falló por escritura denegada; primer modo offline falló por dependencia annotations 13.0 no cacheada. Build online resolvió y compiló.
- Prueba de login, lectura y persistencia MySQL desde Android: **NO EJECUTADA por Codificador**; Orquestador prepara entorno y emulador.
- `git diff --check`: ejecutado durante implementación, sin errores de espacios; revisar nuevamente antes del commit.
- Próxima acción exacta: Orquestador instala APK, prueba login/consulta y audita diff; autoriza etapa 2 tras el cierre o registra el bloqueo real.

## Pendientes y límites

- Auditoría Orquestador: suite unitaria **19/19** y suite MySQL **4/4**, ejecutadas realmente con `node --test --test-isolation=none` (el aislamiento por procesos falla por permisos de esta sesión). MySQL aislado de pruebas en puerto 3307, schema y seed originales, zona SYSTEM comprobada con hora de Chile. Backend iniciado realmente en puerto 3000.
- Emulador: ADB no muestra dispositivos. Intentos automáticos de arranque terminan sin iniciar; se pidió al usuario encender Pixel_10_Pro. Login dentro de Android continúa **NO EJECUTADO**. Iteración 1 pendiente de ese cierre; no iniciar GPS/huella todavía.

- Elegir/verificar coordenadas del punto de prueba Santo Tomás San Joaquín antes de implementar perímetro.
- GPS y biometría son alcance acordado, todavía pendientes de contraste con anexos docentes completos.
- Publicación GitHub y traslado a subcarpeta de Descargas: a cargo del Orquestador; no se afirman completados aquí.
- No se crean nuevos informes; se conserva únicamente este registro operativo y las referencias del kit.
