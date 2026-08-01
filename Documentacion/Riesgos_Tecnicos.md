# Riesgos técnicos, dependencias y supuestos

## 1. Escala de valoración

- **Probabilidad:** baja, media o alta.
- **Impacto:** bajo, medio o alto.

La valoración es inicial y deberá revisarse con datos de uso, volumen y políticas institucionales.

## 2. Matriz de riesgos

| Riesgo | Probabilidad | Impacto | Medida inicial |
|---|---:|---:|---|
| Ejecuciones simultáneas seleccionan la misma fuente o correlativo | Media | Alto | Aplicar bloqueo a selección, reserva y registro inicial. |
| Cuotas o tiempo máximo de Apps Script interrumpen el flujo | Media | Alto | Procesar un documento, medir duración y limitar tamaños; definir recuperación. |
| Fallo de OpenAI o limitación de solicitudes | Media | Alto | Tratar códigos de error, usar tiempos de espera y definir reintentos acotados. |
| Respuesta de OpenAI inválida o incompleta | Media | Alto | Exigir estructura, validar campos y no confirmar la fuente antes de tiempo. |
| Exposición de la clave de API | Baja | Alto | Mantenerla fuera de Git, restringir acceso y sanitizar registros. |
| Datos sensibles enviados a un tercero sin política definida | Media | Alto | Obtener autorización institucional y definir minimización, retención y acceso. |
| Cambios en la plantilla rompen el mapeo | Media | Alto | Versionar el prompt y validar la estructura; establecer control de cambios. |
| Selección incorrecta del “último” documento | Media | Alto | Definir elegibilidad y fecha de ordenación; probar empates y documentos movidos. |
| Registro de procesados inconsistente | Media | Alto | Usar identificador de Drive, estados explícitos y procedimiento de conciliación. |
| Correlativo consumido o duplicado tras un fallo | Media | Alto | Proteger la reserva y definir formalmente la semántica de números fallidos. |
| Exportación `.docx` produce un archivo defectuoso | Media | Medio | Verificar tipo, tamaño y existencia; incorporar una prueba de apertura posterior. |
| Duplicación de carpetas mensuales | Media | Medio | Buscar bajo una raíz exacta y aplicar un nombre determinista. |
| Pérdida de permisos sobre Drive, Docs o plantilla | Media | Alto | Validar permisos al inicio y registrar identificadores sin contenido sensible. |
| Renombrado o movimiento de archivos fuente | Media | Medio | Usar identificadores estables en lugar de rutas o nombres como identidad. |
| Registros excesivos filtran contenido de reuniones | Media | Alto | Registrar metadatos mínimos y errores sanitizados, nunca prompts completos por defecto. |
| Cambios de API o modelo de OpenAI | Media | Medio | Encapsular la integración y mantener modelo y versión de prompt configurables. |
| Diferencias de zona horaria alteran nombres o carpetas | Media | Medio | Configurar explícitamente la zona horaria institucional. |
| Ausencia de informe de asistencia omite participantes silenciosos | Alta | Medio | Documentar la limitación y usar únicamente etiquetas de hablante más organizador explícito para evitar falsos positivos. |
| No existe una transcripción identificable y única | Media | Alto | Priorizar una marca única en el nombre, usar estructura conversacional como respaldo y detener el documento ante cero o múltiples coincidencias. |

## 3. Riesgos de consistencia

Apps Script, Drive y OpenAI no ofrecen una transacción distribuida común. Puede producirse un fallo después de crear un documento, exportar un archivo o reservar un correlativo y antes de actualizar el registro.

La implementación deberá:

- persistir estados intermedios;
- conservar identificadores de artefactos creados;
- hacer que la confirmación final sea explícita;
- permitir conciliación manual o automática;
- evitar eliminar automáticamente artefactos sin una política aprobada.

## 4. Riesgos de selección

La expresión “último documento de Gemini” no determina por sí sola:

- cómo reconocer que un documento fue creado por Gemini;
- si se ordena por creación, modificación o fecha de reunión;
- cómo resolver empates;
- si documentos vacíos, borradores o movidos son elegibles.

Estos criterios deben resolverse antes de implementar el selector.

## 5. Dependencias técnicas y operativas

### 5.1 Google

- proyecto de Google Apps Script;
- servicios de Drive y Docs;
- servicio de propiedades;
- servicio de bloqueo;
- mecanismo de exportación compatible con `.docx`;
- disparador temporal o ejecución manual;
- permisos OAuth y acceso de la cuenta ejecutora.

### 5.2 OpenAI

- cuenta y proyecto habilitados;
- clave de API aprovisionada externamente;
- modelo autorizado y disponible;
- presupuesto, cuotas y límites compatibles con el tamaño de las notas;
- política institucional para envío de información.

### 5.3 Insumos institucionales

- plantilla oficial;
- carpeta de notas de Gemini;
- carpeta raíz de entregables;
- reglas de correlativo;
- definición de responsables operativos y de soporte.

## 6. Supuestos iniciales

- Cada fuente tiene un identificador de Drive estable y accesible.
- Una ejecución puede completar el procesamiento dentro de los límites de Apps Script.
- La plantilla puede representarse mediante una estructura que OpenAI pueda completar.
- La exportación a `.docx` conserva un nivel de formato aceptable.
- El proceso tiene autorización para leer las notas y enviarlas al servicio externo.

Estos supuestos deberán validarse; no constituyen requisitos confirmados.

## 7. Vacíos pendientes

- volumen y tamaño típico/máximo de notas;
- frecuencia del disparador;
- tiempo máximo aceptable por ejecución;
- política de reintentos;
- tratamiento de fuentes fallidas;
- recuperación o reutilización de correlativos;
- esquema de auditoría y periodo de retención;
- clasificación de la información y controles de acceso;
- ambientes de desarrollo, prueba y producción;
- responsables de la plantilla y de la aprobación final;
- objetivos de disponibilidad y soporte.
