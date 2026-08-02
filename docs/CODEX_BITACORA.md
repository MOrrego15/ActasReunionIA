# Cambio 0001
Fecha: 2026-07-31
Autor: Codex

## Objetivo

Establecer una bitácora técnica obligatoria y acumulativa para mantener la
trazabilidad de todas las modificaciones funcionales y técnicas realizadas en
el proyecto ActasReunionIA.

## Archivos modificados

- docs/CODEX_BITACORA.md

## Cambios realizados

Se creó la bitácora técnica del proyecto con una estructura numerada y
cronológica. A partir de este cambio, Codex deberá leer completamente este
archivo antes de modificar cualquier archivo y agregar una nueva entrada al
final antes de concluir cada tarea que produzca cambios funcionales o técnicos.

Se establece también que las entradas anteriores son inmutables: no deberán
eliminarse, reemplazarse ni reorganizarse. Las operaciones `git commit`,
`git push` y `clasp push` requerirán siempre una solicitud explícita del usuario.

## Motivo

Conservar el historial técnico, las razones de cada decisión, su impacto, las
pruebas ejecutadas y los asuntos pendientes durante la evolución incremental
del proyecto.

## Impacto

Afecta el flujo de trabajo de todas las modificaciones futuras, sin cambiar la
lógica funcional ni los contratos actuales de los módulos de Apps Script.

## Compatibilidad

No rompe compatibilidad. El cambio incorpora únicamente documentación técnica
y reglas de trazabilidad.

## Pruebas realizadas

- Verificación de la estructura Markdown requerida.
- Verificación de codificación UTF-8 sin BOM.
- Revisión del estado de Git para confirmar el alcance del archivo creado.

## Pendientes

- Registrar al final de esta bitácora cada modificación funcional o técnica
  posterior mediante una nueva numeración correlativa.

# Cambio 0002
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> A partir de ahora guardar todo lo solicitado y las respuestas en el archivo,
> para poder levantar el archivo en otro lugar y continuar con el trabajo.

## Respuesta de Codex

Se adopta `docs/CODEX_BITACORA.md` como registro portátil del trabajo. Cada
entrada futura conservará una representación fiel de la solicitud, los
mensajes técnicos relevantes de progreso y la respuesta final, además de las
secciones técnicas obligatorias. Se excluirán o redactarán claves, tokens,
credenciales, correos, identificadores operativos, datos personales sensibles
y contenido institucional completo.

## Objetivo

Permitir que el historial operativo y técnico pueda trasladarse a otro entorno
y utilizarse para continuar el proyecto sin depender exclusivamente del
historial de la conversación.

## Archivos modificados

- docs/CODEX_BITACORA.md

## Cambios realizados

Se amplió el contrato de la bitácora para registrar en cada cambio futuro:

- la solicitud del usuario;
- la respuesta de Codex;
- los mensajes de progreso que contengan decisiones, incidencias o resultados
  necesarios para continuar el trabajo;
- el objetivo, archivos, detalles técnicos, motivo, impacto, compatibilidad,
  pruebas y pendientes del cambio.

La información se agregará siempre al final mediante una nueva entrada
correlativa. Cuando una solicitud no produzca modificaciones, podrá registrarse
como una entrada de continuidad si aporta una decisión, requisito o contexto
necesario para retomar el proyecto.

Por seguridad, la transcripción no incluirá secretos ni información sensible.
Cuando aparezcan, se sustituirán por una indicación como `[REDACTADO]` y se
conservará únicamente el contexto técnico imprescindible.

## Motivo

El historial conversacional puede no estar disponible en otra computadora o
sesión. La bitácora debe proporcionar contexto suficiente para conocer qué se
solicitó, qué respondió Codex, qué se modificó y cuál es el estado pendiente.

## Impacto

Afecta el procedimiento documental de todas las tareas posteriores. Puede
incrementar el tamaño de la bitácora, pero no modifica la lógica funcional de
Google Apps Script ni los contratos existentes entre módulos.

## Compatibilidad

No rompe compatibilidad. Las entradas anteriores conservan su formato y no se
modifican; las secciones de solicitud y respuesta se incorporan a partir de
este cambio.

## Pruebas realizadas

- Lectura completa de la bitácora antes de modificarla.
- Verificación de numeración correlativa entre `Cambio 0001` y `Cambio 0002`.
- Verificación de que la nueva entrada fue agregada al final.
- Verificación de estructura Markdown y codificación UTF-8 sin BOM.
- Revisión del estado de Git para confirmar que no se modificaron otros
  archivos.

## Pendientes

- Mantener el registro actualizado en todas las tareas futuras.
- Trasladar o versionar la bitácora solo cuando el usuario autorice
  explícitamente las operaciones Git correspondientes.

# Cambio 0003
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> ¿Se sincronizó `docs/CODEX_BITACORA.md`?

## Respuesta de Codex

No. La bitácora se encuentra actualizada únicamente en el repositorio local.
No se ejecutaron `git add`, `git commit`, `git push` ni `clasp push`, porque
estas operaciones requieren una solicitud explícita del usuario.

## Objetivo

Registrar el estado real de sincronización de la bitácora y evitar que se
interprete su creación local como una publicación en GitHub o Apps Script.

## Archivos modificados

- docs/CODEX_BITACORA.md

## Cambios realizados

Se agregó una entrada de continuidad que deja constancia de que la bitácora
todavía no forma parte de un commit y no está disponible en el repositorio
remoto.

## Motivo

Mantener una trazabilidad precisa del estado local y remoto antes de trasladar
el trabajo a otra computadora.

## Impacto

No afecta módulos funcionales. La bitácora seguirá disponible únicamente en
esta copia local hasta que se autorice su versionado y publicación.

## Compatibilidad

No rompe compatibilidad.

## Pruebas realizadas

- Lectura completa de la bitácora antes de agregar esta entrada.
- Verificación de `git status --short`.
- Confirmación de que `docs/` permanece sin seguimiento en Git.

## Pendientes

- Recibir autorización explícita para ejecutar `git add`, `git commit` y
  `git push` de la bitácora.

# Cambio 0004
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> Despliega.

## Respuesta de Codex

Se interpreta la instrucción como autorización explícita para versionar y
publicar `docs/CODEX_BITACORA.md` en `origin/main`. No corresponde ejecutar
`clasp push`, porque la bitácora no pertenece al proyecto Google Apps Script.

## Objetivo

Sincronizar la bitácora técnica con el repositorio remoto para que pueda
recuperarse desde otra computadora y utilizarse como contexto de continuidad.

## Archivos modificados

- docs/CODEX_BITACORA.md

## Cambios realizados

Se registró la autorización de despliegue y se preparó la bitácora completa
para su incorporación selectiva a Git, sin incluir `.clasp.json` ni archivos
adicionales.

## Motivo

La bitácora solo era local y debía publicarse para cumplir el objetivo de
portabilidad entre entornos de trabajo.

## Impacto

La documentación estará disponible en GitHub. No se modifica ningún módulo de
Apps Script ni se altera el proyecto desplegado en Google.

## Compatibilidad

No rompe compatibilidad.

## Pruebas realizadas

- Lectura completa de la bitácora antes de modificarla.
- Verificación de numeración correlativa hasta `Cambio 0004`.
- Verificación de UTF-8 sin BOM.
- Verificación de `git diff --cached --check`.
- Confirmación de staging limitado a `docs/CODEX_BITACORA.md`.
- Verificación posterior de sincronización entre `main` y `origin/main`.

## Pendientes

- Continuar agregando nuevas solicitudes y respuestas al final de la bitácora.

# Cambio 0005
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> `docs/CODEX_BITACORA.md` pertenece al proyecto, sirve como referencia y debe
> mantenerse guardado en Git como respaldo ante una eventual pérdida de la
> máquina de trabajo.

## Respuesta de Codex

Se confirma que la bitácora es documentación oficial del proyecto y debe
incluirse actualizada en cada commit autorizado. Se incorpora esta obligación
en `AGENTS.md` para que permanezca vigente al clonar el repositorio o iniciar
una nueva sesión de Codex. La bitácora se publica en Git, pero no mediante
`clasp push`, porque no es código ejecutable de Google Apps Script.

## Objetivo

Garantizar que el historial técnico y conversacional tenga respaldo remoto y
que cualquier agente futuro conozca automáticamente la obligación de leerlo y
mantenerlo actualizado.

## Archivos modificados

- AGENTS.md
- docs/CODEX_BITACORA.md

## Cambios realizados

Se añadió a `AGENTS.md` la obligación de:

- leer completamente la bitácora antes de modificar archivos;
- agregar una nueva entrada después de cada cambio funcional o técnico;
- conservar solicitudes, respuestas, progreso relevante, pruebas y pendientes;
- redactar secretos y datos sensibles;
- no eliminar ni reorganizar entradas anteriores;
- incluir la bitácora actualizada en cada commit autorizado.

También se registró formalmente que `docs/CODEX_BITACORA.md` forma parte de la
documentación oficial versionada del proyecto y constituye el respaldo para la
continuidad desde otros equipos.

## Motivo

Evitar que la regla dependa únicamente del historial de esta conversación y
asegurar que sea descubierta al abrir o clonar el repositorio en el futuro.

## Impacto

Afecta el procedimiento de trabajo y versionado de todas las tareas futuras.
No cambia la lógica funcional de Apps Script ni las integraciones externas.

## Compatibilidad

No rompe compatibilidad. Agrega reglas documentales y de trazabilidad.

## Pruebas realizadas

- Lectura completa de la bitácora antes de modificar archivos.
- Verificación de numeración correlativa hasta `Cambio 0005`.
- Verificación de la nueva sección operativa en `AGENTS.md`.
- Verificación de UTF-8 sin BOM.
- Verificación de `git diff --cached --check`.
- Confirmación de staging limitado a `AGENTS.md` y
  `docs/CODEX_BITACORA.md`.
- Verificación posterior de sincronización entre `main` y `origin/main`.

## Pendientes

- Aplicar estas reglas en todas las solicitudes posteriores.

# Cambio 0006
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> ¿Por qué se siguen borrando los mensajes de progreso y reemplazándolos por
> el resumen, a pesar de la instrucción expresa de conservarlos?

## Respuesta de Codex

Codex no elimina los mensajes enviados. La interfaz puede colapsar
automáticamente el canal de progreso cuando se entrega la respuesta final, y
ese comportamiento no puede controlarse desde el agente. Para evitar la
pérdida visible de información, cada respuesta final incluirá un `Registro de
progreso` cronológico y conservará además el resumen. Los mismos hitos se
mantendrán en esta bitácora.

## Objetivo

Conservar de forma visible y portátil el progreso completo de cada tarea aunque
la interfaz colapse los mensajes intermedios al cerrar el turno.

## Archivos modificados

- AGENTS.md
- docs/CODEX_BITACORA.md

## Cambios realizados

Se agregó a `AGENTS.md` la obligación de incluir en cada respuesta final una
sección `Registro de progreso` con los avances, incidencias, reintentos y
validaciones relevantes en orden cronológico. El resumen final deberá añadirse
después y no podrá sustituir dicho registro.

Se documentó la limitación de presentación de la interfaz y la estrategia de
conservación mediante respuesta final y bitácora.

## Motivo

Los mensajes intermedios pueden quedar visualmente colapsados, lo que da la
impresión de que fueron eliminados y dificulta auditar cómo se ejecutó la tarea.

## Impacto

Afecta la forma de comunicar y documentar todas las tareas futuras. No modifica
la lógica de Apps Script ni sus contratos.

## Compatibilidad

No rompe compatibilidad.

## Pruebas realizadas

- Lectura completa de la bitácora antes de modificar archivos.
- Verificación de numeración correlativa hasta `Cambio 0006`.
- Verificación de la nueva regla de `Registro de progreso` en `AGENTS.md`.
- Verificación de UTF-8 sin BOM.
- Verificación de `git diff --check`.

## Pendientes

- Aplicar el `Registro de progreso` en todas las respuestas finales futuras.
- Versionar esta entrada cuando el usuario autorice commit y push.

# Cambio 0007
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> Despliega.

## Respuesta de Codex

Se autoriza el versionado y publicación de la regla permanente de conservación
del progreso registrada en `AGENTS.md` y `docs/CODEX_BITACORA.md`. No se
ejecutará `clasp push`, porque no existen cambios en `AppsScript/`.

## Objetivo

Respaldar en Git la obligación de reproducir el progreso cronológico en las
respuestas finales y conservarlo en la bitácora.

## Archivos modificados

- AGENTS.md
- docs/CODEX_BITACORA.md

## Cambios realizados

Se prepararon para publicación la regla `Registro de progreso`, la explicación
de la limitación visual de la interfaz y esta autorización explícita de
despliegue.

## Motivo

Garantizar que la regla se conserve al cambiar de computadora, clonar el
repositorio o iniciar una nueva sesión de Codex.

## Impacto

Afecta únicamente la documentación y el procedimiento de comunicación. No
modifica la lógica de Apps Script.

## Compatibilidad

No rompe compatibilidad.

## Pruebas realizadas

- Lectura completa de la bitácora antes de modificarla.
- Verificación de numeración correlativa hasta `Cambio 0007`.
- Verificación de UTF-8 sin BOM.
- Verificación de `git diff --cached --check`.
- Confirmación de staging limitado a `AGENTS.md` y
  `docs/CODEX_BITACORA.md`.
- Verificación posterior de sincronización entre `main` y `origin/main`.

## Pendientes

- Aplicar la regla en todas las respuestas finales posteriores.

# Cambio 0008
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> Guardar toda la información proporcionada en esta conversación y desplegarla
> para disponer de un respaldo que permita continuar el trabajo en otro lugar.

## Respuesta de Codex

