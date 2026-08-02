# Arquitectura inicial de ActasReunionIA

## 1. Propósito

Este documento define la arquitectura lógica inicial de ActasReunionIA. El sistema automatizará la generación de actas institucionales a partir de notas creadas por Gemini en Google Meet y almacenadas en Google Docs.

La presente fase es exclusivamente arquitectónica. No incluye implementación funcional, llamadas reales a OpenAI ni gestión de credenciales.

## 2. Alcance

La solución deberá:

- localizar el documento más reciente de Gemini que no haya sido procesado;
- procesar secuencialmente los documentos fuente obtenidos en la ejecución;
- evitar el reprocesamiento de documentos anteriores;
- conservar un correlativo de actas que no se reinicie;
- convertir las notas y una plantilla institucional en contenido estructurado mediante OpenAI;
- generar un documento en Google Docs y exportarlo a formato `.docx`;
- organizar los entregables en carpetas mensuales;
- registrar resultados y errores de ejecución.

Quedan fuera de esta fase la interfaz de usuario, la lógica concreta de transformación, la selección definitiva del modelo de OpenAI y la implementación de los módulos.

## 3. Principios arquitectónicos

1. **Responsabilidad única:** cada módulo atenderá una función claramente delimitada.
2. **Configuración externa:** identificadores, parámetros operativos y secretos no estarán incrustados en el código.
3. **Idempotencia:** un documento confirmado como procesado no deberá volver a generar un acta.
4. **Procesamiento secuencial:** cada documento se procesa de forma aislada y
   un fallo individual no impide continuar con los siguientes.
5. **Persistencia controlada:** el correlativo y el registro de procesados serán estado durable.
6. **Trazabilidad:** cada ejecución deberá poder relacionarse con su documento de entrada, número de acta y archivos de salida.
7. **Fallo seguro:** un error no deberá marcar como procesado un documento cuya salida no haya sido generada satisfactoriamente.
8. **Mantenibilidad:** la integración con servicios externos se aislará del flujo de negocio.

## 4. Vista lógica

```text
Disparador de Apps Script
          |
          v
Orquestador principal
          |
          +--> Configuración
          +--> Control de concurrencia
          +--> Búsqueda de pendientes ----> Google Drive / Google Docs
          +--> Control de procesados
          +--> Gestión de correlativo
          +--> Plantilla y construcción del prompt
          +--> Cliente OpenAI -----------> API de OpenAI
          +--> Validación de respuesta
          +--> Generación y formato de Google Docs
          +--> Exportación DOCX
          +--> Organización mensual -----> Google Drive
          +--> Auditoría y errores
```

Google Apps Script será la plataforma principal. Google Drive y Google Docs actuarán como fuentes y destinos documentales. OpenAI será un servicio externo de estructuración de contenido.

### 4.1 Flujo entre validación y generación documental

La respuesta estructurada de OpenAI pasará directamente del módulo de
validación al generador documental. No existirá un módulo intermedio de
generación o transformación de datos:

```text
OpenAI.gs
    |
    v
ValidadorRespuesta.gs
    |
    | RespuestaActaValidada
    v
Personas.gs ------> ParticipanteActa[]
    |
    v
Acta.gs <--------- DatosEmisionActa
    |
    | Documento Google Docs con formato institucional
    v
Word.gs
```

`Main.gs` entregará a `Acta.gs` la respuesta validada y los datos de emisión
previamente resueltos. Esta entrega no implica reinterpretar, reorganizar ni
volver a validar el contenido.

## 5. Módulos y responsabilidades

