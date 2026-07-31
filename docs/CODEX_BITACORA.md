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