Se consolidó en esta entrada el historial técnico anterior a la creación de la
bitácora, las decisiones funcionales adoptadas, el flujo desplegado, los
incidentes resueltos, las reglas operativas y el estado actual del proyecto.
La información sensible y los identificadores operativos se mantienen
redactados. La bitácora consolidada se versionará y publicará en `origin/main`.

## Objetivo

Crear un punto de continuidad autosuficiente que permita clonar el repositorio
en otra computadora, leer `AGENTS.md` y esta bitácora, comprender lo realizado
y retomar el diseño incremental del acta sin depender del historial del chat.

## Archivos modificados

- docs/CODEX_BITACORA.md

## Cambios realizados

### 1. Identidad y propósito del proyecto

`ActasReunionIA` automatiza la generación de actas institucionales a partir de
notas generadas por Gemini en Google Meet y almacenadas como Google Docs. La
plataforma principal es Google Apps Script. OpenAI estructura el contenido, el
sistema genera un Google Docs, lo exporta a `.docx` y registra el procesamiento
para impedir duplicidades.

El repositorio remoto oficial está en GitHub. Los identificadores del proyecto
Apps Script, carpetas, documentos y hojas se consideran valores operativos y no
se registran en esta bitácora.

### 2. Flujo funcional vigente

El flujo End-to-End coordinado por `Main.gs` es:

1. cargar y validar configuración;
2. obtener documentos fuente elegibles desde Drive;
3. consultar su estado en el repositorio de procesados;
4. leer el contenido del Google Docs fuente;
5. construir el prompt;
6. solicitar una respuesta estructurada a OpenAI;
7. validar la respuesta JSON;
8. resolver los asistentes contra el catálogo de personas;
9. reservar el correlativo;
10. registrar el inicio de procesamiento;
11. generar y formatear el acta en Google Docs;
12. exportar y verificar el archivo Word;
13. marcar el procesamiento como completado o registrar el fallo controlado.

Los documentos se procesan secuencialmente. Un error individual no detiene los
candidatos siguientes. Los estados `PROCESADO` se omiten; no existen reintentos
automáticos de estados `ERROR` o `EN_PROCESO`.

### 3. Arquitectura y módulos

- `Main.gs`: único orquestador público mediante
  `ejecutarGeneracionActas(parametros)`.
- `Config.gs`: lee Script Properties mediante `obtenerConfiguracion()`.
- `Drive.gs`: lista fuentes, obtiene candidatos y lee Google Docs sin aplicar
  reglas de formato del acta.
- `Procesados.gs`: administra `PENDIENTE`, `EN_PROCESO`, `PROCESADO` y `ERROR`
  en una hoja de cálculo dedicada.
- `Correlativo.gs`: reserva correlativos persistentes con Script Properties y
  `LockService`.
- `Prompt.gs`: construye los mensajes enviados al modelo.
- `OpenAI.gs`: encapsula la solicitud HTTP y Structured Outputs.
- `ValidadorRespuesta.gs`: valida y normaliza la respuesta sin corregirla.
- `Personas.gs`: resuelve nombres documentales, cargos y unidades desde la hoja
  `persona` y registra personas nuevas.
- `Acta.gs`: genera y formatea el Google Docs institucional.
- `Word.gs`: exporta y verifica `.docx`.
- `Logger.gs`: registra eventos seguros mediante `Logger.log()`.
- `Utils.gs`: validaciones transversales puras.
- `Gemini.gs`: permanece reservado para criterios funcionales de Gemini; no
  concentra acceso a Drive, prompts, OpenAI ni validación.

Se eliminó definitivamente del diseño el módulo intermedio
`GenracionActas.gs`; `Acta.gs` recibe directamente la respuesta validada, los
datos de emisión y los participantes resueltos.

### 4. Contratos públicos actuales

- `ejecutarGeneracionActas(parametros)`.
- `obtenerConfiguracion()`.
- `listarArchivosEnCarpeta(carpetaId, contexto)`.
- `obtenerDocumentosFuente(carpetaId, contexto)`.
- `leerContenidoDocumentoFuente(idDocumentoFuente, contexto)`.
- `consultarEstadoProcesamiento(...)`.
- `registrarInicioProcesamiento(...)`.
- `marcarProcesamientoCompletado(...)`.
- `marcarProcesamientoConError(...)`.
- `reservarSiguienteCorrelativo(contexto)`.
- `construirPromptActa(contenidoFuente, contexto)`.
- `solicitarActaEstructurada(mensajes, contexto)`.
- `validarRespuestaActa(respuestaTexto, contexto)`.
- `resolverParticipantesActa(repositorioId, participantes, contexto)`.
- `generarDocumentoActa(respuesta, datosEmision, participantes, contexto)`.
- `exportarDocumentoWord(idDocumentoGoogle, datosExportacion, contexto)`.
- `registrarInfo`, `registrarAdvertencia` y `registrarError`.
- `esCadenaNoVacia`, `esObjetoPlano`, `esNumeroFinito`, `esBooleano` y
  `esFechaValida`.

### 5. Configuración vigente

Las Script Properties conocidas son:

- `CARPETA_NOTAS_GEMINI_ID`;
- `PLANTILLA_ACTA_ID`, que identifica el documento de plantilla;
- `CARPETA_OTRO`, que identifica la carpeta donde se busca `LogoMEF.jpg`;
- `CARPETA_RAIZ_ACTAS_ID`;
- `REPOSITORIO_PROCESADOS_ID`;
- `OPENAI_API_KEY`;
- `OPENAI_MODELO`, opcional en `Config.gs`;
- `PROMPT_VERSION`.

Los valores reales nunca deben incorporarse al repositorio ni a Logger. La
clave de OpenAI solo puede existir en Script Properties y en memoria durante la
ejecución autorizada.

El manifiesto usa:

- zona horaria `America/Lima`;
- runtime V8;
- `exceptionLogging: STACKDRIVER`;
- sin servicios avanzados ni scopes declarados manualmente en esta fase.

### 6. OpenAI y validación

La integración usa el modelo `gpt-5-mini-2025-08-07`,
`reasoning_effort: minimal` y `max_completion_tokens: 2500`. No se realizan
llamadas reales salvo autorización o ejecución manual del usuario.

El prompt exige que `titulo`, `fechaReunion` y `resumenEjecutivo` sean cadenas
no vacías. Si la fecha no se identifica, el modelo debe devolver
`NO IDENTIFICADA`, nunca cadena vacía ni `null`.

La respuesta validada mantiene, entre otros, `participantes`, `agenda`,
`resumenEjecutivo`, `acuerdos`, `tareas` y `observaciones`. El validador no se
modificó para corregir respuestas inválidas: el prompt debe producir el
contrato correcto.

### 7. Persistencia e idempotencia

El correlativo se persiste en Script Properties con la clave interna
`ACTAS_ULTIMO_CORRELATIVO`. Se reserva bajo `ScriptLock`, se verifica después
de escribir y no se reutiliza aunque falle una etapa posterior. Se permiten
huecos y no existe rollback.

El control de procesados usa el Spreadsheet identificado por
`REPOSITORIO_PROCESADOS_ID` y la hoja `Procesados`. Su esquema aprobado contiene
versión, documento fuente, estado, correlativo, ejecución, fechas, IDs de
artefactos y código de error. Los IDs no se devuelven en resultados públicos ni
se registran en Logger.

### 8. Catálogo de personas y asistentes

El mismo Spreadsheet contiene una hoja llamada exactamente `persona`, con los
encabezados, en orden:

1. `Nombre Participante`;
2. `Nombre Documento`;
3. `Cargo`;
4. `Unidad`.

La búsqueda ignora mayúsculas, minúsculas y espacios externos. Cuando existe
una coincidencia, el acta usa `Nombre Documento`, `Cargo` y `Unidad`; si
`Nombre Documento` está vacío, conserva el nombre original.

Cuando una persona confirmada no existe, se agrega una fila con el nombre
original, nombre documental vacío, cargo vacío y Unidad `UCP`. En el acta se
muestra el nombre original, cargo vacío y `UCP`.

El criterio definitivo de asistencia es el registro de nombre asociado a un
correo visible en las notas. El correo es solo evidencia de ingreso y nunca se
guarda ni se muestra. Se incluyen organizadores, anfitriones, convocantes y
asistentes silenciosos con correo, aunque no hayan intervenido. Se excluyen
nombres mencionados sin correo. Cada asistente debe aparecer una sola vez.

Filas incorrectas creadas por ejecuciones anteriores, como personas mencionadas
sin haber asistido, deben revisarse y eliminarse manualmente; el sistema no
realiza eliminaciones automáticas del catálogo.

### 9. Diseño visual incremental del acta

El diseño se dividió en ocho etapas:

1. cabecera;
2. datos de reunión;
3. asistentes;
4. agenda;
5. siglas y acrónimos;
6. temas tratados;
7. acuerdos;
8. próxima reunión.

Las etapas 1 y 2 fueron validadas visualmente por el usuario. La etapa 3 está
implementada y desplegada; continúa su validación mediante ejecuciones reales.
Las etapas 4 a 8 permanecen pendientes.

#### Etapa 1: cabecera

- título `Acta de Reunión`;
- código `FR 37`;
- versión `1`;
- metodología y proyecto institucionales como constantes;
- director del proyecto como constante;
- fecha del acta en formato con puntos;
- logotipo `LogoMEF.jpg` buscado en `CARPETA_OTRO`;
- si el logotipo falta, se registra una advertencia y el acta continúa;
- se eliminaron filas y espacios vacíos alrededor de la tabla anidada.

#### Etapa 2: reunión

La tabla contiene:

- `Reunión`: `{correlativo}-{año}-CEL002`;
- `Fecha`: fecha del acta en formato `DD.MM.AAAA`;
- `Hora`: valor fijo `09:00 am a 09:20 am`.

Las etiquetas usan fondo plomo `#d9d9d9`; los valores se presentan en cursiva.

#### Etapa 3: asistentes

La tabla usa una celda lateral ploma `Asistentes` y una tabla anidada con:

- `Nombres y apellidos`;
- `Cargo`;
- `Unidad`.

Los encabezados usan fondo plomo. Los datos proceden de `Personas.gs`, no de
constantes ni directamente del contenido narrativo.

### 10. Incidentes y correcciones relevantes

- `VALIDADOR_CONTRATO_INVALIDO`: OpenAI devolvía `fechaReunion` vacía. Se
  corrigió `Prompt.gs` para exigir textos obligatorios no vacíos.
- Modelo incorrecto en Apps Script: se sincronizó y configuró
  `gpt-5-mini-2025-08-07` con los parámetros autorizados.
- `ACTA_CARPETA_NO_ACCESIBLE`: se diagnosticó la propiedad de carpeta de
  destino y se separó el documento de plantilla de la carpeta de recursos.
- Logotipo no encontrado: se creó `CARPETA_OTRO` y se mantuvo el flujo tolerante
  a ausencia de imagen.
- Fila vacía bajo Director de Proyecto: se eliminó.
- Espacios vacíos alrededor de la cabecera anidada: se compactaron párrafos y
  paddings.
- Error de escritura de Etapa 2: se invocaba un helper inexistente
  `_actaAplicarEstiloTexto`; se sustituyó por llamadas válidas sobre `Text`.
- Hoja de personas no disponible: se confirmó que la pestaña debía llamarse
  exactamente `persona`.
- Personas mencionadas tratadas como asistentes: se reforzó el prompt primero
  con evidencia explícita y después con el criterio obligatorio de correo.
- Anfitriones o asistentes silenciosos omitidos: se indicó que nombre y correo
  bastan, aunque no existan intervenciones.

### 11. Seguridad y Logger

`Logger.gs` usa exclusivamente `Logger.log()` y los niveles `INFO`, `WARN` y
`ERROR`. Sus funciones públicas devuelven booleanos y nunca propagan
excepciones. Los registros se sanitizan y no incluyen:

- claves, tokens, autorizaciones ni cookies;
- configuración completa o Script Properties;
- prompts o respuestas completas;
- notas o contenido documental;
- IDs, rutas o URLs de Drive;
- correos, nombres, teléfonos u otros datos personales sensibles;
- stacks completos.

`Main.gs` genera y administra `idEjecucion`; Logger solo lo recibe. Los fallos
de auditoría nunca cambian el resultado funcional.

### 12. Git, clasp y despliegue

El repositorio conserva una etiqueta anotada `v0.1.0-e2e` correspondiente a la
base End-to-End aprobada. La secuencia histórica de commits verificable es:

- `9d1a5e4` — archivo inicial;
- `05a4601` — arquitectura inicial;
- `90be9e1` — lineamientos `AGENTS.md`;
- `8aca4f3` — estructura base;
- `fb6c452` — base Apps Script, Config y Logger;
- `636d999` — flujo E2E;
- `dd8af70` — campos obligatorios del prompt;
- `4235ecf` y `18beab8` — sincronizaciones remotas;
- `965ca60` — modelo OpenAI autorizado;
- `83aabbd` — cabecera institucional;
- `7caa187` — eliminación de fila vacía;
- `0f90196` — carpeta de recursos y cabecera compacta;
- `d1ff9cf` — datos de reunión;
- `c70f2fb` — corrección de estilos;
- `4dda58c` — catálogo de asistentes;
- `b461270`, `ae1a8e3` y `4f3b5e7` — reglas de selección de asistentes;
- `084d74a`, `96f3bda` y `ae7f77d` — bitácora y progreso visible.

La palabra `despliega` autoriza el ciclo de versionado y publicación. Para
código Apps Script incluye commit, push y sincronización mediante `clasp`. Para
cambios exclusivamente documentales incluye commit y push, sin `clasp push`.

