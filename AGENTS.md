# AGENTS.md

## Alcance

Estas instrucciones aplican a todo el repositorio ActasReunionIA.

## Contexto del proyecto

ActasReunionIA automatiza la generación de actas institucionales a partir de notas creadas por Gemini en Google Meet. La plataforma principal es Google Apps Script, con integración con Google Drive, Google Docs y la API de OpenAI.

Antes de realizar cambios, consulta la documentación ubicada en `Documentacion/`, especialmente:

- `Arquitectura.md`
- `Flujo_Procesamiento.md`
- `Decisiones_Arquitectonicas.md`
- `Riesgos_Tecnicos.md`
- `Estructura_Proyecto.md`

## Principio general

Cuando exista duda sobre un requerimiento, no implementar; preguntar primero.

No asumir comportamientos, reglas de negocio, estructuras de datos ni decisiones técnicas que no estén documentadas o expresamente autorizadas.

Antes de crear, eliminar, renombrar o reorganizar archivos o carpetas, informa claramente los cambios y espera aprobación cuando la solicitud no sea explícita.

## Flujo de desarrollo

1. Revisar el estado actual del repositorio y la documentación aplicable.
2. Confirmar el alcance solicitado e identificar requisitos pendientes o ambiguos.
3. Presentar una propuesta antes de realizar cambios cuando así se solicite.
4. Implementar únicamente los archivos y comportamientos autorizados.
5. Ejecutar las validaciones y pruebas pertinentes.
6. Revisar las diferencias y el estado de Git.
7. Informar los archivos modificados, las verificaciones ejecutadas y los asuntos pendientes.
8. Esperar autorización antes de crear commits o publicar cambios.

## Reglas de Git

- Trabaja únicamente dentro del repositorio actual.
- No inicialices repositorios Git adicionales.
- No modifiques la configuración de Git salvo instrucción explícita.
- No modifiques archivos ajenos al alcance solicitado.
- Revisa `git status` y las diferencias antes de preparar cambios.
- Agrega al staging únicamente los archivos autorizados.
- No uses operaciones destructivas para descartar cambios sin autorización.
- No crees commits, ramas, etiquetas ni ejecutes `git push` sin una instrucción explícita.
- No sobrescribas cambios existentes que pertenezcan al usuario.
- No incluyas actas, notas de reuniones ni entregables generados en Git.

## Arquitectura de módulos

La implementación deberá conservar una separación clara entre los siguientes módulos lógicos:

- Orquestación principal.
- Gestión y validación de configuración.
- Acceso a Google Drive y Google Docs.
- Identificación y selección de documentos pendientes.
- Control de documentos procesados.
- Gestión persistente del correlativo.
- Construcción y versionado del prompt.
- Integración con la API de OpenAI.
- Validación de respuestas.
- Generación del acta en Google Docs.
- Exportación a Microsoft Word.
- Organización mensual de entregables.
- Auditoría y manejo de errores.
- Utilidades transversales.

Las integraciones externas no deberán mezclarse con las reglas de negocio. Los contratos de entrada y salida entre módulos deberán mantenerse claros y documentados.

## Arquitectura física del proyecto

```text
ActasReunionIA/
├── AGENTS.md
├── README.md
├── AppsScript/
├── Configuracion/
├── Documentacion/
├── Plantillas/
├── Prompts/
├── Pruebas/
├── Recursos/
├── Scripts/
└── .github/
```

La creación de nuevas carpetas en la raíz requiere autorización explícita.

No almacenes entregables generados dentro del árbol versionado. Consulta `Documentacion/Estructura_Proyecto.md` antes de incorporar o reorganizar componentes.

## Convenciones para Google Apps Script

