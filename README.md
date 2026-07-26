# ActasReunionIA

Sistema para la **generación automática de Actas de Reunión** a partir
de las notas creadas por **Google Meet + Gemini**, utilizando **Google
Apps Script** y la **API de OpenAI**.

------------------------------------------------------------------------

## Objetivo

Automatizar el proceso de elaboración de actas institucionales,
respetando una plantilla oficial y reduciendo el tiempo de preparación y
revisión.

------------------------------------------------------------------------

## Arquitectura

``` text
Google Meet
      │
      ▼
Gemini (Notas de reunión)
      │
      ▼
Google Drive
      │
      ▼
Google Apps Script
      ├── Lee la última nota
      ├── Lee la plantilla
      ├── Invoca OpenAI
      ├── Genera el acta
      └── Exporta a Word (.docx)
```

------------------------------------------------------------------------

## Estructura propuesta

``` text
ActasReunionIA/
│
├── README.md
├── configuracion.json
├── AppsScript/
├── Plantillas/
├── Prompts/
├── Documentacion/
├── Configuracion/
├── Modelos/
└── Entregables/
```

------------------------------------------------------------------------

## Funcionalidades previstas

-   Lectura automática de la última nota generada por Gemini.
-   Aplicación de una plantilla institucional de actas.
-   Generación del contenido mediante OpenAI.
-   Exportación a Microsoft Word (.docx).
-   Nomenclatura automática:
    -   `DD.MM.AAAA-XXX-Daily.docx`
-   Organización de entregables por mes.
-   Registro de ejecución y auditoría.

------------------------------------------------------------------------

## Tecnologías

-   Google Apps Script
-   Google Drive
-   Google Docs
-   OpenAI API
-   Git / GitHub

------------------------------------------------------------------------

## Estado del proyecto

**Versión:** 0.1.0

En desarrollo.

### Próximos hitos

1.  Configuración centralizada.
2.  Módulo de acceso a Google Drive.
3.  Integración con OpenAI.
4.  Generador de actas.
5.  Exportación a Word.
6.  Documentación técnica.

------------------------------------------------------------------------

## Licencia

Pendiente de definir.