`.clasp.json` es local, permanece sin seguimiento y contiene la vinculación al
proyecto remoto. Nunca debe agregarse a Git.

`Inicializar.js` existe únicamente en Apps Script y debe conservarse siempre.
El despliegue seguro consiste en clonar el proyecto remoto a una carpeta
temporal, verificar y conservar `Inicializar.js`, superponer solo los archivos
autorizados, ejecutar `clasp push --force` y realizar una clonación nueva para
comparar hashes. `Inicializar.js` nunca debe incorporarse al repositorio Git.

### 13. Estado actual para continuidad

- Rama: `main` sincronizada con `origin/main` antes de este cambio.
- Último commit anterior: `ae7f77d`.
- Archivo local no versionado deliberadamente: `.clasp.json`.
- Apps Script contiene 16 archivos, incluido `Inicializar.js` y `Personas.js`.
- Etapa 1: finalizada.
- Etapa 2: finalizada.
- Etapa 3: implementada y desplegada; pendiente de confirmación visual final.
- Etapas 4 a 8: pendientes.
- Próximo paso funcional previsto: confirmar la lista final de asistentes o
  comenzar la Etapa 4, Agenda, según instrucción del usuario.
- La bitácora debe leerse completa antes de cualquier modificación y debe
  actualizarse antes de concluir cada tarea.
- Cada respuesta final debe contener `Registro de progreso` y un resumen
  adicional.

### 14. Reglas de continuidad desde otra computadora

1. clonar o actualizar el repositorio desde `origin/main`;
2. leer `AGENTS.md` completo;
3. leer `docs/CODEX_BITACORA.md` completo;
4. verificar `git status` y no sobrescribir cambios locales;
5. recrear `.clasp.json` localmente sin versionarlo;
6. autenticar `clasp` con la cuenta autorizada;
7. conservar siempre el `Inicializar.js` remoto;
8. no usar `git add .`, y preparar únicamente archivos autorizados;
9. no ejecutar commit, push o `clasp push` sin autorización explícita;
10. registrar cada solicitud, respuesta y cambio al final de esta bitácora.

## Motivo

El historial completo del chat no está garantizado al cambiar de equipo. Sin
esta consolidación podrían perderse decisiones arquitectónicas, reglas de
negocio, procedimientos de despliegue y el estado real de las etapas visuales.

## Impacto

La bitácora crece de forma significativa y pasa a contener una reconstrucción
operativa del proyecto. No se modifica código, configuración ni Apps Script.

## Compatibilidad

No rompe compatibilidad. Es un cambio documental y de continuidad.

## Pruebas realizadas

- Lectura completa de la bitácora antes de modificarla.
- Revisión del historial Git completo y de la etiqueta existente.
- Revisión de la estructura actual del repositorio y de Apps Script.
- Inventario de APIs públicas vigentes.
- Inventario de nombres de Script Properties sin leer sus valores.
- Verificación del manifiesto V8 y de la configuración técnica de OpenAI.
- Verificación de que no se incluyeron secretos ni IDs operativos.
- Verificación de numeración correlativa hasta `Cambio 0008`.
- Verificación de UTF-8 sin BOM.
- Verificación de `git diff --cached --check`.
- Confirmación de staging limitado a `docs/CODEX_BITACORA.md`.
- Verificación posterior de sincronización entre `main` y `origin/main`.

## Pendientes

- Confirmar visualmente el resultado definitivo de la Etapa 3.
- Continuar con las Etapas 4 a 8.
- Mantener esta bitácora actualizada y respaldada en cada commit autorizado.

# Cambio 0009
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> Al revisar CODEX_BITACORA.md, se detectó que solo estaba documentado el
> estado más reciente y no toda la información proporcionada en la conversación.

## Respuesta de Codex

Se confirmó la observación. Cambio 0008 contiene una reconstrucción técnica
extensa, pero no conserva todas las solicitudes y respuestas anteriores en
orden cronológico. Esta entrada agrega el inventario histórico recuperable.
No se incluyen secretos, credenciales, correos ni IDs operativos.

## Objetivo

Completar la bitácora como registro portátil incorporando la secuencia de
solicitudes, decisiones, implementaciones, validaciones, despliegues e
incidencias ocurridas antes de establecer la bitácora obligatoria.

## Archivos modificados

- docs/CODEX_BITACORA.md

## Cambios realizados

### Historial cronológico recuperado

#### 1. Repositorio y arquitectura inicial

- Se clonó ActasReunionIA, se verificó la rama y se configuró la identidad Git.
- Se ordenó trabajar únicamente en el repositorio, sin repositorios anidados,
  credenciales, push no autorizado ni cambios ajenos a cada fase.
- Se diseñaron y versionaron Arquitectura, Flujo de Procesamiento, Decisiones
  Arquitectónicas, Riesgos Técnicos y Estructura del Proyecto.
- Se creó AGENTS.md, previa propuesta y aprobación, con reglas de desarrollo,
  Git, Google Apps Script, documentación, arquitectura física y versionado.
- Se crearon las carpetas base faltantes y solo archivos .gitkeep vacíos.

#### 2. Arquitectura modular de Apps Script

- Se definieron Main, Config, Drive, Gemini, Procesados, Correlativo, Prompt,
  OpenAI, ValidadorRespuesta, Acta, Word, Logger y Utils.
- Main controla y orquesta el flujo sin reglas de negocio ni acceso directo a
  servicios. ValidadorRespuesta solo valida e informa; Acta genera el documento.
- Se crearon inicialmente solo encabezados documentales.
- AppsScript se confirmó como raíz del proyecto y se creó appsscript.json con
  America/Lima, V8 y STACKDRIVER.

#### 3. Config, Logger y Utils

- Config.gs se implementó con obtenerConfiguracion y Script Properties.
- La zona horaria quedó solo en el manifiesto; reglas de nombres y carpetas
  mensuales no se trataron como configuración.
- OPENAI_API_KEY puede leerse en memoria, pero nunca registrarse o serializarse.
- OPENAI_MODELO quedó opcional. Se usaron const, let y objetos inmutables.
- Logger.gs se implementó con INFO, WARN y ERROR mediante Logger.log.
- Sus tres APIs públicas devuelven booleanos, no propagan errores y sanitizan
  secretos, IDs, contenido, prompts, respuestas y datos personales.
- Utils.gs quedó limitado a cinco validadores puros: cadena no vacía, objeto
  plano, número finito, booleano y fecha válida.

#### 4. Drive, Correlativo y Procesados

- Drive.gs se diseñó con resultados estructurados, códigos DRIVE_ y sin exponer
  objetos nativos, iteradores, IDs ni metadatos sensibles.
- Correlativo.gs reserva de forma atómica en Script Properties bajo ScriptLock.
  La reserva es definitiva, admite huecos y no tiene rollback.
- Para Procesados se compararon Script Properties, Spreadsheet y alternativas
  ligeras; se aprobó una hoja dedicada como fuente de verdad.
- Procesados.gs implementó consulta, reclamación, finalización y error con
  idempotencia, validación de esquema, bloqueo, relectura y verificación.

#### 5. Main, fuentes, Acta y flujo E2E

- Las fases 2.10, 2.11 y 2.12, la integración E2E, la auditoría, el cierre
  documental y la preparación Git llegaron mediante solicitudes extensas,
  algunas adjuntas como archivos de texto.
- Se rechazó una vertical que trasladaba a Gemini responsabilidades de Drive,
  Prompt, OpenAI y validación. El usuario ordenó mantener la arquitectura.
- GenracionActas.gs fue eliminado definitivamente del plan al no justificar una
  transformación independiente. Acta consume la respuesta validada.
- Se implementó, auditó y documentó el flujo E2E.
- Se creó el commit base E2E y la etiqueta anotada v0.1.0-e2e; después se
  publicaron rama y etiquetas.

#### 6. Primera prueba real, OpenAI y sincronización

- El usuario confirmó que no había API key compartida en la conversación.
- Se revisó un DOCX producido por el sistema como referencia de salida.
- Se corrigió Prompt.gs porque fechaReunion vacía causaba
  VALIDADOR_CONTRATO_INVALIDO. La ausencia debe producir NO IDENTIFICADA.
- ValidadorRespuesta.gs y su contrato se mantuvieron intactos.
- Se configuró gpt-5-mini-2025-08-07, reasoning minimal y 2500 tokens máximos.
- Se verificaron .clasp.json, la raíz AppsScript y el manifiesto.
- Se estableció sincronizar primero desde Apps Script, preservar siempre
  Inicializar.js, incorporar cambios autorizados y desplegar de forma segura.

#### 7. Diagnósticos y diseño visual

- Se diagnosticó ACTA_CARPETA_NO_ACCESIBLE y se revisó la propiedad de carpeta
  sin exponer su ID.
- El acta se dividió en ocho etapas: cabecera, datos de reunión, asistentes,
  agenda, siglas y acrónimos, temas tratados, acuerdos y próxima reunión.

#### 8. Etapa 1: cabecera

- Se tomó como modelo visual un acta institucional suministrada por el usuario.
- Título, código, versión, metodología y proyecto quedaron fijos; el director
  quedó como variable técnica.
- PLANTILLA_ACTA_ID identifica un documento, no la carpeta del logo.
- CARPETA_OTRO identifica la carpeta donde se busca LogoMEF.jpg.
- Si falta el logo, se registra WARN y el flujo continúa.
- Se eliminaron una fila vacía y espacios excesivos.
- El usuario declaró finalizada la Etapa 1.

#### 9. Etapa 2: datos de reunión

- Reunión usa correlativo-año-CEL002.
- La fecha corresponde al acta y la hora fija es 09:00 am a 09:20 am.
- Las etiquetas usan fondo plomo.
- Un error de escritura se corrigió reemplazando un helper de estilo inexistente.
- El usuario aprobó el resultado y cerró la Etapa 2.

#### 10. Etapa 3: asistentes

- La tabla usa la celda lateral Asistentes y las columnas Nombres y apellidos,
  Cargo y Unidad.
- El catálogo está en la hoja persona del repositorio de procesados, con
  Nombre Participante, Nombre Documento, Cargo y Unidad.
- Si no existe una persona, se muestra el nombre original, cargo vacío y UCP,
  y se agrega una fila para completar después.
- Una ejecución falló porque la hoja persona no estaba disponible; el usuario
  corrigió su disponibilidad.
- Se excluyeron nombres meramente mencionados. Nombre y correo en las notas son
  evidencia de asistencia; el correo nunca se guarda, muestra ni registra.
- Se incluyen organizadores y asistentes silenciosos con correo aunque no
  intervengan. La validación visual final de esta etapa sigue pendiente.

#### 11. Bitácora y progreso visible

- El usuario exigió una bitácora acumulativa, versionada y apta para continuar
  desde otra computadora.
- Luego exigió conservar solicitudes, respuestas y mensajes de progreso.
- AGENTS.md se actualizó para hacer obligatorias estas reglas.
- Como la interfaz puede colapsar progreso, cada respuesta final debe repetir
  un Registro de progreso cronológico y añadir después un resumen.
- Cambio 0008 consolidó el estado técnico, pero resultó demasiado resumido.
  Cambio 0009 agrega la cronología que faltaba.

### Limitación de recuperación histórica

La cronología se reconstruye desde la conversación disponible, Git, código y
documentación. El texto literal completo de respuestas antiguas o solicitudes
entregadas solo como adjuntos ya no está íntegramente disponible. No se inventa:
se registra su propósito y resultado comprobable. En adelante cada solicitud y
respuesta debe guardarse en el mismo turno.

## Motivo

El resumen técnico anterior permite retomar el desarrollo, pero no satisfacía
plenamente la instrucción de conservar la historia de solicitudes y respuestas.

## Impacto

Solo mejora documentación y continuidad. No cambia Apps Script ni configuración.

## Compatibilidad

No rompe compatibilidad y no elimina ni modifica entradas anteriores.

## Pruebas realizadas

- Lectura completa de la bitácora antes de modificarla.
- Confirmación de ocho entradas y 822 líneas previas.
- Comparación con el historial conversacional disponible.
- Verificación de incorporación al final.
- Verificación de UTF-8 sin BOM, ausencia de secretos y git diff --check.

## Pendientes

- Validar con el usuario si esta granularidad satisface el respaldo requerido.
- No versionar ni publicar hasta recibir autorización explícita.
- Registrar cada nueva solicitud y respuesta en el mismo turno.

# Cambio 0010
Fecha: 2026-07-31
Autor: Codex

## Solicitud del usuario

> Continuar la Etapa 3 con una función aislada que permita comprobar los
> participantes antes de modificar el flujo. La primera prueba devolvió tres
> participantes cuando se esperaban cuatro. Tras compartir una transcripción
> de referencia, el usuario autorizó ajustar el criterio y desplegarlo.

## Respuesta de Codex

Se desplegó `probarExtraccionParticipantes()` como diagnóstico sin efectos
persistentes. La revisión controlada de la transcripción confirmó cuatro
etiquetas de hablante y evidenció que el criterio obligatorio de correo podía
omitir a un asistente que sí intervino.

Se modificó `Prompt.gs` para construir participantes como la unión deduplicada
de dos evidencias: nombre con correo visible en listas de asistencia o etiqueta
`Nombre: intervención` en la transcripción. Las menciones narrativas continúan
excluidas. El ajuste fue desplegado y verificado en Apps Script.

## Registro de progreso

1. Se creó la función aislada y se desplegó preservando `Inicializar.js`.
2. El usuario ejecutó la prueba; OpenAI respondió HTTP 200 y el validador
   confirmó tres participantes.
3. Se analizó una copia temporal del documento aportado, redactando correos y
   evitando conservar el contenido completo.
