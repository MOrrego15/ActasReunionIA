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
