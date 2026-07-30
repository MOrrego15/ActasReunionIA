# Prueba E2E controlada

## 1. Propósito

Este procedimiento prepara la primera validación real y controlada del flujo integrado de ActasReunionIA, desde la obtención de un documento fuente hasta la creación del acta en Google Docs, su exportación a Microsoft Word y el registro terminal del procesamiento.

La ejecución no forma parte de esta fase documental. Debe realizarse posteriormente por una persona autorizada, una vez completadas y verificadas todas las precondiciones.

Aunque el flujo productivo procesa secuencialmente todos los candidatos elegibles, la primera prueba real debe realizarse con una carpeta fuente que contenga exactamente un documento elegible. Esta limitación reduce el alcance del diagnóstico inicial sin modificar el comportamiento productivo de `Main.gs`.

## 2. Advertencias operativas

- La reserva del correlativo es definitiva una vez persistida y verificada.
- Un correlativo reservado no se reutiliza aunque una fase posterior falle; se permiten huecos.
- El documento fuente no se mueve, renombra ni elimina como parte del flujo.
- Los estados `ERROR` y `EN_PROCESO` no se reintentan automáticamente.
- Pueden existir artefactos parciales si el proceso falla después de crear el documento Google Docs o el archivo DOCX.
- No debe repetirse una ejecución fallida hasta identificar el estado persistido y conciliar manualmente los artefactos creados.
- No deben copiarse claves, identificadores reales, contenidos documentales ni datos personales en evidencias, incidencias o registros manuales.

## 3. Configuración requerida

La configuración operativa debe almacenarse exclusivamente en Script Properties. No debe incorporarse al repositorio.

| Propiedad | Obligatoriedad efectiva | Formato y validación | Uso | Ejemplo ficticio no utilizable |
|---|---|---|---|---|
| `CARPETA_NOTAS_GEMINI_ID` | Obligatoria | Cadena no vacía; se recorta al leerla | Carpeta fuente de notas candidatas | `ID_FICTICIO_CARPETA_FUENTE` |
| `PLANTILLA_ACTA_ID` | Obligatoria para que `Config.gs` acepte la configuración | Cadena no vacía; se recorta al leerla | Identificador de la plantilla institucional; su consumo funcional permanece sujeto al flujo vigente | `ID_FICTICIO_PLANTILLA` |
| `CARPETA_RAIZ_ACTAS_ID` | Obligatoria | Cadena no vacía; se recorta al leerla | Carpeta de destino usada actualmente para el Google Docs y el DOCX | `ID_FICTICIO_CARPETA_DESTINO` |
| `REPOSITORIO_PROCESADOS_ID` | Obligatoria | Cadena no vacía; se recorta al leerla | Spreadsheet dedicado al control de procesamiento | `ID_FICTICIO_REPOSITORIO` |
| `OPENAI_API_KEY` | Obligatoria | Cadena no vacía; se mantiene solo en memoria y no se registra | Autenticación de la solicitud a OpenAI | `[CLAVE_FICTICIA_NO_UTILIZABLE]` |
| `OPENAI_MODELO` | Opcional en `Config.gs`, pero obligatorio para el flujo E2E actual | Cadena no vacía cuando existe; sin valor predeterminado ni lista fija | Modelo autorizado que debe ser compatible con la respuesta estructurada requerida | `MODELO_COMPATIBLE_POR_CONFIRMAR` |
| `PROMPT_VERSION` | Obligatoria para que `Config.gs` acepte la configuración | Cadena no vacía; se recorta al leerla | Identificación de la versión del prompt | `VERSION_FICTICIA` |

La zona horaria no es una Script Property. Su única fuente de verdad es `AppsScript/appsscript.json`, con el valor institucional `America/Lima`.

Antes de ejecutar, debe comprobarse que el modelo configurado está vigente, admite el contrato solicitado por `OpenAI.gs` y es compatible con Structured Outputs. No debe suponerse compatibilidad a partir del nombre del modelo.

## 4. Repositorio de procesados

Debe existir previamente un archivo de Google Sheets accesible mediante el valor de `REPOSITORIO_PROCESADOS_ID`.

El archivo debe contener una hoja denominada exactamente `Procesados`. El módulo no crea ni repara automáticamente el Spreadsheet, la hoja o los encabezados.

La primera fila debe contener exactamente estas columnas, en este orden y sin columnas adicionales dentro del esquema utilizado:

1. `versionEsquema`
2. `idDocumentoFuente`
3. `estado`
4. `correlativo`
5. `idEjecucion`
6. `fechaInicio`
7. `fechaActualizacion`
8. `idDocumentoGoogle`
9. `idArchivoDocx`
10. `codigoError`

Reglas:

- La versión aprobada es `1`.
- Los estados persistidos permitidos son `EN_PROCESO`, `PROCESADO` y `ERROR`.
- `PENDIENTE` es un estado derivado: significa que no existe una fila para el `idDocumentoFuente`.
- La identidad se determina exclusivamente por coincidencia exacta de `idDocumentoFuente`.
- Una hoja que contenga únicamente los encabezados correctos es válida y representa que todas las fuentes son inicialmente pendientes.
- Una hoja inexistente produce `PROCESADOS_REPOSITORIO_NO_DISPONIBLE`.
- Una hoja vacía sin encabezados, o con cantidad, nombres u orden incompatibles, produce `PROCESADOS_ESQUEMA_INVALIDO`.
- Más de una fila para la misma fuente produce `PROCESADOS_REGISTRO_DUPLICADO`.
- Una fila que incumpla el esquema o las invariantes del estado produce `PROCESADOS_REGISTRO_CORRUPTO`.

## 5. Autorizaciones probables

El manifiesto no declara `oauthScopes`; Apps Script deberá detectar automáticamente los alcances requeridos por los servicios utilizados. La primera ejecución solicitará autorización según el código efectivo y la cuenta ejecutora.

Deben revisarse, como mínimo, permisos equivalentes para:

- lectura, creación y administración de archivos y carpetas mediante Drive:
  `https://www.googleapis.com/auth/drive`;
- lectura y creación de documentos mediante Google Docs:
  `https://www.googleapis.com/auth/documents`;
- lectura y escritura del Spreadsheet de procesados:
  `https://www.googleapis.com/auth/spreadsheets`;
- llamadas a servicios externos mediante `UrlFetchApp`:
  `https://www.googleapis.com/auth/script.external_request`;
- exportación autenticada del documento mediante el token de la ejecución; el
  token debe incluir el alcance de Drive requerido por la llamada de
  exportación;
- acceso al almacenamiento de propiedades del script. La documentación de
  `PropertiesService` no identifica un consentimiento OAuth independiente para
  este uso; debe comprobarse el conjunto finalmente detectado por Apps Script.

Esta lista es una previsión técnica, no una declaración de manifiesto. Antes de
la prueba debe revisarse el resumen de autorización generado por el proyecto;
no se agregarán `oauthScopes` explícitos en esta fase.

La cuenta ejecutora debe tener acceso efectivo a la carpeta fuente, la plantilla, la carpeta de destino y el Spreadsheet de procesados. Si se usan unidades compartidas, debe confirmarse que las operaciones implementadas mediante servicios nativos son compatibles con la ubicación y los permisos concretos.

## 6. Preparación de la prueba

1. Crear una carpeta fuente exclusiva para la prueba o vaciar controladamente una carpeta de prueba ya autorizada.
2. Incorporar exactamente un documento Google Docs que cumpla los criterios vigentes de elegibilidad.
3. Verificar que no existan otros documentos elegibles en la carpeta fuente.
4. Confirmar que el identificador del documento fuente no aparece en ninguna fila de la hoja `Procesados`.
5. Confirmar que la carpeta de destino existe, está accesible y permite crear archivos.
6. Confirmar que la plantilla configurada existe y está accesible.
7. Confirmar que el Spreadsheet y la hoja `Procesados` cumplen el esquema exacto.
8. Configurar todas las Script Properties requeridas sin exponer sus valores.
9. Confirmar que `OPENAI_MODELO` identifica un modelo vigente y compatible.
10. Confirmar que la clave de OpenAI está activa, tiene permisos y dispone de cuota suficiente.
11. Revisar el estado inicial de `ACTAS_ULTIMO_CORRELATIVO` en Script Properties sin modificarlo, salvo que exista una decisión operativa autorizada.
12. Verificar que no exista una ejecución simultánea del proyecto.
13. Registrar de forma segura la fecha, la persona ejecutora y el propósito de la prueba, sin incluir identificadores ni contenido.

## 7. Ejecución

Ejecutar manualmente una sola vez, desde el editor de Google Apps Script y con la cuenta autorizada:

```javascript
ejecutarGeneracionActas({})
```

No invocar módulos internos por separado durante esta prueba. No iniciar una segunda ejecución mientras la primera esté activa.

## 8. Resultado esperado

La función debe devolver un resultado general exitoso con un único resultado individual:

```json
{
  "exito": true,
  "datos": {
    "idEjecucion": "[VALOR_GENERADO_NO_PUBLICAR]",
    "totalCandidatos": 1,
    "procesados": 1,
    "omitidos": 0,
    "errores": 0,
    "resultados": [
      {
        "posicion": 1,
        "resultado": "PROCESADO",
        "etapa": "COMPLETADO",
        "correlativo": 1,
        "error": null
      }
    ]
  },
  "error": null
}
```

El valor concreto del correlativo dependerá del último correlativo reservado antes de la prueba.

## 9. Verificación manual

Después de la ejecución, comprobar:

1. Existe un documento Google Docs nuevo en la carpeta de destino.
2. El nombre del Google Docs respeta el patrón técnico vigente `ACTA-NNNNNN`.
3. El documento abre correctamente, contiene el acta estructurada y presenta el formato institucional esperado.
4. Existe un archivo Word nuevo en la carpeta de destino.
5. El DOCX respeta el formato `DD.MM.AAAA-NNN-Daily.docx`.
6. El DOCX abre correctamente en una aplicación compatible y conserva contenido y formato utilizables.
7. Existe exactamente una fila para el documento fuente en la hoja `Procesados`.
8. La fila termina en estado `PROCESADO`.
9. La fila conserva el correlativo devuelto por la ejecución y contiene las referencias técnicas esperadas a los artefactos.
10. `ACTAS_ULTIMO_CORRELATIVO` coincide con el último número reservado.
11. Los registros de ejecución muestran el avance técnico sin claves, contenidos, identificadores, nombres personales, rutas, enlaces, prompts ni respuestas completas.
12. El documento fuente permanece sin mover, renombrar o eliminar.
13. No se procesaron ni crearon artefactos para otros documentos.

## 10. Evidencias permitidas

Conservar únicamente:

- fecha y hora de inicio y fin;
- resultado general e individual con identificadores enmascarados;
- correlativo reservado;
- nombres de artefactos si no contienen información sensible;
- estado final `PROCESADO`;
- confirmación de apertura del Google Docs y del DOCX;
- códigos de error controlados, si existieran;
- capturas sanitizadas que oculten IDs, URLs, personas, contenido institucional y secretos.

No conservar en el repositorio claves, tokens, IDs reales, contenido de reuniones, respuestas completas de servicios, filas completas del repositorio ni registros sin sanitizar.

## 11. Criterios de interrupción

No ejecutar, o detener cualquier repetición, si se presenta alguna de estas condiciones:

- más de un documento elegible en la carpeta fuente;
- documento fuente ya registrado;
- esquema de `Procesados` incorrecto;
- Script Property requerida ausente o inválida;
- modelo no confirmado como compatible;
- permisos insuficientes;
- cuota de OpenAI o Google no disponible;
- ejecución concurrente;
- cambios locales no identificados que impidan relacionar la prueba con una versión conocida;
- presencia de datos reales que no hayan sido autorizados para la prueba;
- resultado `EN_PROCESO` o `ERROR` de un intento previo sin conciliación;
- artefactos parciales no revisados.

## 12. Política ante fallos

Ante un fallo:

1. No ejecutar nuevamente de forma automática.
2. Conservar el correlativo reservado; no reducirlo ni reutilizarlo.
3. Revisar el resultado individual, la etapa y el código controlado.
4. Revisar el estado de la fila en `Procesados`.
5. Identificar si existen Google Docs o DOCX parciales.
6. Conciliar manualmente el estado y los artefactos sin editar registros ni propiedades hasta contar con autorización.
7. Sanitizar toda evidencia antes de compartirla.
8. Definir una acción de recuperación explícita antes de autorizar otra ejecución.

## 13. Checklist de preparación

| Verificación | Estado actual verificable desde el repositorio | Acción antes de ejecutar |
|---|---|---|
| Regla productiva sincronizada en `AGENTS.md` | LISTO | Mantener el procesamiento secuencial de todos los candidatos |
| Procedimiento E2E documentado | LISTO | Usar este documento como guía |
| Manifiesto V8, `America/Lima` y registro de excepciones | LISTO | No modificar para la prueba |
| Script Properties requeridas | NO LISTO / NO VERIFICABLE LOCALMENTE | Configurar y validar en Apps Script |
| Modelo compatible | NO LISTO / NO VERIFICABLE LOCALMENTE | Confirmar modelo vigente y compatible |
| Clave de OpenAI válida | NO LISTO / NO VERIFICABLE LOCALMENTE | Configurar sin exponerla |
| Carpeta fuente exclusiva | NO LISTO / NO VERIFICABLE LOCALMENTE | Preparar carpeta de prueba |
| Exactamente un documento elegible | NO LISTO / NO VERIFICABLE LOCALMENTE | Verificar inmediatamente antes de ejecutar |
| Documento no registrado previamente | NO LISTO / NO VERIFICABLE LOCALMENTE | Consultar la hoja por ID exacto |
| Carpeta de destino accesible | NO LISTO / NO VERIFICABLE LOCALMENTE | Verificar permisos de escritura |
| Plantilla accesible | NO LISTO / NO VERIFICABLE LOCALMENTE | Verificar permisos de lectura |
| Repositorio `Procesados` existente y con esquema exacto | NO LISTO / NO VERIFICABLE LOCALMENTE | Validar archivo, hoja y encabezados |
| Permisos y alcances autorizados | NO LISTO / NO VERIFICABLE LOCALMENTE | Completar autorización con la cuenta ejecutora |
| Política de correlativos y fallos comprendida | LISTO DOCUMENTALMENTE | Confirmar aceptación operativa |
| Ausencia de cambios locales no identificados | NO LISTO | Revisar y conciliar el estado Git antes de asociar la prueba a una versión |

La prueba solo podrá declararse lista cuando todas las filas operativas estén verificadas y aprobadas fuera del repositorio.