4. La transcripción mostró cuatro hablantes y confirmó la causa probable.
5. La copia temporal del documento fue eliminada.
6. Varios intentos de edición fallaron por el helper aislado de Windows en la
   unidad sincronizada `H:`.
7. Se mantuvo la ruta solicitada y se invocó directamente el editor oficial
   `apply_patch`, que actualizó los archivos sin sobrescrituras directas.
8. Se documentó la regla como DA-014.
9. Se descargó el proyecto remoto, se conservó `Inicializar.js`, se superpuso
   únicamente `Prompt.gs` y se publicaron 17 archivos con `clasp`.
10. Una descarga independiente confirmó 17 archivos, la prueba diagnóstica,
    `Inicializar.js` y la coincidencia SHA-256 de `Prompt.gs`.

## Objetivo

Incluir hablantes confirmados por la transcripción sin perder asistentes
silenciosos acreditados por una lista de acceso con correo.

## Archivos modificados

- AppsScript/Prompt.gs
- AppsScript/PruebaParticipantes.gs
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se añadió `probarExtraccionParticipantes()` sin generación documental,
  correlativos, estados ni escritura en la hoja `persona`.
- Se reemplazó el requisito exclusivo de correo por correo o intervención
  etiquetada en la transcripción.
- Se mantuvo la exclusión de responsables, destinatarios, terceros citados y
  nombres meramente mencionados.
- Se registró DA-014 como decisión aceptada.

## Motivo

La evidencia de asistencia no siempre está concentrada en una lista con
correos. La transcripción identifica de forma directa a quienes intervinieron.

## Impacto

OpenAI podrá devolver personas que hablen aunque no tengan correo visible. Los
asistentes silenciosos seguirán entrando por la lista de acceso. La ejecución
manual de la prueba realiza una llamada real a OpenAI.

## Compatibilidad

No cambia el esquema JSON ni las APIs públicas del flujo. Amplía el criterio
funcional de selección de participantes.

## Pruebas realizadas

- Ejecución manual inicial del usuario con respuesta HTTP 200.
- Revisión estructural del DOCX aportado y detección de cuatro hablantes.
- Revisión del prompt modificado.
- `clasp push --force` desde copia temporal con 17 archivos.
- Descarga independiente posterior y coincidencia SHA-256 de `Prompt.gs`.
- Confirmación de `Inicializar.js` y `PruebaParticipantes.js` remotos.
- No se ejecutó OpenAI después del ajuste desde este entorno.

## Pendientes

- Ejecutar nuevamente `probarExtraccionParticipantes()`.

# Cambio 0022
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Implementar la Fase 5 con 11 siglas y acrónimos fijos y reproducir el formato
> mostrado: celda lateral ploma, numeración y contenido sin bordes internos.

## Respuesta de Codex

Se agregó la sección fija `Siglas y Acrónimos` inmediatamente después de
Agenda. El catálogo conserva el orden y el texto proporcionados por el usuario.

## Registro de progreso

1. Se leyó completamente la bitácora y la documentación obligatoria.
2. Se revisó el orden actual de secciones en `Acta.gs`.
3. Se incorporó un catálogo constante con los 11 elementos autorizados.
4. Se creó una tabla exterior con etiqueta ploma y borde institucional.
5. Se creó una tabla interior sin bordes, con columnas separadas para número y
   descripción.
6. Se aplicaron anchos 28 y 294, Arial 9 y alineación vertical superior.
7. Se añadió una prueba automatizada que verifica cantidad, orden, extremos del
   catálogo y formato.
8. La prueba de Siglas, la prueba de Agenda y las seis regresiones de
   participantes finalizaron correctamente.
9. La validación sintáctica de Acta y `git diff --check` no mostraron errores.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaSiglas.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Los 11 elementos existen en el orden autorizado.
- Numeración del 1 al 11.
- Verificación de AFSP y SNPMGI.
- Fondo plomo y anchos de la tabla exterior.
- Tabla interior sin bordes.
- Fuente, tamaño y alineación.
- Regresiones de Agenda y Participantes.
- Validación sintáctica de Acta.
- `git diff --check`.

## Pendientes

- Confirmar visualmente la Fase 5 en un documento generado.

## Despliegue y verificación

1. El usuario autorizó crear y desplegar la Fase 5.
2. Se desplegaron los 17 archivos desde una copia temporal que preservó el
   proyecto remoto completo.
3. Una descarga independiente confirmó la coincidencia SHA-256 de `Acta.gs`.
4. Se confirmó la permanencia de los 17 archivos y de `Inicializar.js`.

# Cambio 0021
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Cerrar la Fase 3 e implementar la Fase 4 con la agenda fija
> `Dayli – reunión de seguimiento`, manteniendo el color mostrado, y
> desplegar el cambio.

## Respuesta de Codex

Se reemplazó la sección de lista numerada por una fila institucional de dos
columnas. La etiqueta `Agenda` conserva el fondo plomo y el valor usa el texto
fijo autorizado.

## Registro de progreso

1. Se leyó completamente la bitácora y la documentación obligatoria.
2. Se revisó el generador actual y se comprobó que Agenda aún era una lista
   numerada procedente de OpenAI.
3. Se confirmó la regla fija para todas las actas de este proyecto.
4. Se añadió la constante `Dayli – reunión de seguimiento`.
5. Se implementó una tabla de una fila con anchos 103 y 322, borde 0.75,
   tipografía Arial 10 y fondo `#d9d9d9` en la etiqueta.
6. Se creó una prueba automatizada específica para contenido y formato.
7. La prueba de Agenda y las seis regresiones de participantes finalizaron
   correctamente.
8. La validación sintáctica de Acta y `git diff --check` no mostraron errores.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaAgenda.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Valor exacto de Agenda.
- Fondo plomo de la etiqueta.
- Bordes, anchos, fuente, tamaño y negrita.
- Seis regresiones de participantes.
- Validación sintáctica de Acta.
- `git diff --check`.

## Pendientes

- Confirmar visualmente la Fase 4 en un documento generado.

## Despliegue y verificación

1. Se desplegaron los 17 archivos desde una copia temporal que preservó el
   proyecto remoto completo.
2. Una descarga independiente confirmó la coincidencia SHA-256 de `Acta.gs`.
3. Se confirmó la permanencia de los 17 archivos y de `Inicializar.js`.

# Cambio 0020
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Usar los nombres que aparecen después del título de la transcripción y de la
> primera marca de tiempo, porque los últimos cuatro eran correctos y los cinco
> anteriores correspondían a encabezados del resumen.

## Respuesta de Codex

Se adoptó el límite documental indicado: el extractor localiza una línea de
título terminada en `Transcripción`, busca la primera marca de tiempo posterior
y analiza únicamente las líneas siguientes. Así, los encabezados temáticos del
resumen quedan excluidos aunque contengan dos puntos.

## Registro de progreso

1. Se leyó completamente la documentación obligatoria y la bitácora.
2. Se confirmó que los nueve resultados contenían cinco encabezados temáticos
   seguidos por cuatro hablantes reales.
3. Se implementó la función que delimita el bloque conversacional mediante
   título y primera marca de tiempo.
4. La clasificación estructural y la extracción usan ahora el mismo bloque.
5. Se mantuvo compatibilidad con transcripciones simples sin ambas marcas.
6. Se agregó una regresión con cinco encabezados antes de la transcripción.
7. La batería automatizada finalizó con seis casos correctos.
8. Se concatenaron localmente los dos DOCX reales, reproduciendo la lectura de
   pestañas de Apps Script.
9. La prueba real combinada devolvió exactamente cuatro participantes y ningún
   encabezado del resumen.
10. La validación sintáctica de Gemini y `git diff --check` finalizaron
    correctamente.
11. Se constató que entradas anteriores 0018 y 0019 estaban ubicadas antes de
    0017; no se reorganizaron para respetar la prohibición de alterar entradas
    históricas y este cambio se añadió al final real del archivo.

## Archivos modificados

- AppsScript/Gemini.gs
- Pruebas/Participantes.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Resultado real verificado

- Cantidad: 4.
- Miguel O.
- Marisol Lozano Pulla.
- Miguel Arroyo Leandro.
- Claudio Alvarez.

## Pruebas realizadas

- Resumen sintético con cinco encabezados antes de la transcripción.
- Seis casos automatizados correctos.
- Resumen y transcripción reales concatenados: cuatro participantes.
- Validación sintáctica de Gemini.
- `git diff --check`.

## Pendientes

- Ejecutar nuevamente `probarExtraccionParticipantes()` para confirmar el
  resultado operativo.

## Despliegue y verificación

1. Se desplegaron los 17 archivos desde una copia temporal que preservó el
   proyecto remoto completo.
2. Una descarga independiente confirmó la coincidencia SHA-256 de `Gemini.gs`.
3. Se confirmó la permanencia de los 17 archivos y de `Inicializar.js`.

# Cambio 0018
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> Obtener una solución definitiva y realizar todas las pruebas necesarias sin
> depender de ejecuciones manuales repetidas para descubrir cada error.

## Respuesta de Codex

Se auditó el flujo con el DOCX real compartido y se identificó la causa raíz:
el selector mezclaba documentos de reuniones distintas contenidos en la misma
carpeta. El documento fuente real ya contenía la transcripción completa y cuatro
hablantes, pero podía competir con otras transcripciones. Se aisló cada ejecución
al documento fuente actual y a sus vínculos, y se añadió soporte para todas las
pestañas de Google Docs.

## Registro de progreso

1. Se leyó completamente la documentación obligatoria y la bitácora.
2. Se revisaron íntegramente los módulos Drive, Gemini, Main y la prueba.
3. Se analizó localmente el DOCX real sin incorporarlo al repositorio.
4. El documento real contenía estructura de transcripción y cuatro hablantes.
5. Se confirmó que Rosita y Janet solo aparecían mencionadas dentro de
   intervenciones y no como etiquetas de hablante.
6. Se identificó que leer todos los Google Docs de la carpeta mezclaba reuniones
   distintas y podía producir una selección ambigua o incorrecta.
7. Se modificó el alcance para utilizar solo el documento fuente actual y sus
   Google Docs vinculados.
8. Se priorizó el documento fuente cuando él mismo contiene la transcripción.
9. Se intentó ejecutar la prueba con `clasp run`; Apps Script informó que el
   proyecto no está desplegado como ejecutable de API, por lo que esa vía remota
   no está disponible.
10. Se creó una prueba automatizada con escenarios sintéticos y sin información
    institucional.
11. La primera prueba de pestañas comparó arreglos de contextos distintos de
    Node.js y falló pese a valores idénticos; se corrigió el arnés.
12. La batería automatizada finalizó con cuatro casos correctos.
13. El extractor se ejecutó localmente contra el DOCX real y devolvió exactamente
    cuatro participantes, excluyendo a las personas solo mencionadas.
14. La documentación oficial confirmó que `Document.getBody()` solo cubre la
    primera pestaña; se migró la lectura a `getTabs()` con recorrido recursivo.
15. Las validaciones sintácticas de los cuatro módulos y `git diff --check`
    finalizaron correctamente.
16. Se desplegaron los 17 archivos de Apps Script desde una copia temporal que
    preservó todos los módulos remotos.
17. Una descarga independiente confirmó la coincidencia SHA-256 de Drive,
    Gemini, Main y PruebaParticipantes.
18. Se confirmó la permanencia de los 17 archivos y de `Inicializar.js`.

## Objetivo

Obtener participantes por reunión de forma determinista, sin contaminación por
otros documentos de la carpeta y con compatibilidad para Google Docs con
pestañas.

## Archivos modificados

- AppsScript/Drive.gs
- AppsScript/Gemini.gs
- AppsScript/Main.gs
- AppsScript/PruebaParticipantes.gs
- Pruebas/Participantes.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Documento fuente que compite con una transcripción de otra reunión.
- Notas temáticas con una única transcripción vinculada.
- Cuatro hablantes y exclusión de una persona solo mencionada.
- Recorrido de pestaña principal y pestaña anidada.
- Ejecución local contra el DOCX real: cuatro participantes.
- Validación sintáctica de Drive, Gemini, Main y PruebaParticipantes.
- `git diff --check`.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente y coincidencia SHA-256 de los cuatro módulos.
- Confirmación de `Inicializar.js` remoto.

## Resultado real verificado

- Cantidad: 4.
- Miguel O.
- Marisol Lozano Pulla.
- Miguel Arroyo Leandro.
- Claudio Alvarez.

## Seguridad

El DOCX real no se copió ni se incorporó a Git. Las pruebas versionables usan
nombres y contenido sintéticos.

## Pendientes

- Crear commit y publicar en GitHub cuando exista autorización explícita.

# Cambio 0019
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La ejecución encontró un documento vinculado y lo leyó, pero finalizó sin
> iniciar la extracción de participantes.

## Respuesta de Codex

El vínculo encontrado correspondía al mismo Google Docs fuente, normalmente a
otra pestaña. Al combinar la fuente con ese vínculo se repetía el mismo ID y el
selector recibía dos candidatos equivalentes, produciendo ambigüedad. Se
descartaron las autorreferencias y se añadió una segunda deduplicación defensiva
en el selector.

## Registro de progreso

1. Se leyó completamente la bitácora antes de modificar archivos.
2. Los registros confirmaron lectura correcta del documento fuente, un vínculo
   encontrado, lectura correcta del vínculo y ausencia de extracción.
3. Se relacionó el resultado con el segundo DOCX real, cuyo enlace apunta a otra
   pestaña del mismo documento.