| Módulo lógico | Responsabilidad |
|---|---|
| Orquestador | Coordinar una ejecución completa, aplicar el orden de pasos y detener el flujo ante errores. |
| Configuración | Leer, validar y exponer parámetros no secretos y secretos desde sus ubicaciones autorizadas. |
| Control de concurrencia | Impedir que ejecuciones simultáneas consuman el mismo documento o correlativo. |
| Acceso a Drive | Consultar carpetas, localizar archivos, crear carpetas mensuales y administrar archivos de salida. |
| Lector de documentos | Extraer el contenido del Google Docs seleccionado y de la plantilla. |
| Selector de pendientes | Filtrar documentos elegibles, excluir los procesados y escoger únicamente el más reciente. |
| Registro de procesados | Consultar y persistir la identidad del documento procesado y su resultado asociado. |
| Gestor de correlativo | Obtener y reservar el siguiente número de acta sin reinicios ni duplicidades. |
| Constructor de prompt | Combinar instrucciones, plantilla y notas sin realizar la llamada externa. |
| Cliente OpenAI | Encapsular autenticación, solicitud, tiempo de espera y tratamiento de respuestas de la API. |
| Validador de respuesta | Verificar presencia, formato y consistencia mínima de la respuesta antes de generar archivos. |
| Catálogo de personas (`Personas.gs`) | Resolver nombres documentales, cargos y unidades desde la hoja `persona`; registrar con Unidad `UCP` los participantes aún no catalogados. |
| Generador de actas (`Acta.gs`) | Recibir `RespuestaActaValidada` y `DatosEmisionActa`, generar el documento Google Docs y aplicar el formato institucional. No reinterpreta ni vuelve a validar la respuesta externa. |
| Exportador Word | Exportar el documento generado al formato `.docx`. |
| Organizador mensual | Resolver o crear la carpeta mensual y aplicar la nomenclatura del entregable. |
| Auditoría | Registrar inicio, fin, estado, identificadores, número correlativo y detalle de errores. |
| Utilidades | Proveer funciones transversales de fecha, nombre de archivo, normalización y validaciones simples. |

## 6. Entidades y estructuras de datos

### 6.1 DocumentoFuente

| Campo | Descripción |
|---|---|
| `idDocumento` | Identificador estable del Google Docs de Gemini. |
| `nombre` | Nombre visible del documento. |
| `fechaCreacion` | Fecha de creación informada por Drive. |
| `fechaModificacion` | Fecha de última modificación usada para ordenar, si se adopta ese criterio. |
| `url` | Referencia operativa al documento. |
| `contenido` | Texto extraído para el procesamiento. |

El criterio definitivo para determinar cuál es el documento “último” —creación o modificación— queda pendiente.

### 6.2 RegistroProcesamiento

| Campo | Descripción |
|---|---|
| `idDocumentoFuente` | Clave para impedir duplicidades. |
| `estado` | Estado de la ejecución asociada. |
| `fechaInicio` | Inicio del intento. |
| `fechaFin` | Finalización del intento. |
| `numeroActa` | Correlativo asignado. |
| `idDocumentoGoogle` | Identificador del acta generada en Google Docs. |
| `idArchivoDocx` | Identificador del entregable Word. |
| `nombreArchivo` | Nombre final del archivo. |
| `idEjecucion` | Identificador único de trazabilidad. |
| `detalleError` | Información sanitizada del error, cuando corresponda. |

Estados iniciales recomendados: `INICIADO`, `GENERADO`, `COMPLETADO` y `ERROR`. La política de reintentos para estados incompletos queda pendiente.

### 6.3 EstadoCorrelativo

| Campo | Descripción |
|---|---|
| `ultimoNumero` | Último número confirmado o reservado, según la estrategia adoptada. |
| `fechaActualizacion` | Fecha de la última modificación. |
| `idEjecucion` | Ejecución responsable de la modificación. |

### 6.4 SolicitudActa

Estructura interna que reúne el contenido de las notas, el contenido o referencia de la plantilla, metadatos del documento fuente, fecha del acta y número correlativo.

### 6.5 RespuestaActaValidada

Representación estructurada de la respuesta de OpenAI después de ser aceptada
por `ValidadorRespuesta.gs`. Su esquema concreto se define en la sección 11.1
y constituye el contrato directo de entrada de `Acta.gs`.

`Acta.gs` consumirá este contrato sin reinterpretarlo, corregirlo, completarlo
ni volver a validar el contrato externo.

### 6.6 DatosEmisionActa

Metadatos confiables resueltos por el sistema y entregados a `Acta.gs`
separadamente de la respuesta externa:

```text
DatosEmisionActa = {
  correlativo: number,
  carpetaDestinoId: string
}
```

El correlativo deberá llegar previamente reservado y validado. `Acta.gs` no lo
generará, incrementará, reservará ni consultará directamente a
`Correlativo.gs`.

### 6.7 Contrato de entrada de Acta.gs