- Usa Google Apps Script como plataforma principal.
- Mantén puntos de entrada breves y delega las responsabilidades en módulos específicos.
- Evita variables globales mutables.
- Centraliza la lectura y validación de propiedades.
- Usa identificadores estables de Drive; no dependas únicamente de nombres o rutas.
- Utiliza mecanismos de bloqueo de Apps Script para proteger la selección de documentos y la asignación del correlativo.
- Considera las cuotas, límites de ejecución y permisos OAuth.
- Solicita únicamente los permisos necesarios.
- Encapsula las llamadas a servicios de Google y servicios externos.
- No incrustes identificadores operativos, secretos ni credenciales en el código.
- Usa nombres claros y consistentes para funciones, parámetros y estructuras.
- Documenta las funciones públicas y los contratos entre módulos.
- Libera recursos y bloqueos mediante rutas de cierre garantizadas.

## Criterios de implementación

- Mantén separadas las responsabilidades de configuración, Drive, documentos pendientes, control de procesados, correlativo, construcción del prompt, OpenAI, validación, generación documental, exportación Word, auditoría y utilidades.
- Procesa como máximo un documento pendiente por ejecución.
- Usa el identificador de Drive como identidad estable del documento fuente.
- No marques un documento como completado hasta verificar la generación del archivo `.docx`.
- Protege la selección del documento y la asignación del correlativo frente a ejecuciones concurrentes.
- Mantén el formato de salida `DD.MM.AAAA-NNN-Daily.docx`.
- Registra como pendientes las decisiones que no estén definidas; no inventes requisitos.

## Seguridad

- No almacenes claves, tokens, credenciales ni datos sensibles en el repositorio.
- No incluyas secretos en código, documentación, pruebas, mensajes de error o registros.
- Usa propiedades seguras de Google Apps Script para las credenciales.
- Evita registrar el contenido completo de reuniones o prompts con información institucional.
- Solicita únicamente los permisos necesarios para cada integración.

## Calidad y mantenimiento

- Usa español técnico en la documentación y nombres claros en el código.
- Mantén funciones y módulos con responsabilidades concretas.
- Valida entradas y respuestas de servicios externos.
- Incluye manejo explícito de errores y trazabilidad.
- Agrega o actualiza pruebas cuando se implemente comportamiento funcional.
- Documenta las decisiones arquitectónicas que cambien el diseño acordado.

## Documentación

- Mantén la documentación en español técnico, con redacción clara e institucional.
- Actualiza la documentación cuando un cambio altere la arquitectura, el flujo, los riesgos o la estructura del proyecto.
- Registra las decisiones relevantes en `Documentacion/Decisiones_Arquitectonicas.md`.
- Registra los requisitos no definidos como pendientes; no los presentes como decisiones confirmadas.
- No incluyas credenciales, contenido sensible ni datos reales de reuniones.
- Mantén consistencia entre la documentación y el comportamiento implementado.
- No modifiques documentos ajenos al alcance de la tarea.

## Versionado

El ciclo de versionado es:

1. Análisis
2. Diseño
3. Implementación
4. Revisión
5. Pruebas
6. Git Add
7. Commit
8. Push

No se deben mezclar varias fases funcionales en un mismo commit.

Usa versionado semántico cuando el proyecto publique versiones formales. Mantén trazabilidad entre versiones, decisiones arquitectónicas y cambios funcionales. No modifiques números de versión ni crees etiquetas sin una instrucción explícita.

## Restricciones

- No almacenes claves privadas, credenciales, tokens ni secretos en el repositorio.
- No realices llamadas reales a OpenAI salvo autorización explícita.
- No proceses ni incorpores datos reales de reuniones salvo autorización explícita.
- No crees una carpeta `ActasReunionIA` dentro del repositorio actual.
- No inicialices otro repositorio Git.
- No generes ni versiones entregables institucionales.
- No modifiques archivos fuera del alcance autorizado.
- No implementes requisitos ambiguos o pendientes.
- No realices commits ni publiques cambios sin instrucción explícita.

## Control de cambios

- No modifiques archivos ajenos al alcance solicitado.
- Revisa el estado y las diferencias de Git antes de confirmar cambios.
- No crees commits ni ejecutes `git push` sin una instrucción explícita.
- No incluyas actas, notas de reuniones ni entregables generados en Git.