4. Se impidió que Drive devuelva un vínculo con el mismo ID de la fuente.
5. Se deduplicaron por ID todos los candidatos válidos dentro de Gemini.
6. Se añadió una prueba con dos candidatos del mismo ID y contenido.
7. La batería finalizó con cinco casos correctos.
8. Las validaciones sintácticas y `git diff --check` terminaron correctamente.
9. Se desplegaron los 17 archivos preservando el proyecto remoto completo.
10. Una descarga independiente confirmó la coincidencia SHA-256 de Drive y
    Gemini, la permanencia de los 17 archivos y de `Inicializar.js`.

## Archivos modificados

- AppsScript/Drive.gs
- AppsScript/Gemini.gs
- Pruebas/Participantes.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Autorreferencia duplicada al mismo Google Docs: seleccionada una sola vez.
- Cinco casos automatizados correctos.
- Validación sintáctica de Drive y Gemini.
- `git diff --check`.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente y coincidencia SHA-256 de Drive y Gemini.
- Confirmación de `Inicializar.js` remoto.

## Pendientes

- Ejecutar nuevamente `probarExtraccionParticipantes()` para confirmar el
  resultado operativo.
- Confirmar que la salida contiene los cuatro asistentes esperados.
- Completar los datos documentales del participante abreviado en la hoja
  `persona` si corresponde.

# Cambio 0011
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La prueba con evidencia por intervención devolvió personas mencionadas que
> no participaron. Se definió como regla definitiva incluir personas con
> nombre y correo visible, añadir al organizador cuando todavía no esté
> incluido por correo y no incluir nunca personas meramente mencionadas. El
> usuario solicitó ajustar y desplegar, actualizando la bitácora y realizando
> finalmente commit y push.

## Respuesta de Codex

Se retiró del prompt la transcripción como evidencia de asistencia. La lista de
participantes se limita a personas con nombre y correo en listas o secciones
formales de asistencia, más el organizador identificado explícitamente en
metadatos, encabezados o una sección formal cuando no haya sido incluido por
correo. Las menciones, intervenciones, tareas, acuerdos y referencias a terceros
no acreditan asistencia.

La decisión DA-014 fue actualizada, el prompt se desplegó en Apps Script y una
descarga independiente confirmó la integridad del archivo y la conservación de
los componentes remotos obligatorios.

## Registro de progreso

1. Se leyó completamente la bitácora antes de modificar archivos.
2. Se revisaron `Prompt.gs` y DA-014.
3. Se sustituyó la regla provisional basada en correo o intervención.
4. Se estableció correo visible o identificación formal como organizador.
5. Se prohibió usar etiquetas de hablante, intervenciones y menciones como
   evidencia de asistencia.
6. Se actualizó DA-014 con la regla definitiva.
7. Se verificaron las instrucciones relevantes del prompt.
8. Se descargó el proyecto remoto con 17 archivos y se preservó
   `Inicializar.js`.
9. Se superpuso únicamente `Prompt.gs` y se ejecutó `clasp push --force`.
10. Una segunda descarga confirmó 17 archivos, `Inicializar.js`, la función de
    prueba y la coincidencia SHA-256 de `Prompt.gs`.

## Objetivo

Evitar falsos asistentes causados por nombres mencionados y conservar tanto a
los asistentes acreditados por correo como al organizador formal de la reunión.

## Archivos modificados

- AppsScript/Prompt.gs
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se eliminó la transcripción como fuente de evidencia de asistencia.
- Se exigió nombre con correo visible en una lista o sección formal.
- Se añadió al organizador solo cuando esté identificado formalmente y todavía
  no se encuentre incluido por correo.
- Se exigió deduplicar al organizador y los demás participantes.
- Se excluyeron expresamente nombres mencionados, responsables, destinatarios,
  personas citadas y etiquetas de hablante sin correo.
- Se actualizó el título, decisión, motivo y consecuencia de DA-014.

## Motivo

La regla provisional produjo falsos positivos al interpretar nombres
mencionados como participantes. La evidencia debe provenir de secciones
formales y no del contenido narrativo.

## Impacto

El modelo dejará de incorporar participantes únicamente por aparecer en la
transcripción. El organizador seguirá incluido aunque su correo no sea visible,
siempre que la fuente lo identifique formalmente como tal.

## Compatibilidad

No cambia el esquema JSON ni las APIs públicas. Restringe y precisa el criterio
funcional de selección de participantes.

## Pruebas realizadas

- Revisión textual de la regla definitiva en `Prompt.gs`.
- Revisión de DA-014 actualizada.
- `clasp pull` previo con 17 archivos.
- `clasp push --force` con 17 archivos.
- `clasp pull` independiente posterior.
- Coincidencia SHA-256 de `Prompt.gs` local y remoto.
- Confirmación de `Inicializar.js` y `PruebaParticipantes.js` remotos.
- No se realizó una llamada real a OpenAI desde este entorno.

## Pendientes

- Ejecutar nuevamente `probarExtraccionParticipantes()`.
- Confirmar que no aparecen personas meramente mencionadas.
- Confirmar que el organizador y las personas con correo aparecen una sola vez.

# Cambio 0012
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La regla basada en correo devolvió cinco personas e incluyó a una persona
> solamente mencionada que no ingresó a la reunión. Se confirmó que Google
> Meet no genera un informe de asistencia y se autorizó implementar y
> desplegar una regla basada en hablantes confirmados más el organizador.

## Respuesta de Codex

Se reemplazó la inferencia de participantes por una extracción determinista.
El sistema utiliza exclusivamente etiquetas `Nombre: intervención` posteriores
al encabezado de transcripción, deduplica los nombres y añade al organizador
solo cuando esté identificado explícitamente antes de esa sección. La lista
generada por OpenAI se descarta antes de consultar el catálogo de personas.

La función `probarExtraccionParticipantes()` reutiliza ahora este extractor y
ya no realiza llamadas a OpenAI. La prueba controlada sobre el DOCX aportado
devolvió cuatro participantes y confirmó que la persona únicamente mencionada
no fue incluida.

## Registro de progreso

1. Se leyó completamente la bitácora y la documentación arquitectónica.
2. Se comprobó en el DOCX que el falso positivo aparecía solo dentro de una
   intervención y no como etiqueta de hablante.
3. Se confirmó que no existe un informe de asistencia con nombres y correos.
4. El usuario autorizó expresamente la regla de hablantes más organizador.
5. Se implementó `extraerParticipantesConfirmados()` en `Gemini.gs`.
6. Se integró la sustitución determinista después de validar OpenAI y antes de
   resolver el catálogo de personas.
7. Se retiró del prompt la responsabilidad de inferir participantes.
8. La función manual de prueba dejó de llamar a OpenAI.
9. Una primera prueba detectó una incidencia de codificación en el texto
   enviado por PowerShell; se aisló y se repitió con Unicode estable.
10. Las pruebas sintácticas y funcionales finalizaron correctamente.
11. La prueba con el DOCX real devolvió cuatro participantes y ningún falso
    positivo para la persona mencionada.
12. Se descargaron los 17 archivos remotos y se preservó `Inicializar.js`.
13. Se desplegaron los cuatro módulos Apps Script modificados con `clasp`.
14. Una descarga independiente confirmó 17 archivos y coincidencia SHA-256
    para `Gemini`, `Main`, `Prompt` y `PruebaParticipantes`.

## Objetivo

Evitar que terceros mencionados sean incorporados como asistentes y eliminar
la dependencia de la interpretación probabilística de OpenAI para esta regla.

## Archivos modificados

- AppsScript/Gemini.gs
- AppsScript/Main.gs
- AppsScript/PruebaParticipantes.gs
- AppsScript/Prompt.gs
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se añadió una extracción determinista de etiquetas de hablante.
- Se exige un encabezado de transcripción antes de reconocer hablantes.
- Se deduplican nombres ignorando mayúsculas y acentos.
- Se admite una etiqueta de uno o varios términos.
- Se añade una sola vez al organizador identificado explícitamente antes de la
  transcripción.
- Se reemplazan los participantes devueltos por OpenAI antes de `Personas.gs`.
- La prueba aislada ya no consume la API de OpenAI.
- Se actualizó DA-014 y se documentó el riesgo de omitir asistentes silenciosos.

## Motivo

Sin un informe de asistencia no es posible acreditar a quienes ingresaron pero
no hablaron. Las etiquetas de hablante constituyen la evidencia verificable
disponible y permiten separar asistentes activos de personas solo mencionadas.

## Impacto

Se eliminan falsos positivos narrativos. Como limitación aceptada, los
asistentes silenciosos se omitirán. El cambio no altera el esquema del acta ni
la estructura del catálogo de personas.

## Compatibilidad

Se conserva el contrato `participantes: [{nombre, cargo}]`. El flujo mantiene
la validación de OpenAI para los demás campos, pero los participantes se
reemplazan determinísticamente antes de generar el acta.

## Pruebas realizadas

- Prueba local con organizador, hablantes repetidos, nombre de un término y
  una persona solamente mencionada.
- Confirmación de deduplicación del organizador.
- Confirmación de exclusión de la persona mencionada.
- Validación sintáctica con Node.js de los cuatro archivos Apps Script
  modificados.
- Prueba contra el DOCX proporcionado: cuatro participantes y falso positivo
  ausente, sin registrar nombres, correos ni contenido institucional.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente posterior y coincidencia SHA-256 de los cuatro
  módulos desplegados.
- Confirmación de `Inicializar.js` remoto y eliminación segura de temporales.

## Pendientes

- Ejecutar `probarExtraccionParticipantes()` en Apps Script para confirmar la
  lectura del Google Docs operativo.
- Confirmar visualmente los cuatro asistentes esperados en la Etapa 3.
- Mantener documentada la limitación de asistentes silenciosos mientras no
  exista una fuente formal de asistencia.

# Cambio 0013
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La prueba desplegada devolvió cero participantes. El usuario autorizó
> corregir y desplegar la extracción sin depender del encabezado literal de
> transcripción.

## Respuesta de Codex

Se eliminó el requisito de encontrar previamente la palabra `Transcripción`.
El extractor reconoce etiquetas `Nombre: intervención` en todo el contenido,
procesa `Organizador:` como metadato separado y excluye encabezados
documentales conocidos para impedir que se conviertan en participantes.

## Registro de progreso

1. Se leyó completamente la bitácora antes de modificar archivos.
2. Se identificó el encabezado obligatorio como causa de la lista vacía.
3. El usuario autorizó expresamente el ajuste y despliegue.
4. Se retiró el estado interno que esperaba el encabezado de transcripción.
5. Se procesó el organizador antes de evaluar etiquetas de hablante.
6. Se amplió la exclusión de encabezados documentales.
7. Una prueba sin encabezado confirmó tres hablantes, ningún encabezado como
   persona y exclusión de la persona solamente mencionada.
8. La prueba con el DOCX real mantuvo cuatro participantes y el falso positivo
   ausente.
9. Se descargaron los 17 archivos remotos y se preservó `Inicializar.js`.
10. Se desplegó `Gemini.gs` con `clasp`.
11. Una descarga independiente confirmó 17 archivos, coincidencia SHA-256 de
    `Gemini.js` y presencia de `Inicializar.js`.

## Objetivo

Reconocer hablantes en el Google Docs operativo aunque su texto no contenga el
encabezado literal observado en el DOCX exportado.

## Archivos modificados

- AppsScript/Gemini.gs
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se reconocen etiquetas de hablante en todo el documento.
- `Organizador:` se interpreta como metadato y no como etiqueta de hablante.
- Se excluyen fecha, hora, lugar, reunión, tema, resumen, notas, participantes,
  asistentes, proyecto, metodología, convocatoria, duración, agenda, acuerdos,
  tareas, acciones, objetivo, ubicación e invitados, entre otros encabezados.
- Se actualizó la arquitectura y DA-014 para retirar la dependencia del
  encabezado de transcripción.

## Motivo

La representación de texto del Google Docs operativo no conserva
necesariamente el mismo encabezado que el DOCX exportado. La etiqueta de
hablante sigue siendo evidencia suficiente sin depender de esa marca previa.

## Impacto

Evita resultados vacíos causados por diferencias estructurales entre Google
Docs y DOCX. Conserva la exclusión de nombres mencionados y la limitación de
asistentes silenciosos.

## Compatibilidad

No cambia contratos públicos ni el esquema de participantes. Solo amplía el
ámbito donde se buscan etiquetas válidas y refuerza las exclusiones.

## Pruebas realizadas

- Validación sintáctica de `Gemini.gs` con Node.js.
- Caso sin encabezado de transcripción con metadatos, organizador, hablantes
  repetidos y una persona solo mencionada.
- Confirmación de que los encabezados no fueron clasificados como personas.
- Prueba contra el DOCX proporcionado: cuatro participantes y falso positivo
  ausente, sin registrar contenido institucional.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente y coincidencia SHA-256 de `Gemini.js`.
- Confirmación de `Inicializar.js` remoto y limpieza segura de temporales.

## Pendientes

- Ejecutar nuevamente `probarExtraccionParticipantes()` en Apps Script.
- Confirmar que el Google Docs operativo devuelve los cuatro participantes.

# Cambio 0014
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La prueba clasificó cinco títulos temáticos como participantes. El usuario
> solicitó modificar y desplegar la solución correcta.

## Respuesta de Codex

Se eliminó el uso de las notas temáticas como fuente de participantes. La
prueba y el flujo principal listan los archivos de la carpeta, localizan una
única transcripción cuyo nombre base coincide con el documento de notas, leen
esa transcripción y extraen únicamente sus etiquetas de hablante. Ante cero o
múltiples coincidencias, el documento falla de forma controlada.

## Registro de progreso

1. Se leyó completamente la bitácora antes de modificar archivos.
2. Se revisó el selector de Drive y se confirmó que entrega únicamente el
   Google Docs más reciente.