```text
generarDocumentoActa(
  respuestaActaValidada,
  datosEmisionActa,
  participantesActa,
  contexto
)
```

Responsabilidades de `Acta.gs`:

- recibir `RespuestaActaValidada`;
- recibir `DatosEmisionActa`;
- recibir los participantes resueltos por `Personas.gs`;
- generar el documento Google Docs;
- aplicar el formato institucional.

Responsabilidades excluidas de `Acta.gs`:

- reinterpretar la respuesta de OpenAI;
- volver a validar el contrato externo;
- corregir o completar contenido ausente;
- generar correlativos;
- consultar directamente `Correlativo.gs`;
- acceder a OpenAI;
- acceder a Gemini;
- coordinar el flujo general;
- exportar el documento a `.docx`.

`contexto` contiene exclusivamente `idEjecucion` como cadena no vacía y no
forma parte del contenido funcional del acta.

### 6.8 ResultadoEjecucion

Resumen de la ejecución: identificador, estado, documento fuente, número de acta, salidas creadas, fechas y error sanitizado.

## 7. Configuración requerida

### 7.1 Propiedades operativas no secretas

- identificador de la carpeta que recibe las notas de Gemini;
- identificador del documento o archivo de plantilla institucional;
- identificador de la carpeta raíz de entregables;
- zona horaria institucional;
- formato de carpeta mensual;
- prefijo o sufijo fijo del nombre del archivo, incluido `Daily`;
- modelo de OpenAI autorizado;
- versión del prompt;
- límites operativos de longitud y tiempo de espera;
- criterio de ordenación para determinar el documento más reciente;
- ubicación o mecanismo del registro de auditoría y procesados.

### 7.2 Propiedades secretas

- clave de API de OpenAI.

La clave deberá almacenarse en las propiedades seguras aplicables de Apps Script y nunca en Git, archivos de configuración versionados, registros o mensajes de error.

### 7.3 Propiedades derivadas

- nombre `DD.MM.AAAA-NNN-Daily.docx`;
- ruta de la carpeta mensual;
- siguiente número correlativo con relleno mínimo de tres dígitos.

El comportamiento cuando el correlativo supere `999` no está definido; se recomienda no truncarlo.

## 8. Dependencias

- Google Apps Script y sus servicios de propiedades, bloqueo y utilidades;
- Google Drive;
- Google Docs;
- API de exportación o servicio de Drive necesario para obtener `.docx`;
- API de OpenAI;
- permisos OAuth concedidos al proyecto de Apps Script;
- plantilla institucional y carpeta de notas disponibles para la cuenta ejecutora.

## 9. Supuestos y pendientes

- Las notas de Gemini se almacenarán como Google Docs en una carpeta identificable.
- La cuenta ejecutora tendrá permisos sobre las fuentes, la plantilla y los destinos.
- La plantilla institucional será accesible y tendrá una estructura suficientemente estable.
- Está pendiente definir el criterio exacto de elegibilidad de un documento de Gemini.
- Está pendiente decidir dónde persistir el registro de procesados y la auditoría.
- Está pendiente definir la política de reintentos, recuperación y limpieza de salidas parciales.
- Está pendiente definir el formato exacto de la carpeta mensual.
- Está pendiente definir retención, acceso y tratamiento de datos personales.

## 10. Eliminación del módulo GenracionActas.gs

### 10.1 Decisión

`GenracionActas.gs` queda eliminado definitivamente del plan de
implementación. No se creará el archivo ni se reservará una fase de desarrollo
para este módulo.

El análisis de contratos determinó que más del noventa por ciento del modelo
propuesto sería una copia directa de `RespuestaActaValidada`. La única
incorporación adicional identificada, el correlativo, se entregará mediante
`DatosEmisionActa`. Mantener un módulo intermedio introduciría duplicación de
contratos, validaciones potencialmente repetidas y una transformación sin
responsabilidad funcional suficiente.

### 10.2 Nuevo flujo entre módulos

El flujo aprobado para esta parte del proceso será:

1. `OpenAI.gs` devuelve la respuesta técnica.
2. `ValidadorRespuesta.gs` valida el contrato externo sin corregirlo ni
   transformarlo.
3. `Personas.gs` resuelve los participantes desde la hoja `persona` y registra
   los nombres aún no catalogados.
