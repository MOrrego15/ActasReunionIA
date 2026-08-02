# Decisiones arquitectónicas

## 1. Propósito

Este documento registra las decisiones iniciales, su motivación y las cuestiones que aún requieren definición. Las decisiones podrán revisarse cuando se disponga de la plantilla institucional y de requisitos operativos completos.

## DA-001: Google Apps Script como plataforma principal

- **Estado:** Aceptada.
- **Decisión:** La orquestación y las integraciones se implementarán en Google Apps Script.
- **Motivo:** Es un requisito del proyecto y proporciona integración directa con Drive, Docs, propiedades, disparadores y bloqueos.
- **Consecuencia:** La solución estará sujeta a cuotas, límites de ejecución y modelo de permisos de Google Apps Script.

## DA-002: Arquitectura modular por responsabilidades

- **Estado:** Aceptada.
- **Decisión:** Separar orquestación, configuración, Drive, procesados, correlativo, prompt, OpenAI, validación, documentos, exportación, auditoría y utilidades.
- **Motivo:** Reducir acoplamiento y permitir pruebas y cambios localizados.
- **Consecuencia:** El flujo principal dependerá de contratos claros entre módulos, aunque Apps Script no imponga módulos de forma nativa.

## DA-003: Procesamiento de una única fuente por ejecución

- **Estado:** Aceptada.
- **Decisión:** Cada ejecución procesará como máximo el documento pendiente más reciente.
- **Motivo:** Es una regla explícita y reduce el impacto de cuotas, tiempos de espera y fallos parciales.
- **Consecuencia:** Una acumulación de documentos requerirá múltiples ejecuciones.

## DA-004: Idempotencia basada en el identificador de Drive

- **Estado:** Aceptada.
- **Decisión:** Registrar el identificador estable del documento fuente como clave de control.
- **Motivo:** Los nombres y ubicaciones pueden cambiar y no garantizan unicidad.
- **Consecuencia:** El registro de procesados será una dependencia crítica y deberá ser durable.

## DA-005: Correlativo persistente y protegido por bloqueo

- **Estado:** Aceptada.
- **Decisión:** Mantener el último correlativo en almacenamiento persistente y modificarlo dentro de una sección crítica.
- **Motivo:** Evitar reinicios y números duplicados entre ejecuciones concurrentes.
- **Consecuencia:** Debe definirse la semántica de reserva y recuperación ante fallos.

## DA-006: Secretos fuera del repositorio

- **Estado:** Aceptada.
- **Decisión:** Almacenar la clave de OpenAI en propiedades seguras de Apps Script u otro mecanismo autorizado, nunca en archivos versionados.
- **Motivo:** Cumplir el requisito de no almacenar credenciales y reducir exposición.
- **Consecuencia:** La instalación deberá incluir un procedimiento externo de aprovisionamiento.

## DA-007: Respuesta estructurada y validada antes de generar documentos

- **Estado:** Aceptada en principio.
- **Decisión:** Solicitar una salida estructurada y validarla antes de crear el acta definitiva.
- **Motivo:** Disminuir ambigüedad y evitar documentos incompletos.
- **Consecuencia:** El esquema no puede cerrarse hasta conocer los campos de la plantilla institucional.

## DA-008: Confirmación tardía del procesamiento

- **Estado:** Aceptada.
- **Decisión:** Marcar la fuente como `COMPLETADO` únicamente después de crear y verificar el `.docx`.
- **Motivo:** Evitar perder una fuente por un fallo posterior a la llamada de OpenAI.
- **Consecuencia:** Los fallos intermedios pueden dejar artefactos parciales que deberán conciliarse.

## DA-009: Carpetas mensuales bajo una raíz configurada

- **Estado:** Aceptada parcialmente.
- **Decisión:** Guardar los entregables en una carpeta mensual resuelta bajo una carpeta raíz.
- **Motivo:** Es un requisito explícito de organización.
- **Pendiente:** Definir el patrón exacto del nombre mensual y qué fecha determina el periodo.

## DA-010: Nomenclatura determinista

- **Estado:** Aceptada.
- **Decisión:** Usar `DD.MM.AAAA-NNN-Daily.docx`.
- **Motivo:** Es el formato requerido.
- **Consecuencia:** `NNN` tendrá un mínimo de tres dígitos y no deberá truncarse al superar 999.
- **Pendiente:** Confirmar qué fecha debe usarse: fecha de reunión, fecha del documento o fecha de procesamiento.

## DA-011: Auditoría desacoplada del registro de procesados