3. Se confirmó que la función de prueba estaba leyendo las notas temáticas.
4. Se descartó ampliar indefinidamente una lista negra de títulos.
5. Se implementó el emparejamiento por nombre base entre notas y transcripción.
6. Se integró la lectura de la transcripción en la prueba aislada.
7. Se integró la misma selección en el flujo principal antes de extraer
   participantes.
8. Se probaron nombres de reunión coincidentes, una transcripción ajena y la
   exclusión de una persona solamente mencionada.
9. Se validó la sintaxis de los tres archivos Apps Script modificados.
10. El primer intento de `clasp pull` fue rechazado por Google con
    `invalid_rapt`; no se descargó ni publicó ningún archivo.
11. Se inició `clasp login`, pero la autorización no se completó dentro del
    tiempo de espera y una comprobación posterior mantuvo `invalid_rapt`.
12. El usuario completó posteriormente la autenticación de `clasp`.
13. Se descargaron los 17 archivos remotos, se preservó `Inicializar.js` y se
    desplegaron `Gemini`, `Main` y `PruebaParticipantes`.
14. Una descarga independiente confirmó 17 archivos, presencia de
    `Inicializar.js` y coincidencia SHA-256 de los tres módulos desplegados.

## Objetivo

Separar las fuentes: usar las notas para construir el contenido del acta y la
transcripción asociada únicamente para identificar hablantes confirmados.

## Archivos modificados

- AppsScript/Gemini.gs
- AppsScript/Main.gs
- AppsScript/PruebaParticipantes.gs
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se añadió `seleccionarTranscripcionAsociada()` como regla pura en
  `Gemini.gs`.
- El nombre base elimina los sufijos `Notas de Gemini`, `Transcripción` o
  `Transcript`, normaliza mayúsculas, espacios y acentos, y exige igualdad.
- Solo se aceptan Google Docs directos cuyo nombre indique transcripción.
- Cero coincidencias produce `GEMINI_TRANSCRIPCION_NO_ENCONTRADA`.
- Varias coincidencias producen `GEMINI_TRANSCRIPCION_AMBIGUA`.
- `probarExtraccionParticipantes()` lee la transcripción seleccionada y sigue
  sin llamar a OpenAI.
- `Main.gs` usa las notas para OpenAI y la transcripción para participantes.

## Motivo

Las notas contienen títulos con dos puntos que no son hablantes. La
transcripción es la única fuente disponible donde las etiquetas anteriores a
una intervención representan participantes activos.

## Impacto

Evita clasificar temas como personas. Añade una lectura adicional de Drive por
documento y requiere una convención de nombres coherente entre las notas y su
transcripción.

## Compatibilidad

No cambia el esquema del acta ni del catálogo de personas. El flujo añade una
etapa controlada `TRANSCRIPCION` antes de resolver asistentes.

## Pruebas realizadas

- Emparejamiento exacto entre `Notas de Gemini` y `Transcripción`.
- Exclusión de una transcripción perteneciente a otra reunión.
- Extracción de dos hablantes y exclusión de una persona solo mencionada.
- Validación sintáctica de `Gemini.gs`, `Main.gs` y
  `PruebaParticipantes.gs` con Node.js.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente y coincidencia SHA-256 de los tres módulos.
- Confirmación de `Inicializar.js` remoto y limpieza segura de temporales.

## Pendientes

- Ejecutar `probarExtraccionParticipantes()` contra la carpeta operativa.
- Confirmar que la convención real de nombres produce una única coincidencia.
- Confirmar que la salida contiene únicamente los cuatro hablantes esperados.

# Cambio 0015
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La selección por nombre no produjo participantes y el usuario solicitó
> solucionarlo.

## Respuesta de Codex

Se reemplazó el emparejamiento por nombre por una clasificación determinista
del contenido. Drive lee de forma controlada los Google Docs directos de la
carpeta y Gemini acepta como transcripción únicamente un documento que tenga
al menos dos hablantes distintos, etiquetas repetidas y además título o marcas
de tiempo de transcripción, o una secuencia suficiente de intervenciones.

## Registro de progreso

1. Se leyó completamente la bitácora antes de modificar archivos.
2. Se descartó depender nuevamente de nombres de archivo no confirmados.
3. Se diseñó una detección estructural separada del acceso técnico a Drive.
4. Se añadió la lectura controlada de todos los Google Docs directos.
5. Se añadió la clasificación de transcripción por hablantes y marcas.
6. Se integró la nueva selección en la prueba y en el flujo principal.
7. El primer comando de edición aplicó el parche, aunque su envoltorio de
   PowerShell falló al imprimir el resultado; se verificó el estado antes de
   continuar y no se duplicaron cambios.
8. Una prueba simuló exactamente cinco títulos temáticos y una transcripción:
   las notas fueron descartadas y la transcripción fue seleccionada.
9. La extracción simulada mantuvo fuera a una persona solo mencionada.
10. Se validó la sintaxis de los cuatro módulos Apps Script modificados.
11. El usuario autorizó expresamente el despliegue.
12. Se descargaron los 17 archivos remotos y se preservó `Inicializar.js`.
13. Se desplegaron Drive, Gemini, Main y PruebaParticipantes con `clasp`.
14. Una descarga independiente confirmó 17 archivos, `Inicializar.js` y
    coincidencia SHA-256 de los cuatro módulos desplegados.

## Objetivo

Identificar la transcripción real sin depender de su nombre y evitar que las
secciones temáticas de las notas sean interpretadas como participantes.

## Archivos modificados

- AppsScript/Drive.gs
- AppsScript/Gemini.gs
- AppsScript/Main.gs
- AppsScript/PruebaParticipantes.gs
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se añadió `leerContenidosDocumentosGoogle()` en Drive.
- `seleccionarTranscripcionAsociada()` evalúa contenido y no nombres.
- La transcripción requiere al menos dos hablantes distintos y repetición de
  alguna etiqueta.
- También requiere título, marca temporal o al menos cinco intervenciones.
- Cero o múltiples candidatos mantienen errores controlados.
- Main y la prueba usan la misma selección estructural.

## Motivo

La convención real de nombres no permitió emparejar notas y transcripción. En
cambio, la estructura conversacional permite distinguir una transcripción de
un resumen con títulos únicos.

## Impacto

Se leen los tres Google Docs candidatos de la carpeta antes de seleccionar la
transcripción. No se registra contenido ni se envía esta prueba a OpenAI.

## Compatibilidad

No cambia el esquema de participantes ni el acta. Se conserva la etapa
controlada `TRANSCRIPCION` y se elimina la dependencia funcional de nombres.

## Pruebas realizadas

- Cinco títulos temáticos únicos: descartados como notas.
- Transcripción con tres hablantes, repeticiones, marca temporal y título:
  seleccionada correctamente.
- Persona mencionada dentro de una intervención: excluida.
- Validación sintáctica con Node.js de Drive, Gemini, Main y la prueba.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente y coincidencia SHA-256 de los cuatro módulos.
- Confirmación de `Inicializar.js` remoto y limpieza segura de temporales.

## Pendientes

- Ejecutar después `probarExtraccionParticipantes()` en Apps Script.

# Cambio 0016
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La ejecución leyó los tres Google Docs, pero no inició la extracción. El
> usuario había indicado previamente que los errores debían explicarse y
> resolverse sin esperar una nueva orden de implementación.

## Respuesta de Codex

Se determinó que ningún documento superó el umbral estructural. El selector
prioriza ahora una única referencia cuyo nombre contenga `Transcripción` o
`Transcript`, sin exigir coincidencia del nombre base. Solo cuando no existe
una marca única se utiliza la clasificación estructural como respaldo.

## Registro de progreso

1. Se leyó completamente la bitácora antes de modificar archivos.
2. Los registros confirmaron lectura correcta de tres Google Docs y ausencia
   de la etapa de extracción.
3. Se identificó que el umbral estructural descartó todos los documentos.
4. Se añadió prioridad para una marca inequívoca de transcripción en el nombre.
5. Se mantuvo el análisis estructural como mecanismo secundario.
6. Una prueba con nombres base diferentes seleccionó la transcripción marcada.
7. La extracción de prueba devolvió dos hablantes y excluyó una persona solo
   mencionada.
8. Como continuación del despliegue previamente autorizado y de la instrucción
   de resolver errores sin esperar, se publicó la corrección automáticamente.
9. Se preservaron los 17 archivos remotos y `Inicializar.js`.
10. Una descarga independiente confirmó la coincidencia SHA-256 de
    `Gemini.js`, los 17 archivos y `Inicializar.js`.

## Objetivo

Seleccionar la transcripción real cuando Google utiliza un nombre diferente al
documento de notas y su representación textual no supera el umbral estructural.

## Archivos modificados

- AppsScript/Gemini.gs
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se filtran primero documentos con `Transcripción` o `Transcript` en el nombre.
- Una única coincidencia nombrada se selecciona directamente.
- Cero o varias coincidencias nombradas activan el análisis por contenido.
- Se actualizaron arquitectura, DA-014 y riesgos.

## Motivo

La marca del tipo de artefacto es más estable que la igualdad del nombre base y
permite seleccionar el documento correcto sin interpretar las notas temáticas.

## Impacto

Amplía la compatibilidad con nombres reales de archivos. Mantiene errores
controlados ante ambigüedad y la exclusión de nombres solo mencionados.

## Compatibilidad

No cambia contratos ni esquemas. Modifica únicamente la prioridad interna de
selección de la transcripción.

## Pruebas realizadas

- Transcripción marcada con nombre base diferente: seleccionada.
- Documento de notas no marcado: descartado.
- Dos hablantes extraídos y persona mencionada excluida.
- Validación sintáctica de `Gemini.gs` con Node.js.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente y coincidencia SHA-256 de `Gemini.js`.
- Confirmación de `Inicializar.js` remoto y limpieza de temporales.

## Pendientes

- Ejecutar nuevamente `probarExtraccionParticipantes()` después del despliegue.

# Cambio 0017
Fecha: 2026-08-01
Autor: Codex

## Solicitud del usuario

> La nueva ejecución volvió a leer tres documentos, pero terminó sin mostrar
> participantes ni iniciar la extracción.

## Respuesta de Codex

Los registros demostraron que la transcripción no estaba entre los Google Docs
directos de la carpeta configurada. Se amplió la búsqueda para localizar Google
Docs enlazados desde las notas mediante hipervínculos de texto o chips
inteligentes, combinarlos con los archivos directos y aplicar después la misma
selección estricta de transcripción y hablantes.

## Registro de progreso

1. Se revisaron los registros: tres lecturas correctas y ninguna extracción.
2. Se descartó un error de lectura y se identificó una ausencia de candidatos.
3. Se verificó en la API oficial de Apps Script el acceso a `RICH_LINK`,
   `RichLink.getUrl()`, atributos de texto y `Text.getLinkUrl()`.
4. Se implementó la búsqueda recursiva de vínculos dentro del documento de
   notas, aceptando únicamente Google Docs accesibles.
5. Se combinaron y deduplicaron por ID los documentos directos y vinculados.
6. Se integró la búsqueda tanto en el flujo principal como en la función de
   prueba, sin usar OpenAI para extraer participantes.
7. Se mantuvo la regla definitiva: solo etiquetas de hablante y organizador
   explícito; una persona meramente mencionada continúa excluida.
8. La validación inicial con `node --check archivo.gs` no fue compatible con
   Node.js 24 por la extensión `.gs`; se repitió mediante entrada estándar.
9. La validación sintáctica compatible finalizó sin errores en los cuatro
   módulos revisados.
10. Se desplegaron 17 archivos desde una copia temporal que preservó el estado
    remoto.
11. Una descarga independiente confirmó la coincidencia SHA-256 de Drive,
    Main y PruebaParticipantes, además de los 17 archivos e `Inicializar.js`.

## Objetivo

Encontrar la transcripción real cuando Gemini la referencia desde las notas
pero no la almacena como archivo directo en la carpeta configurada.

## Archivos modificados

- AppsScript/Drive.gs
- AppsScript/Main.gs
- AppsScript/PruebaParticipantes.gs
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Cambios realizados

- Se recorren hipervínculos de texto y chips inteligentes del documento fuente.
- Solo se aceptan vínculos que resuelven a Google Docs accesibles y vigentes.
- Se deduplican candidatos por identificador de Drive.
- Los vínculos inaccesibles o ajenos a Google Docs se omiten sin registrar
  URLs, IDs, títulos ni contenido.
- Main y `probarExtraccionParticipantes()` usan el mismo conjunto combinado.

## Motivo

La evidencia de ejecución mostró que ninguno de los tres documentos directos
era la transcripción. Las notas de Gemini pueden contener la referencia al
documento de transcripción como vínculo o chip, aunque esté fuera de la carpeta.

## Impacto

La localización admite la organización real de archivos sin relajar el criterio
de asistencia ni incorporar nombres presentes únicamente en el relato.

## Compatibilidad

No cambia el esquema del acta ni el contrato de participantes. Añade una fuente
técnica de candidatos antes de ejecutar el selector existente.

## Pruebas realizadas

- Extracción de ID desde URL `/document/d/...`.
- Extracción de ID desde URL con parámetro `id`.
- Validación sintáctica de Drive, Gemini, Main y la prueba con Node.js.
- `git diff --check` sin errores.
- `clasp push --force` desde una copia temporal con 17 archivos.
- Descarga independiente y coincidencia SHA-256 de los tres módulos publicados.
- Confirmación de `Inicializar.js` remoto.

## Pendientes

- Ejecutar nuevamente `probarExtraccionParticipantes()`.

# Cambio 0023
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Implementar la Fase 6 con temas variables, confirmar que
> `Temas tratados = acuerdos` y evitar espacios en blanco entre cada elemento.

## Respuesta de Codex