4. `Correlativo.gs` proporciona el correlativo mediante la coordinación de
   `Main.gs`.
5. `Main.gs` entrega `RespuestaActaValidada`, `DatosEmisionActa`, los
   participantes resueltos y el contexto técnico a `Acta.gs`.
6. `Acta.gs` genera el documento Google Docs y aplica el formato institucional.
7. `Word.gs` exporta y verifica el archivo `.docx`.

### 10.3 Impacto sobre las fases restantes

- Se elimina cualquier fase de diseño o implementación de
  `GenracionActas.gs`.
- La definición de `RespuestaActaValidada` deberá completarse durante el diseño
  de `ValidadorRespuesta.gs`, de acuerdo con la plantilla institucional.
- El diseño de `Acta.gs` deberá adoptar la firma
  `generarDocumentoActa(respuestaActaValidada, datosEmisionActa,
  participantesActa, contexto)`.
- Las pruebas de `Acta.gs` deberán comprobar que el contenido validado se
  conserva sin reinterpretación y que el correlativo procede exclusivamente de
  `DatosEmisionActa`.
- `Main.gs` deberá coordinar la entrega de ambos contratos sin incorporar
  lógica de transformación.
- `Correlativo.gs` conservará íntegramente la responsabilidad de generar,
  reservar y persistir el correlativo.

## 11. Núcleo de transformación estructurada

La secuencia aprobada para transformar contenido fuente en un documento es:

```text
construirPromptActa(contenidoFuente, contexto)
  -> solicitarActaEstructurada(mensajes, contexto)
  -> validarRespuestaActa(respuestaTexto, contexto)
  -> listarDocumentosGoogleVinculados(documentoFuente, contexto)
  -> leerContenidosDocumentosGoogle(documentosVinculados, contexto)
  -> combinar(documentoFuenteActual, documentosVinculados)
  -> seleccionarTranscripcionAsociada(documentoFuente, documentos, contexto)
  -> extraerParticipantesConfirmados(contenidoTranscripcion, contexto)
  -> resolverParticipantesActa(repositorioProcesadosId, participantes, contexto)
  -> generarDocumentoActa(respuestaActaValidada, datosEmisionActa,
       participantesActa, contexto)
```

`Prompt.gs` construye mensajes sin invocar servicios; `OpenAI.gs` realiza la
comunicación técnica mediante Chat Completions y Structured Outputs;
`ValidadorRespuesta.gs` extrae, valida y normaliza el único objeto JSON; y
`Acta.gs` crea, ubica y verifica el Google Docs sin reinterpretar contenido.

### 11.1 RespuestaActaValidada

```text
{
  titulo: string,
  fechaReunion: string,
  horaInicio: string,
  horaFin: string,
  lugar: string,
  organizador: string,
  participantes: [{ nombre: string, cargo: string }],
  agenda: [string],
  resumenEjecutivo: string,
  acuerdos: [{
    numero: number,
    descripcion: string,
    responsable: string
  }],
  tareas: [{
    numero: number,
    descripcion: string,
    responsable: string,
    fechaCompromiso: string
  }],
  observaciones: string
}
```

Los campos `titulo`, `fechaReunion` y `resumenEjecutivo` son textos
obligatorios no vacíos. Los demás textos pueden normalizarse a cadena vacía
cuando están ausentes. Las listas ausentes se normalizan a arreglos vacíos;
un valor `null` siempre es inválido. Los acuerdos y tareas se numeran de forma
entera, positiva y secuencial desde uno. No se admiten propiedades adicionales,
HTML, Markdown, cercos de código ni JSON incrustado en valores textuales.