- **Estado:** Propuesta.
- **Decisión:** Tratar conceptualmente la auditoría de ejecuciones y el control de idempotencia como responsabilidades diferentes, aunque puedan compartir almacenamiento.
- **Motivo:** La auditoría registra todos los intentos; el control de procesados responde si una fuente ya fue completada.
- **Pendiente:** Seleccionar el almacenamiento concreto.

## DA-012: Control explícito de concurrencia

- **Estado:** Aceptada.
- **Decisión:** Utilizar el mecanismo de bloqueo de Apps Script en las operaciones críticas.
- **Motivo:** Los disparadores o ejecuciones manuales pueden solaparse.
- **Consecuencia:** Se deberá definir tiempo máximo de espera y comportamiento cuando el bloqueo no esté disponible.

## DA-013: No versionar entregables ni material sensible

- **Estado:** Aceptada en principio.
- **Decisión:** El repositorio contendrá código y documentación, no actas generadas, notas de reuniones, secretos ni documentos con información institucional.
- **Motivo:** Reducir exposición y mantener Git enfocado en artefactos de desarrollo.
- **Pendiente:** Definir reglas concretas de exclusión cuando se creen las carpetas funcionales.

## DA-014: Evidencia de asistencia por hablante y organizador

- **Estado:** Aceptada.
- **Decisión:** Ante la inexistencia de un informe de asistencia, limitar los candidatos al documento fuente actual y a los Google Docs vinculados desde él mediante hipervínculos o chips inteligentes; nunca mezclar otros documentos de la carpeta. Leer todas las pestañas principales y anidadas. Priorizar el propio documento fuente si tiene estructura de transcripción; en caso contrario, identificar una única transcripción vinculada por la marca `Transcripción` o `Transcript` en su nombre y usar como respaldo su estructura interna de varios hablantes, etiquetas repetidas y marcas conversacionales. Cuando el contenido incluya resumen y transcripción, construir la lista mediante `Nombre: intervención` únicamente después del título de transcripción y de su primera marca de tiempo. Añadir una sola vez al organizador explícito. Las notas temáticas, sus encabezados y la lista inferida por OpenAI no serán fuentes de participantes.
- **Motivo:** Una etiqueta de hablante acredita intervención directa y permite distinguirla de nombres solamente mencionados, evitando falsos positivos como terceros citados durante la conversación.
- **Consecuencia:** Los asistentes silenciosos no pueden confirmarse y se omitirán. Los nombres mencionados dentro de intervenciones no se incorporarán. La extracción será determinista, deduplicada y no dependerá de correos ni de la interpretación del modelo. El aislamiento por documento fuente impide seleccionar transcripciones de otras reuniones. Los documentos vinculados se deduplicarán por ID y las autorreferencias al mismo Google Docs se descartarán porque la lectura ya incluye todas sus pestañas. No se registrarán URLs, IDs, títulos ni contenido. La ausencia o multiplicidad de contenidos con estructura de transcripción dentro de ese alcance producirá un error controlado.

## DA-015: Agenda institucional fija

- **Estado:** Aceptada.
- **Decisión:** La Fase 4 mostrará una única fila de dos columnas con la etiqueta `Agenda` y el valor fijo `Dayli – reunión de seguimiento`. La celda de etiqueta conservará el fondo plomo `#d9d9d9`, los anchos institucionales y el borde de 0.75 puntos. La lista `agenda` de la respuesta validada no se representará en esta sección.
- **Motivo:** El formato institucional aprobado para estas reuniones Daily requiere una descripción uniforme y no una lista variable.
- **Consecuencia:** Todas las actas generadas por este proyecto mostrarán el mismo texto de agenda hasta que una decisión posterior autorice parametrizarlo.

## DA-016: Catálogo fijo de siglas y acrónimos

- **Estado:** Aceptada.
- **Decisión:** La Fase 5 mostrará siempre el catálogo autorizado de 11 siglas y acrónimos, numerado en orden fijo. La sección usará una celda lateral ploma `Siglas y Acrónimos` y una tabla interior de número y descripción sin bordes visibles, sin espaciado de párrafo ni relleno vertical entre elementos.
- **Motivo:** El contenido corresponde al vocabulario institucional estable de las reuniones Daily de Inversiones y debe conservar una presentación uniforme.
- **Consecuencia:** La sección no depende de OpenAI ni del texto de la reunión. Cualquier alta, baja o modificación del catálogo requerirá una decisión y un cambio de código explícitos.

## DA-017: Temas tratados equivalentes a acuerdos