Se sustituyó la sección independiente de Resumen Ejecutivo por una tabla
institucional `TEMAS TRATADOS:`. Su contenido usa directamente los acuerdos
validados, conserva su numeración y elimina el espaciado entre párrafos.

## Registro de progreso

1. Se leyó completamente la bitácora y la documentación obligatoria.
2. Se confirmó que `acuerdos` ya forma parte del contrato validado y contiene
   número y descripción.
3. Se implementó una tabla exterior con etiqueta lateral ploma.
4. Se implementó una tabla interior sin bordes con columnas de número y texto.
5. Los textos usan alineación justificada, Arial 9 y alineación vertical
   superior.
6. El espaciado anterior y posterior de cada elemento se estableció en cero.
7. Cuando no existen acuerdos, se conserva la sección con contenido vacío y no
   se crea una tabla inválida.
8. Se añadió una prueba automatizada con cuatro acuerdos.
9. La prueba de Temas, Siglas, Agenda y las seis regresiones de participantes
   finalizaron correctamente.
10. La validación sintáctica de Acta y `git diff --check` no mostraron errores.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaTemas.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Cuatro acuerdos convertidos en cuatro temas numerados.
- Conservación de número y descripción.
- Fondo plomo, bordes y anchos institucionales.
- Espaciado anterior y posterior en cero.
- Alineación justificada y vertical superior.
- Regresiones de Siglas, Agenda y Participantes.
- Validación sintáctica de Acta.
- `git diff --check`.

## Pendientes

- Confirmar visualmente la Fase 6 en un documento generado.

## Despliegue y verificación

1. El primer intento se detuvo antes de publicar porque Google devolvió
   `invalid_grant / invalid_rapt` y exigió reautenticación.
2. Se ejecutó `clasp login` y la cuenta autorizada quedó autenticada.
3. Se reintentó el proceso desde una copia temporal nueva.
4. Se desplegaron los 17 archivos preservando el proyecto remoto completo.
5. Una descarga independiente confirmó la coincidencia SHA-256 de `Acta.gs`.
6. Se confirmó la permanencia de los 17 archivos y de `Inicializar.js`.

# Cambio 0024
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> No dejar espacio entre los acuerdos mostrados como temas tratados.

## Respuesta de Codex

Además del espaciado de párrafo ya configurado en cero, se eliminó el relleno
superior e inferior de cada celda de número y descripción. De este modo no queda
separación vertical introducida por la tabla entre un acuerdo y el siguiente.

## Registro de progreso

1. Se leyó completamente la bitácora antes de modificar archivos.
2. Se comprobó que los párrafos ya tenían espaciado anterior y posterior cero.
3. Se identificó el relleno vertical de las celdas como posible separación
   adicional de Google Docs.
4. Se estableció relleno superior e inferior en cero para ambas columnas.
5. Se amplió la prueba para verificar ocho propiedades de relleno en las cuatro
   filas simuladas.
6. Las pruebas de Temas, Siglas, Agenda y Participantes finalizaron
   correctamente.
7. La validación sintáctica y `git diff --check` no mostraron errores.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaTemas.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Pendientes

- Confirmar visualmente que no exista separación entre acuerdos.

## Despliegue y verificación

El ajuste de relleno vertical forma parte del mismo `Acta.gs` desplegado y
verificado en el Cambio 0023.

# Cambio 0025
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Implementar y desplegar el cierre del acta. `Riesgos o problemas` debe
> quedar vacío. Los acuerdos usan la opción A: con responsable,
> `Nombre: descripción`; sin responsable, `Sin responsable descripción`,
> sin dos puntos. La próxima reunión corresponde al día siguiente de la fecha
> del acta.

## Respuesta de Codex

Se reemplazaron las secciones genéricas finales por la estructura institucional
de las Fases 7 y 8. Se amplió el contrato de acuerdos con responsable opcional y
se implementó el cálculo del día calendario siguiente.

## Registro de progreso

1. Se leyó completamente la bitácora y la documentación obligatoria.
2. Se confirmó el formato exacto mediante la opción A.
3. Se revisaron Prompt, esquema estructurado de OpenAI, Validador y Acta.
4. Se añadió `responsable` a los acuerdos en los cuatro contratos.
5. Prompt exige cadena vacía cuando no exista responsable explícito y prohíbe
   inventarlo.
6. Se implementó la fila vacía de riesgos y problemas.
7. Se implementó el encabezado plomo de acuerdos y las viñetas compactas.
8. Se implementaron ambos formatos de texto con y sin responsable.
9. Se calculó la próxima reunión sumando un día calendario a `DD/MM/AAAA`.
10. Se reemplazaron las tablas genéricas de Acuerdos, Tareas y Observaciones.
11. Se agregaron pruebas para formato, normalización y esquema de OpenAI.
12. Se probaron cambio de mes, cambio de año y año bisiesto.
13. Las pruebas nuevas y todas las regresiones finalizaron correctamente.
14. Las validaciones sintácticas de los cuatro módulos y `git diff --check`
    no mostraron errores.

## Archivos modificados

- AppsScript/Acta.gs
- AppsScript/Prompt.gs
- AppsScript/OpenAI.gs
- AppsScript/ValidadorRespuesta.gs
- Pruebas/ActaCierre.test.js
- Pruebas/ValidadorAcuerdos.test.js
- Pruebas/ActaTemas.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Responsable real con dos puntos.
- Ausencia de responsable sin dos puntos.
- Riesgos o problemas vacío.
- Encabezado plomo y viñetas sin espacios.
- Día siguiente ordinario.
- Cambio de mes y de año.
- Año bisiesto.
- Normalización del responsable ausente.
- Esquema estructurado de OpenAI sincronizado.
- Regresiones de Temas, Siglas, Agenda y Participantes.
- Validación sintáctica y `git diff --check`.

## Pendientes

- Confirmar visualmente las Fases 7 y 8 en un documento generado.

## Despliegue y verificación

1. Se desplegaron los 17 archivos desde una copia temporal que preservó el
   proyecto remoto completo.
2. Una descarga independiente confirmó la coincidencia SHA-256 de
   `Acta.gs`, `Prompt.gs`, `OpenAI.gs` y `ValidadorRespuesta.gs`.
3. Se confirmó la permanencia de los 17 archivos y de `Inicializar.js`.

# Cambio 0026
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Corregir y desplegar la próxima reunión para que corresponda al siguiente
> día laborable de lunes a viernes, manteniendo los acuerdos sin espacios en
> blanco entre ellos.

## Respuesta de Codex

Se sustituyó el cálculo del día calendario siguiente por el siguiente día de
lunes a viernes. Cuando la fecha base es viernes, sábado o domingo, la próxima
reunión se presenta el lunes. No se modificó el formato compacto de acuerdos.
Los feriados permanecen fuera del alcance mientras no exista una fuente de
calendario oficial autorizada.

## Registro de progreso

1. Se confirmó que la implementación anterior sumaba un día calendario.
2. El entorno aislado de Windows presentó repetidamente un error de
   inicialización en la unidad de Google Drive.
3. Se configuró el modo oficial alternativo `unelevated` y se recuperaron la
   lectura, la escritura controlada y la ejecución de Git.
4. Google Drive mantuvo bloqueado solo un archivo temporal vacío de validación;
   se excluyó del cambio y del versionado.
5. Se implementó el avance de fecha hasta encontrar lunes, martes, miércoles,
   jueves o viernes.
6. Se conservaron las viñetas de acuerdos con espaciado anterior, posterior y
   relleno vertical en cero.
7. Se ampliaron las pruebas con casos de viernes, sábado, domingo, cambio de
   año y año bisiesto.
8. La primera prueba detectó una expectativa antigua dentro de la tabla final;
   se actualizó y toda la suite se repitió satisfactoriamente.
9. El primer intento de despliegue se detuvo sin publicar por un conflicto de
   extensiones entre `Acta.gs` local y `Acta.js` remoto.
10. Se corrigió el nombre solo en la copia temporal, se desplegaron los 17
    archivos y una descarga independiente verificó el resultado.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaCierre.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- `ActaCierre.test.js`: cálculo laboral y cierre correctos.
- `ValidadorAcuerdos.test.js`: responsable normalizado.
- `ActaTemas.test.js`: acuerdos y espaciado compacto correctos.
- `ActaSiglas.test.js`: once elementos y formato correctos.
- `ActaAgenda.test.js`: contenido y formato correctos.
- `Participantes.test.js`: seis casos correctos.
- Validación sintáctica de `Acta.gs`.
- `git diff --check` sin errores.

## Pendientes

- Confirmar visualmente la fecha y el espaciado en un acta generada.

## Despliegue y verificación

1. Se descargaron los 17 archivos remotos a una copia temporal y se confirmó
   la presencia de `Inicializar.js`.
2. El primer intento de publicación se detuvo sin modificar el remoto porque
   la copia local se incorporó como `Acta.gs` y el remoto utiliza `Acta.js`.
3. Se corrigió exclusivamente la extensión dentro de la carpeta temporal y se
   desplegaron los 17 archivos correctamente.
4. Una descarga independiente confirmó 17 archivos, la permanencia de
   `Inicializar.js` y coincidencia SHA-256 entre `AppsScript/Acta.gs` y
   `Acta.js` remoto.

# Cambio 0027
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Revisar y actuar sobre el registro de una ejecución End-to-End que terminó
> con `WORD_AUTENTICACION_ERROR` durante la exportación del acta.

## Respuesta de Codex

El acta se generó correctamente y los cuatro participantes se resolvieron; el
fallo ocurrió únicamente al exportar el Google Docs mediante una llamada HTTP
a Drive API autenticada con `ScriptApp.getOAuthToken()`. Se reemplazó esa vía
por la conversión nativa `File.getAs(MimeType.MICROSOFT_WORD)`, eliminando el
token y la solicitud HTTP manuales.

## Registro de progreso

1. Se leyó completamente el registro adjunto y se ubicó la etapa final `WORD`.
2. Se confirmó que Drive, OpenAI, participantes, correlativo y generación del
   Google Docs finalizaron correctamente.
3. Se revisaron `Word.gs`, el manifiesto y la documentación de autorizaciones.
4. La documentación oficial de Apps Script confirmó que `File.getAs()` permite
   convertir un archivo y que `MimeType.MICROSOFT_WORD` representa DOCX.
5. Se eliminó la administración manual del token OAuth y `UrlFetchApp` de la
   exportación Word.
6. Se mantuvieron el nombre institucional, la carpeta destino, el MIME y la
   verificación posterior del archivo.
7. Se agregó una prueba aislada que ejecuta la exportación sin definir
   `ScriptApp` ni `UrlFetchApp`.
8. Todas las pruebas y regresiones finalizaron correctamente.

## Archivos modificados

- AppsScript/Word.gs
- Pruebas/WordExportacion.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Prueba_E2E_Controlada.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- `WordExportacion.test.js`: conversión DOCX nativa, nombre, MIME, carpeta y
  verificación correctos.
- Confirmación de ausencia de `getOAuthToken` y `UrlFetchApp.fetch` en
  `Word.gs`.
- Regresiones de Cierre, Validador de acuerdos, Temas, Siglas, Agenda y
  Participantes.
- Validación sintáctica de `Word.gs`.
- `git diff --check` sin errores.

## Pendientes

- Desplegar `Word.gs` cuando el usuario lo autorice expresamente.
- Reejecutar de forma controlada el documento en estado `ERROR`, conforme a la
  política que impide reintentos automáticos.

# Cambio 0028
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Corregir la sección visual `Acuerdos`: los acuerdos del documento son las
> tareas. Cada elemento debe usar `Responsable: descripción`; cuando no exista
> responsable, debe mostrarse solamente la descripción, sin dos puntos.

## Respuesta de Codex

La sección `Acuerdos` del cierre ahora consume `acta.tareas`. Con responsable
presenta `Responsable: descripción`; con responsable vacío presenta solo la
descripción. Se eliminó definitivamente el prefijo `Sin responsable`. La
sección `Temas tratados` continúa usando `acta.acuerdos` y las viñetas del
cierre mantienen espaciado anterior y posterior en cero.

## Registro de progreso

1. Se confirmó con el usuario que una tarea sin responsable conserva su
   descripción y omite los dos puntos.
2. Se revisaron los contratos de `acuerdos` y `tareas`, el generador, el prompt
   y las pruebas del cierre.
3. Se cambió exclusivamente la fuente de la sección visual `Acuerdos` a
   `acta.tareas`.
4. Se reemplazó el formateador de acuerdos por un formateador de tareas.
5. Se actualizó el prompt para exigir responsable opcional en cada tarea y no
   en cada acuerdo.
6. Se actualizaron arquitectura, decisión DA-018 y riesgos técnicos.
7. Las pruebas confirmaron ambos formatos y el espaciado compacto.
8. También se repitió satisfactoriamente la prueba de exportación Word
   pendiente y todas las regresiones documentales.

## Archivos modificados

- AppsScript/Acta.gs
- AppsScript/Prompt.gs
- Pruebas/ActaCierre.test.js
- Pruebas/ValidadorAcuerdos.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Tarea con responsable: `Nombre: descripción`.
- Tarea sin responsable: solo `descripción`.
- Viñetas con espaciado anterior y posterior en cero.
- Pruebas de Cierre, Validador de acuerdos, Word, Temas, Siglas, Agenda y
  Participantes.
- Validación sintáctica de `Acta.gs` y `Prompt.gs`.
- `git diff --check` sin errores.

## Pendientes

- Desplegar conjuntamente los Cambios 0027 y 0028 cuando el usuario lo
  autorice expresamente.

# Cambio 0029
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Confirmar que las tareas encontradas en el documento son los acuerdos, con
> formato `Responsable: descripción`, y hacer que la columna de acuerdos ocupe
> el ancho completo de la página mostrado en el modelo.

