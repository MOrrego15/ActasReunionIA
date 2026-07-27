# Arquitectura inicial de ActasReunionIA

## 1. Propósito

Este documento define la arquitectura lógica inicial de ActasReunionIA. El sistema automatizará la generación de actas institucionales a partir de notas creadas por Gemini en Google Meet y almacenadas en Google Docs.

La presente fase es exclusivamente arquitectónica. No incluye implementación funcional, llamadas reales a OpenAI ni gestión de credenciales.

## 2. Alcance

La solución deberá:

- localizar el documento más reciente de Gemini que no haya sido procesado;
- procesar como máximo un documento por ejecución;
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
4. **Procesamiento unitario:** cada ejecución seleccionará como máximo un documento.
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
          +--> Generación de Google Docs
          +--> Exportación DOCX
          +--> Organización mensual -----> Google Drive
          +--> Auditoría y errores
```

Google Apps Script será la plataforma principal. Google Drive y Google Docs actuarán como fuentes y destinos documentales. OpenAI será un servicio externo de estructuración de contenido.

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
| Generador de actas | Crear y completar el documento Google Docs conforme a la estructura validada. |
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

### 6.5 RespuestaActa

Representación estructurada de la respuesta de OpenAI. Su esquema concreto dependerá de los campos de la plantilla institucional, todavía no suministrada.

### 6.6 ResultadoEjecucion

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
- Está pendiente definir el esquema de salida esperado de OpenAI.
- Está pendiente definir la política de reintentos, recuperación y limpieza de salidas parciales.
- Está pendiente definir el formato exacto de la carpeta mensual.
- Está pendiente definir retención, acceso y tratamiento de datos personales.