- **Estado:** Aceptada.
- **Decisión:** La Fase 6 representará `Temas tratados` usando directamente los objetos de la lista validada `acuerdos`. Mantendrá la numeración recibida y mostrará cada descripción en una tabla interior sin bordes, con espaciado anterior y posterior en cero y relleno vertical de celda en cero.
- **Motivo:** Para este proyecto los temas tratados son equivalentes a los acuerdos y no requieren un segundo campo ni una inferencia adicional.
- **Consecuencia:** Temas tratados y la futura Fase 7 comparten la misma fuente de datos. Cualquier diferenciación posterior requerirá modificar explícitamente el contrato.

## DA-018: Cierre con acuerdos responsables y próxima reunión

- **Estado:** Aceptada.
- **Decisión:** La Fase 7 mostrará una fila vacía de `Riesgos o problemas`, un encabezado plomo `Acuerdos` y una lista con viñetas alimentada por `tareas`. Con responsable se usará `Nombre: descripción`; sin responsable se mostrará solo la descripción, sin prefijo ni dos puntos. La Fase 8 calculará `Próxima reunión` como el siguiente día de lunes a viernes a partir de la fecha del acta, omitiendo sábados y domingos, y mostrará el mes en español.
- **Motivo:** Reproducir el modelo institucional y evitar inventar responsables ausentes.
- **Consecuencia:** La sección `Temas tratados` continúa usando `acuerdos`, mientras la sección visual `Acuerdos` usa `tareas` y su campo `responsable`. La etiqueta permanece en la columna izquierda y las tareas ocupan la columna derecha ancha dentro de la misma fila. El cálculo conserva los cambios de mes y año, y si el día siguiente cae sábado o domingo avanza hasta el lunes. Los feriados no se excluyen mientras no exista un calendario autorizado.

## DA-019: Conversión Word mediante el servicio nativo de Drive

- **Estado:** Sustituida por DA-020.
- **Decisión:** `Word.gs` convertirá el Google Docs mediante `File.getAs(MimeType.MICROSOFT_WORD)` y no llamará manualmente a `GET /drive/v3/files/{fileId}/export` con `ScriptApp.getOAuthToken()`.
- **Motivo:** La ejecución real generó correctamente el acta, pero el endpoint HTTP rechazó el token temporal con `WORD_AUTENTICACION_ERROR`. El servicio nativo encapsula la conversión y utiliza los permisos de Drive detectados por Apps Script.
- **Consecuencia:** Se elimina la administración manual del token y la dependencia de `UrlFetchApp` para la conversión. Se mantienen el nombre, la carpeta de destino y la verificación posterior del DOCX.

## DA-020: Exportación DOCX por Drive API con alcances explícitos

- **Estado:** Aceptada.
- **Decisión:** `Word.gs` usará `GET /drive/v3/files/{fileId}/export` con el MIME DOCX oficial. `appsscript.json` declarará explícitamente los alcances de Drive, Docs, Sheets y solicitudes externas usados por el proyecto.
- **Motivo:** La ejecución real demostró que `File.getAs()` no convierte Google Docs a DOCX. La referencia oficial limita esa conversión y Drive API sí publica DOCX como formato de exportación. El 403 anterior ocurrió sin garantizar el alcance Drive dentro del token temporal.
- **Consecuencia:** La siguiente ejecución requiere reautorización del usuario. El proyecto no solicita alcances adicionales a los servicios que ya utiliza funcionalmente.

## DA-021: Eliminación permanente del Google Docs temporal

- **Estado:** Aceptada.
- **Decisión:** Después de crear y verificar el DOCX, `Word.gs` eliminará permanentemente mediante Drive API el Google Docs temporal generado para el acta. Nunca eliminará el documento fuente.
- **Motivo:** El entregable institucional definitivo es el archivo DOCX y el usuario autorizó expresamente que el documento intermedio no permanezca en Drive.
- **Consecuencia:** La eliminación no es recuperable. Si devuelve error, el procesamiento queda en `ERROR`; si la exportación o verificación falla, la eliminación no se intenta.

## Decisiones pendientes

1. Criterio para identificar documentos como notas válidas de Gemini.
2. Campo de fecha usado para seleccionar el documento más reciente.
3. Almacenamiento del registro de procesados, correlativo y auditoría.
4. Esquema completo de la respuesta de OpenAI.
5. Modelo de OpenAI y parámetros autorizados.
6. Política de reintentos y tratamiento de errores recuperables.
7. Gestión de artefactos parciales.
8. Formato de carpeta mensual.
9. Fecha utilizada en el nombre del acta.
10. Retención, clasificación y acceso a datos.
11. Estrategia de pruebas y ambientes.
