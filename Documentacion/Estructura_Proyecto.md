# Estructura propuesta del proyecto

## 1. Criterio general

La estructura separará el código de Google Apps Script, la configuración documentada, los recursos de prompt, las pruebas y la documentación. Esta fase solo crea los documentos de arquitectura; las demás rutas son una propuesta para fases posteriores.

No se deberá crear otra carpeta `ActasReunionIA` dentro del repositorio ni inicializar un repositorio Git adicional.

## 2. Árbol propuesto

```text
ActasReunionIA/
├── README.md
├── appsscript.json
├── AppsScript/
│   ├── Main.gs
│   ├── Configuracion.gs
│   ├── DriveRepositorio.gs
│   ├── DocumentosPendientes.gs
│   ├── RegistroProcesados.gs
│   ├── CorrelativoActas.gs
│   ├── ConstructorPrompt.gs
│   ├── ClienteOpenAI.gs
│   ├── ValidadorRespuesta.gs
│   ├── GeneradorDocumento.gs
│   ├── ExportadorWord.gs
│   ├── Auditoria.gs
│   └── Utilidades.gs
├── Configuracion/
│   └── README.md
├── Prompts/
│   ├── README.md
│   └── Prompt_Acta.md
├── Pruebas/
│   ├── README.md
│   ├── Unitarias/
│   └── Integracion/
└── Documentacion/
    ├── Arquitectura.md
    ├── Flujo_Procesamiento.md
    ├── Decisiones_Arquitectonicas.md
    ├── Riesgos_Tecnicos.md
    └── Estructura_Proyecto.md
```

Los nombres son propuestos y podrán ajustarse a las restricciones de empaquetado o despliegue que se adopten. No implican su creación durante esta fase.

## 3. Responsabilidad por archivo propuesto

| Ruta | Responsabilidad prevista |
|---|---|
| `appsscript.json` | Manifiesto de Apps Script, zona horaria, servicios y permisos mínimos. |
| `AppsScript/Main.gs` | Punto de entrada y coordinación del caso de uso. |
| `AppsScript/Configuracion.gs` | Lectura y validación de propiedades. |
| `AppsScript/DriveRepositorio.gs` | Operaciones de Drive y Docs aisladas del flujo principal. |
| `AppsScript/DocumentosPendientes.gs` | Elegibilidad, filtrado, ordenación y selección de una fuente. |
| `AppsScript/RegistroProcesados.gs` | Consulta y persistencia del estado de procesamiento. |
| `AppsScript/CorrelativoActas.gs` | Reserva y persistencia segura del número de acta. |
| `AppsScript/ConstructorPrompt.gs` | Ensamblaje versionado de instrucciones, plantilla y notas. |
| `AppsScript/ClienteOpenAI.gs` | Comunicación con OpenAI y normalización de errores técnicos. |
| `AppsScript/ValidadorRespuesta.gs` | Validación de estructura y campos obligatorios. |
| `AppsScript/GeneradorDocumento.gs` | Creación y formato del acta en Google Docs. |
| `AppsScript/ExportadorWord.gs` | Exportación y almacenamiento del `.docx`. |
| `AppsScript/Auditoria.gs` | Registro sanitizado de ejecuciones y errores. |
| `AppsScript/Utilidades.gs` | Fechas, nomenclatura, normalización y funciones transversales. |
| `AppsScript/Web/Mantenimiento.gs` | Autorización y operaciones servidoras para mantener el correlativo. |
| `AppsScript/Web/PaginaMantenimiento.html` | Interfaz web restringida de mantenimiento. |
| `Configuracion/README.md` | Catálogo de propiedades y procedimiento de aprovisionamiento sin valores secretos. |
| `Prompts/Prompt_Acta.md` | Fuente mantenible de las instrucciones del modelo, si la estrategia de despliegue lo permite. |
| `Pruebas/` | Casos unitarios, dobles de prueba y verificaciones de integración. |
| `Documentacion/` | Arquitectura, flujo, decisiones, riesgos y estructura. |

## 4. Configuración y secretos

No se propone un archivo con valores reales de configuración ni credenciales. La documentación podrá incluir nombres de propiedades, ejemplos ficticios claramente identificados y procedimientos de instalación.

La clave de OpenAI deberá permanecer:

- fuera del repositorio;
- fuera de los archivos de prompt;
- fuera de registros y mensajes de error;
- accesible únicamente para los responsables y la identidad ejecutora autorizada.

## 5. Entregables generados

Los documentos producidos no formarán parte del árbol versionado. Serán almacenados en Google Drive bajo una carpeta raíz configurada y dentro de carpetas mensuales:

```text
Carpeta raíz de entregables/
└── <periodo mensual pendiente de definir>/
    └── DD.MM.AAAA-NNN-Daily.docx
```

No se propone crear una carpeta local `Entregables/` porque el destino operativo indicado es Google Drive y los documentos pueden contener información institucional.

## 6. Estrategia de pruebas propuesta

### Pruebas unitarias

- selección del último pendiente;
- exclusión de identificadores procesados;
- incremento y formato del correlativo;
- construcción de nombres;
- resolución del periodo mensual;
- construcción del prompt;
- validación de respuestas;
- clasificación y sanitización de errores.

### Pruebas de integración

- lectura de un Google Docs de prueba;
- consulta y creación de carpetas;
- creación de un acta de prueba;
- exportación a `.docx`;
- persistencia del registro;
- control de concurrencia;
- respuesta simulada de OpenAI antes de habilitar llamadas reales.

### Escenarios mínimos

- no existen pendientes;
- existe un único pendiente;
- existen varios pendientes;
- el último documento ya fue procesado pero hay uno anterior pendiente;
- ejecución concurrente;
- plantilla vacía o inaccesible;
- respuesta externa inválida;
- fallo después de crear Google Docs y antes de guardar `.docx`;
- correlativo superior a 999;
- cambio de mes y zona horaria.

## 7. Criterios mínimos para fases posteriores

- No mezclar acceso a servicios externos con validaciones de negocio.
- No registrar contenido completo de reuniones ni secretos.
- Mantener contratos de entrada y salida documentados entre módulos.
- Incorporar pruebas antes de habilitar disparadores automáticos.
- Documentar cualquier cambio en las decisiones arquitectónicas.
- Mantener el manifiesto con los permisos mínimos necesarios.
