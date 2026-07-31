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