La lista `participantes` validada de OpenAI es provisional y será reemplazada
por el sistema antes de consultar `Personas.gs`. Drive leerá exclusivamente
el documento fuente actual y los Google Docs enlazados desde él mediante
hipervínculos de texto o chips inteligentes; no incorporará otros documentos de
la carpeta, porque pueden pertenecer a reuniones diferentes. La lectura y la
búsqueda de vínculos recorrerán todas las pestañas principales y anidadas del
Google Docs. Los candidatos se deduplicarán por su identificador estable.
`Drive.gs` descartará además los vínculos cuyo ID coincida con el documento
fuente, porque representan otra pestaña o sección del mismo Google Docs y su
contenido ya fue incorporado al leer todas las pestañas.
`Gemini.gs` priorizará el propio documento fuente cuando su contenido tenga
estructura de transcripción; en caso contrario seleccionará una única referencia
cuyo nombre contenga `Transcripción` o `Transcript`, sin exigir coincidencia
del nombre base. Si esa referencia no es única, aplicará el criterio estructural
de hablantes distintos, etiquetas repetidas y marcas conversacionales. Luego
extraerá sus etiquetas `Nombre: intervención` únicamente del bloque posterior
al título de `Transcripción` y a su primera marca de tiempo. El contenido
anterior, incluidos encabezados temáticos con dos puntos, quedará excluido. Si
una transcripción simple no contiene ambas referencias, se conservará el
análisis completo como compatibilidad controlada. Los nombres se deduplicarán y
el organizador se añadirá solo si aparece identificado
explícitamente. Un nombre que
solo aparezca dentro de una intervención no acreditará asistencia. Al no
existir un informe de asistencia, los asistentes silenciosos no pueden
confirmarse y se omitirán. Si la transcripción asociada no existe o no es
única, el procesamiento fallará de forma controlada.

### 11.2 DatosEmisionActa y documento generado

```text
DatosEmisionActa = {
  correlativo: number,
  carpetaDestinoId: string
}
```

El nombre del Google Docs será `ACTA-` seguido por seis dígitos. Para conservar
exactamente esta convención sin truncar, `Acta.gs` admite correlativos entre 1
y 999999. El formato inicial es funcional: título centrado y en negrita,
encabezados en negrita y tablas para datos generales, participantes, agenda,
acuerdos y tareas. La Agenda usa una fila institucional con etiqueta ploma y el
valor fijo `Dayli – reunión de seguimiento`; no consume la lista variable
producida por OpenAI. Las etapas visuales restantes se incorporan de forma
incremental.

La sección `Siglas y Acrónimos` se ubica inmediatamente después de Agenda.
Usa una celda lateral ploma y una tabla interior sin bordes con numeración del
1 al 11. Su catálogo es fijo y no se extrae de OpenAI ni del contenido de la
reunión.

La sección `TEMAS TRATADOS:` se ubica después de Siglas y Acrónimos y usa
directamente la lista validada `acuerdos`. Cada acuerdo conserva su número y
descripción en una tabla interior sin bordes. Los párrafos usan espaciado
anterior y posterior en cero, y las celdas usan relleno vertical en cero, para
evitar líneas o espacios vacíos entre temas.
La sección sustituye la presentación independiente de `Resumen Ejecutivo`.

El cierre documental combina las Fases 7 y 8 en una tabla institucional:
`Riesgos o problemas` permanece vacío; `Acuerdos` usa las tareas validadas en
un encabezado plomo y viñetas; y `Próxima reunión` muestra el siguiente día de lunes a viernes a
partir de `fechaReunion`, omitiendo sábados y domingos, con mes en español.
Una tarea con responsable se presenta
como `Responsable: descripción`; cuando el responsable está vacío se presenta
solo la descripción, sin prefijo ni dos puntos. La sección de observaciones no
se representa en el documento. Tanto el encabezado `Acuerdos` como su lista de
tareas fusionan las dos columnas y fijan el ancho total institucional para
ocupar toda la tabla.

### 11.3 Decisiones técnicas inferidas

- Se usa `https://api.openai.com/v1/chat/completions` porque el contrato entre
  Prompt y OpenAI ya está expresado como mensajes `system` y `user`.
- Se solicita Structured Outputs con `response_format` de tipo `json_schema` y
  validación estricta. Un modelo configurado que no lo soporte produce un error
  HTTP controlado; no se cambia el modelo ni se aplica fallback.
- Apps Script no ofrece un parámetro documentado de timeout para
  `UrlFetchApp.fetch`; se usa el límite administrado por la plataforma.
- La extracción tolerante acepta texto o cercos alrededor de un único objeto
  JSON, pero rechaza respuestas con múltiples objetos de nivel superior y
  objetos contenidos en un arreglo raíz o envolvente.
- Si ocurre un fallo después de crear el Google Docs, puede quedar un archivo
  parcial en Drive. `Acta.gs` no lo elimina automáticamente; la conciliación o
  recuperación deberá resolverse durante la integración del flujo.