## Respuesta de Codex

Se mantuvo `acta.tareas` como fuente de la sección visual `Acuerdos`. Se
corrigió la fusión de celdas para recuperar la celda superviviente después de
fusionar y fijar en ella el ancho institucional total de 425 puntos. El
encabezado y la lista de tareas ahora ocupan las dos columnas de la tabla.

## Registro de progreso

1. Se revisó la imagen y se identificó que el contenido permanecía confinado
   al ancho de la columna izquierda.
2. Se verificó en la documentación oficial que `TableCell.merge()` mueve la
   celda actual a su hermana anterior y elimina la celda actual.
3. Se modificó el generador para fusionar primero y recuperar después la celda
   de índice cero.
4. Se fijó el ancho de encabezado y contenido en la suma de las columnas:
   103 + 322 = 425 puntos.
5. La simulación de prueba ahora elimina la segunda celda como lo hace Google
   Docs y comprueba que quede una sola celda de 425 puntos.
6. Se confirmaron nuevamente los formatos con y sin responsable, el espaciado
   compacto y todas las regresiones.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaCierre.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Encabezado `Acuerdos` fusionado en una sola celda de 425 puntos.
- Lista de tareas fusionada en una sola celda de 425 puntos.
- Tarea con responsable: `Responsable: descripción`.
- Tarea sin responsable: solo la descripción.
- Viñetas sin espacio anterior ni posterior.
- Regresiones de Word, Temas, Siglas, Agenda y Participantes.
- Validación sintáctica y `git diff --check`.

## Pendientes

- Reejecutar controladamente el documento en estado `ERROR` y confirmar
  visualmente el ancho completo, las tareas y la exportación DOCX.

## Despliegue y verificación

1. El usuario autorizó expresamente desplegar los Cambios 0027, 0028 y 0029.
2. Se descargaron los 17 archivos remotos a una copia temporal y se preservó
   `Inicializar.js`.
3. Se incorporaron exclusivamente `Acta.js`, `Prompt.js` y `Word.js` desde los
   módulos locales probados.
4. `clasp push --force` publicó correctamente los 17 archivos.
5. Una descarga independiente confirmó 17 archivos, `Inicializar.js` y
   coincidencia SHA-256 de Acta, Prompt y Word.

# Cambio 0030
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Colocar las tareas de la sección `Acuerdos` a la derecha del título
> `Acuerdos`.

## Respuesta de Codex

La sección se reorganizó en una sola fila de dos columnas: la etiqueta
`Acuerdos` permanece en la columna izquierda de 103 puntos y las tareas se
escriben en la columna derecha de 322 puntos. Se eliminaron la fila adicional
de contenido y la fusión de celdas.

## Registro de progreso

1. Se confirmó que el usuario quiso decir a la derecha del título.
2. Se revisó la estructura desplegada del cierre y su prueba simulada.
3. Se redujo la tabla de cierre de cuatro a tres filas.
4. Se aplicaron los anchos institucionales 103/322 a la fila `Acuerdos`.
5. Las viñetas se trasladaron a la segunda celda de la misma fila.
6. Se conservaron el formato `Responsable: descripción`, la descripción sin
   dos puntos cuando falta responsable y el espaciado compacto.
7. Todas las pruebas y regresiones finalizaron correctamente.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaCierre.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Fila `Acuerdos` con exactamente dos celdas.
- Etiqueta izquierda de 103 puntos.
- Contenido derecho de 322 puntos.
- Viñetas con espaciado anterior y posterior en cero.
- Regresiones de Word, Validador, Temas, Siglas, Agenda y Participantes.
- Validación sintáctica de `Acta.gs`.
- `git diff --check` sin errores.

## Pendientes

- Confirmar visualmente la nueva distribución en un acta generada.

## Despliegue y verificación

1. El usuario autorizó expresamente el despliegue del Cambio 0030.
2. Se descargaron y preservaron los 17 archivos remotos, incluido
   `Inicializar.js`.
3. Se incorporó exclusivamente `Acta.js` desde el módulo local probado.
4. `clasp push --force` publicó correctamente los 17 archivos.
5. Una descarga independiente confirmó 17 archivos, `Inicializar.js` y
   coincidencia SHA-256 de `Acta.js`.

# Cambio 0031
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Autorizar la incorporación de alcances OAuth explícitos, restaurar la
> exportación DOCX oficial de Drive API y desplegar la solución después de que
> la conversión nativa terminara con `WORD_EXPORTACION_ERROR`.

## Respuesta de Codex

Se restauró `GET /drive/v3/files/{fileId}/export` con el MIME DOCX oficial y
se declararon en `appsscript.json` los alcances de Drive, Docs, Sheets y
solicitudes externas que el proyecto ya utiliza. La siguiente ejecución
requiere que la cuenta ejecutora acepte nuevamente los permisos de Google.

## Registro de progreso

1. Se leyó el segundo registro de ejecución y se confirmó que el fallo seguía
   limitado a la etapa Word.
2. La documentación oficial confirmó que `File.getAs()` no ofrece DOCX para un
   Google Docs y que Drive API sí publica DOCX como formato de exportación.
3. Se determinó que el primer 403 ocurrió sin garantizar el alcance Drive en
   el token temporal.
4. La plataforma detuvo inicialmente el cambio de permisos y solicitó una
   autorización específica del usuario.
5. El usuario autorizó expresamente los cuatro alcances y el despliegue.
6. Se restauraron token, endpoint, clasificación HTTP y validación del blob.
7. Se agregaron los cuatro `oauthScopes` al manifiesto.
8. La prueba verifica endpoint, encabezado Bearer, MIME, nombre del archivo y
   lista exacta de alcances.
9. Todas las pruebas y regresiones finalizaron correctamente.
10. Durante la actualización documental, una sustitución amplia marcó
    transitoriamente DA-001 como sustituida; se detectó antes del despliegue,
    se restauró DA-001 y se marcó correctamente solo DA-019.

## Archivos modificados

- AppsScript/Word.gs
- AppsScript/appsscript.json
- Pruebas/WordExportacion.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Prueba_E2E_Controlada.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Drive API usa el identificador y el MIME DOCX codificados.
- Encabezado `Authorization: Bearer` correcto.
- Respuesta HTTP 200 convertida en blob DOCX con nombre institucional.
- Manifiesto JSON válido con cuatro alcances exactos.
- Regresiones de Cierre, Validador, Temas, Siglas, Agenda y Participantes.
- Validación sintáctica de `Word.gs` y `git diff --check`.

## Pendientes

- Reautorizar los permisos de Google en la siguiente ejecución.
- Reintentar manualmente el documento en estado `ERROR`.

## Despliegue y verificación

1. Se descargaron y preservaron los 17 archivos remotos, incluido
   `Inicializar.js`.
2. Se incorporaron exclusivamente `Word.js` y `appsscript.json` desde los
   archivos locales probados y autorizados.
3. `clasp push --force` publicó correctamente los 17 archivos.
4. Una descarga independiente confirmó 17 archivos, `Inicializar.js` y
   coincidencia SHA-256 de Word y el manifiesto.

# Cambio 0032
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Eliminar los espacios en blanco entre cada elemento de la sección
> `Siglas y Acrónimos`.

## Respuesta de Codex

Se mantuvo en cero el espaciado anterior y posterior de los párrafos y se
eliminó adicionalmente el relleno superior e inferior de las 22 celdas de la
tabla interior. La numeración, textos, tipografía, anchos y alineación vertical
se conservaron.

## Registro de progreso

1. Se revisó la imagen y la implementación vigente de Siglas y Acrónimos.
2. Se confirmó que los párrafos ya tenían espaciado anterior y posterior cero.
3. Se identificó el relleno vertical de las celdas interiores como la
   separación restante.
4. Se estableció relleno superior e inferior en cero para las columnas de
   número y descripción de los once elementos.
5. La prueba fue ampliada para verificar 44 propiedades de relleno.
6. Todas las pruebas visuales y funcionales relacionadas pasaron.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaSiglas.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Once siglas en orden fijo.
- Espaciado de párrafo anterior y posterior en cero.
- Relleno superior e inferior de ambas columnas en cero.
- Regresiones de Cierre, Temas, Agenda, Word, Validador y Participantes.
- Validación sintáctica y `git diff --check`.

## Pendientes

- Confirmar visualmente la sección compacta en un acta generada.

# Cambio 0033
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Eliminar permanentemente el Google Docs temporal después de confirmar la
> creación correcta del archivo `.docx`.

## Respuesta de Codex

`Word.gs` elimina permanentemente mediante Drive API exclusivamente el Google
Docs temporal cuyo identificador fue devuelto por `generarDocumentoActa`. La
operación se ejecuta después de crear y verificar el DOCX. Nunca se selecciona
el objetivo por nombre ni se elimina el documento fuente. Si la eliminación
falla, Word devuelve `WORD_ELIMINACION_ERROR` y el procesamiento no se marca
como completado.

## Registro de progreso

1. Se informó que la eliminación permanente no es recuperable.
2. El usuario autorizó expresamente la eliminación permanente.
3. Se revisó el orden real entre generación del acta, exportación Word,
   verificación y confirmación de procesamiento.
4. Se incorporó `DELETE /drive/v3/files/{fileId}` usando el mismo token de
   Drive ya autorizado para la exportación.
5. La eliminación ocurre después de `_wordVerificarArchivo()` y antes de que
   `exportarDocumentoWord()` devuelva éxito.
6. Se agregó el código controlado `WORD_ELIMINACION_ERROR`.
7. La prueba verifica el orden de operaciones, la URL exacta y el rechazo de
   una eliminación HTTP fallida.
8. Todas las pruebas y regresiones finalizaron correctamente.

## Archivos modificados

- AppsScript/Word.gs
- Pruebas/WordExportacion.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- Documentacion/Flujo_Procesamiento.md
- Documentacion/Riesgos_Tecnicos.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Exportación y creación del DOCX antes de eliminar.
- Verificación del DOCX antes de eliminar.
- `DELETE` dirigido al identificador exacto del temporal.
- Respuesta HTTP 204 aceptada.
- Respuesta HTTP 500 rechazada sin reportar éxito.
- Regresiones de Siglas, Cierre, Temas, Agenda, Validador y Participantes.
- Validación sintáctica y `git diff --check`.

## Pendientes

- Confirmar que el siguiente flujo real crea el DOCX y elimina el Google Docs
  temporal sin afectar el documento fuente.

## Despliegue y verificación

1. El usuario autorizó expresamente desplegar los Cambios 0032 y 0033.
2. Se descargaron y preservaron los 17 archivos remotos, incluido
   `Inicializar.js`.
3. Se incorporaron exclusivamente `Acta.js` y `Word.js` desde los módulos
   locales probados.
4. `clasp push --force` publicó correctamente los 17 archivos.
5. Una descarga independiente confirmó 17 archivos, `Inicializar.js` y
   coincidencia SHA-256 de Acta y Word.

# Cambio 0034
Fecha: 2026-08-02
Autor: Codex

## Solicitud del usuario

> Corregir y desplegar la cabecera para crear una columna izquierda, agrupar
> visualmente las tres primeras filas y colocar allí el logotipo institucional,
> conforme al diseño proporcionado.

## Respuesta de Codex

La cabecera conserva una tabla exterior con columna izquierda de 103 puntos
para el logotipo y una tabla interior derecha con tres filas: Título/Código,
Versión y Metodología/Fecha. Se eliminó todo relleno de la celda del logotipo,
se mantuvo la imagen centrada en 100 por 32 puntos y se verificó que no quede
una franja vacía antes del título. Proyecto y Director permanecen debajo.

## Registro de progreso

1. Se comparó el diseño deseado con la estructura existente.
2. Se confirmó que la agrupación vertical debe representarse mediante una
   tabla interior, porque `DocumentApp` no permite asignar `rowSpan`.
3. Se estableció relleno cero en los cuatro lados de la celda del logotipo.
4. Se agregó una prueba integral de cabecera con tabla exterior e interior.
5. La prueba verifica anchos 103/322 y 190/56/76, imagen 100x32, fecha,
   controles y filas inferiores.
6. Todas las pruebas y regresiones finalizaron correctamente.

## Archivos modificados

- AppsScript/Acta.gs
- Pruebas/ActaCabecera.test.js
- Documentacion/Arquitectura.md
- Documentacion/Decisiones_Arquitectonicas.md
- docs/CODEX_BITACORA.md

## Pruebas realizadas

- Columna lateral del logotipo sin relleno.
- Logotipo centrado de 100 por 32 puntos.
- Tabla derecha con tres filas y anchos institucionales.
- Ausencia de párrafo vacío alrededor de la tabla interna.
- Proyecto y Director debajo de la cabecera.
- Regresiones de Word, Siglas, Cierre, Temas, Agenda, Validador y
  Participantes.
- Validación sintáctica y `git diff --check`.

## Pendientes

- Confirmar visualmente la cabecera en un documento generado.

## Despliegue y verificación

1. Se preservaron los 17 archivos del proyecto remoto, incluido
   `Inicializar.js`.
2. Se publicó `Acta.js` mediante `clasp push --force` junto con el conjunto
   remoto preservado.
3. La primera comprobación independiente usó por error la opción no compatible
   `--rootDir`; no modificó el proyecto remoto.
4. Se repitió la descarga desde una carpeta temporal con la sintaxis compatible.
5. La descarga confirmó 17 archivos, la presencia de `Inicializar.js` y la
   coincidencia exacta del SHA-256 local y remoto de `Acta`:
   `1B19C987F600A84D450DDE5C56D1FFE0776B69EC251E54204357A4CBA10F82B0`.
