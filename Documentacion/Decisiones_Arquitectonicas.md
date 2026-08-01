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
- **Decisión:** Ante la inexistencia de un informe de asistencia, limitar los candidatos al documento fuente actual y a los Google Docs vinculados desde él mediante hipervínculos o chips inteligentes; nunca mezclar otros documentos de la carpeta. Leer todas las pestañas principales y anidadas. Priorizar el propio documento fuente si tiene estructura de transcripción; en caso contrario, identificar una única transcripción vinculada por la marca `Transcripción` o `Transcript` en su nombre y usar como respaldo su estructura interna de varios hablantes, etiquetas repetidas y marcas conversacionales. La lista se construirá mediante código con `Nombre: intervención` y añadirá una sola vez al organizador explícito. Las notas temáticas y la lista inferida por OpenAI no serán fuentes de participantes.
- **Motivo:** Una etiqueta de hablante acredita intervención directa y permite distinguirla de nombres solamente mencionados, evitando falsos positivos como terceros citados durante la conversación.
- **Consecuencia:** Los asistentes silenciosos no pueden confirmarse y se omitirán. Los nombres mencionados dentro de intervenciones no se incorporarán. La extracción será determinista, deduplicada y no dependerá de correos ni de la interpretación del modelo. El aislamiento por documento fuente impide seleccionar transcripciones de otras reuniones. Los documentos vinculados se deduplicarán por ID y las autorreferencias al mismo Google Docs se descartarán porque la lectura ya incluye todas sus pestañas. No se registrarán URLs, IDs, títulos ni contenido. La ausencia o multiplicidad de contenidos con estructura de transcripción dentro de ese alcance producirá un error controlado.

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