- Ningún módulo registra contenido fuente, prompts, respuestas, datos del acta,
  identificadores operativos, credenciales o excepciones originales.
- `Word.gs`, `Drive.gs` y `Procesados.gs` no modifican sus responsabilidades
  por esta decisión.
- La secuencia global se simplifica al eliminar un contrato y un punto de fallo
  intermedio.

## 12. Integración End-to-End

### 12.1 Flujo coordinado

`Main.gs` expone únicamente `ejecutarGeneracionActas({})`, genera un UUID común
y coordina, sin duplicar responsabilidades, la siguiente secuencia:

```text
Config.gs
  -> Drive.gs: obtenerDocumentosFuente
  -> Procesados.gs: consultarEstadoProcesamiento
  -> Drive.gs: leerContenidoDocumentoFuente
  -> Prompt.gs
  -> OpenAI.gs
  -> ValidadorRespuesta.gs
  -> Personas.gs: resolverParticipantesActa
  -> Correlativo.gs
  -> Procesados.gs: registrarInicioProcesamiento
  -> Acta.gs
  -> Word.gs
  -> Procesados.gs: marcarProcesamientoCompletado
```

Los documentos se conservan en el orden determinista entregado por `Drive.gs`.
`Main.gs` no modifica la colección, no accede directamente a servicios de
Google y no devuelve identificadores documentales ni contenido institucional.
`Gemini.gs` permanece reservado para criterios funcionales de selección que
se definan posteriormente; la obtención técnica vigente procede de Drive.

### 12.2 Configuración de integración

Se incorpora la Script Property obligatoria `REPOSITORIO_PROCESADOS_ID`,
expuesta internamente como `configuracion.procesados.repositorioId`. Identifica
la hoja de cálculo dedicada cuyo esquema administra `Procesados.gs`.

Mientras no exista una regla aprobada de carpetas mensuales, la alternativa
mínima es usar `configuracion.actas.carpetaRaizId` como destino tanto del Google
Docs como del DOCX. No se crean carpetas ni se infieren identificadores.

### 12.3 Exportación Word

`Word.gs` expone:

```text
exportarDocumentoWord(idDocumentoGoogle, datosExportacion, contexto)
```

La exportación usa `DriveApp.File.getAs(MimeType.MICROSOFT_WORD)`, sin construir
solicitudes HTTP ni administrar manualmente el token OAuth. El contenido se
crea en Drive con MIME DOCX y se verifica por identificador, nombre, MIME,
papelera y carpeta padre.

La fecha del nombre acepta exclusivamente `AAAA-MM-DD`, `DD/MM/AAAA` o
`DD.MM.AAAA`, con validación de calendario. Una fecha distinta produce
`WORD_FECHA_INVALIDA`; no se usa la fecha actual como sustitución. El
correlativo tiene un mínimo de tres dígitos y nunca se trunca.

### 12.4 Idempotencia y estados

- `PROCESADO` se omite antes de leer el contenido.
- `PENDIENTE` puede continuar hacia la transformación.
- `EN_PROCESO` y `ERROR` no se reintentan automáticamente.
- Tras reservar el correlativo, Main reclama la fuente mediante
  `registrarInicioProcesamiento` antes de crear artefactos.
- Solo después de verificar el DOCX se invoca
  `marcarProcesamientoCompletado`.

### 12.5 Fallos parciales

No existe rollback distribuido. Un correlativo reservado no se revierte ni se
reutiliza. Los Google Docs y DOCX parciales no se eliminan automáticamente. Si
falla Acta o Word después de reclamar la fuente, Main intenta registrar el
estado `ERROR` con el código técnico y los identificadores parciales admitidos
por `Procesados.gs`; un fallo de esta conciliación no sustituye el error
original. Si falla el registro final, los artefactos permanecen y el resultado
individual es `ERROR` en la etapa `PROCESADOS`.

### 12.6 Primera prueba E2E controlada

El procedimiento de preparación, ejecución manual y verificación de la primera
prueba real se define en `Documentacion/Prueba_E2E_Controlada.md`.

El flujo productivo conserva el procesamiento secuencial de todos los
candidatos elegibles. Como medida de control operacional, la primera prueba
real debe utilizar una carpeta fuente que contenga exactamente un documento
elegible.
