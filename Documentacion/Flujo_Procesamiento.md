# Flujo de procesamiento

## 1. Objetivo del flujo

Coordinar una ejecución que transforme como máximo un documento pendiente de Gemini en un acta institucional exportada a Microsoft Word, conservando correlativo, trazabilidad e idempotencia.

## 2. Precondiciones

- La configuración obligatoria es válida.
- La cuenta ejecutora dispone de permisos suficientes.
- La carpeta de notas, la plantilla y la carpeta raíz de entregables existen o son accesibles.
- La credencial de OpenAI está disponible fuera del repositorio.
- No existe otra ejecución dentro de la sección crítica protegida.

## 3. Flujo principal

1. **Iniciar la ejecución.**
   - Generar un identificador único.
   - Registrar fecha, origen del disparo y estado inicial.

2. **Adquirir el bloqueo de ejecución.**
   - Evitar selecciones y correlativos duplicados.
   - Si no se obtiene el bloqueo, finalizar sin procesar documentos y registrar la situación.

3. **Cargar y validar la configuración.**
   - Comprobar presencia y formato de las propiedades requeridas.
   - No exponer secretos en registros.

4. **Consultar los documentos candidatos.**
   - Limitar la búsqueda a la ubicación configurada.
   - Considerar únicamente archivos elegibles como notas de Gemini.

5. **Excluir documentos ya procesados.**
   - Contrastar los identificadores estables de Drive con el registro persistente.
   - No depender exclusivamente del nombre del archivo.

6. **Seleccionar el último documento pendiente.**
   - Ordenar con el criterio configurado.
   - Seleccionar solo el primer resultado.
   - Si no hay pendientes, finalizar correctamente sin consumir correlativo.

7. **Leer la fuente y la plantilla.**
   - Extraer el contenido del documento de Gemini.
   - Cargar la plantilla institucional.
   - Validar que ambos contenidos sean utilizables.

8. **Reservar el correlativo.**
   - Obtener el siguiente número dentro de la sección protegida.
   - Asociarlo al identificador de ejecución y al documento fuente.
   - La estrategia exacta de recuperación de números reservados tras un fallo queda pendiente.

9. **Crear el registro inicial de procesamiento.**
   - Guardar documento fuente, correlativo, fecha y estado `INICIADO`.
   - Este registro no equivale todavía a procesamiento completado.

10. **Construir la solicitud para OpenAI.**
    - Integrar instrucciones, plantilla, notas y metadatos permitidos.
    - Incluir una versión del prompt para reproducibilidad.

11. **Invocar OpenAI.**
    - Enviar una sola solicitud conforme a la configuración.
    - Capturar estado HTTP, identificador de solicitud disponible y métricas permitidas.

12. **Validar la respuesta.**
    - Verificar que el contenido sea interpretable y cumpla el esquema acordado.
    - Rechazar respuestas incompletas o incompatibles antes de crear la salida definitiva.

13. **Generar el acta en Google Docs.**
    - Crear el documento y aplicar la estructura validada.
    - Conservar su identificador en el registro de ejecución.

14. **Resolver la carpeta mensual.**
    - Localizar o crear la carpeta del periodo correspondiente.
    - Evitar carpetas duplicadas con el mismo propósito.

15. **Construir el nombre del entregable.**
    - Aplicar `DD.MM.AAAA-NNN-Daily.docx`.
    - Usar el número correlativo con un mínimo de tres dígitos.

16. **Exportar a Microsoft Word.**
    - Obtener el contenido `.docx`.
    - Guardarlo en la carpeta mensual con el nombre calculado.
    - Verificar la existencia del archivo resultante.

17. **Eliminar el Google Docs temporal.**
    - Usar exclusivamente el identificador del acta generado en la ejecución.
    - Eliminarlo permanentemente solo después de verificar el `.docx`.
    - No eliminar nunca el documento fuente.

18. **Confirmar el procesamiento.**
    - Actualizar el registro a `COMPLETADO`.
    - Persistir los identificadores de las salidas y la fecha final.
    - A partir de este momento, el documento fuente no vuelve a ser candidato.

19. **Cerrar la ejecución.**
    - Registrar resultado y duración.
    - Liberar el bloqueo en una operación garantizada de cierre.

## 4. Representación resumida

```text
Inicio
  |
  v
Bloqueo --> Configuración --> Buscar candidatos --> Excluir procesados
                                                   |
                                      ¿Hay pendientes?
                                      /             \
                                    No               Sí
                                    |                |
                              Fin sin cambios   Elegir el último
                                                     |
                              Leer fuente y plantilla
                                                     |
                                  Reservar correlativo
                                                     |
                                   Construir solicitud
                                                     |
                                        OpenAI
                                                     |
                                   Validar respuesta
                                                     |
                              Crear Google Docs y DOCX
                                                     |
                                Confirmar procesado
                                                     |
                                                    Fin
```

## 5. Flujos alternativos y errores

### 5.1 Sin documentos pendientes

La ejecución termina con estado satisfactorio y resultado “sin pendientes”. No se reserva correlativo ni se crea salida.

### 5.2 Configuración inválida

La ejecución termina antes de consultar o modificar documentos. Se registra la propiedad faltante sin incluir valores secretos.

### 5.3 Bloqueo no disponible

No se procesa ningún documento. Se registra un evento de concurrencia. La decisión entre omitir o reintentar queda pendiente.

### 5.4 Documento o plantilla ilegible

Se registra el error y no se invoca OpenAI. El documento no se marca como completado.

### 5.5 Error o respuesta inválida de OpenAI

Se registra el estado técnico sanitizado. No se crea el entregable definitivo ni se confirma el procesamiento.

### 5.6 Fallo durante la generación o exportación

El registro conserva los identificadores de cualquier salida parcial. El documento no se marca como completado hasta validar el `.docx` y eliminar permanentemente el Google Docs temporal. Si falla la exportación o verificación, el temporal se conserva; si falla la eliminación, el estado queda en error para conciliación manual.

### 5.7 Fallo al confirmar el registro

Es un error crítico porque puede permitir duplicidades. La salida deberá conservar metadatos suficientes para conciliación. Se requiere definir una estrategia transaccional o de recuperación antes de implementar.

## 6. Reglas de idempotencia

- La identidad primaria de la fuente será el identificador de Drive.
- Solo el estado `COMPLETADO` impedirá definitivamente una nueva selección, salvo que se defina una intervención administrativa.
- Una ejecución no deberá generar dos entregables confirmados para el mismo documento fuente.
- La selección, reserva de correlativo y creación del registro inicial deberán protegerse frente a concurrencia.
- El nombre del archivo no se utilizará como único mecanismo para detectar duplicados.

## 7. Puntos de control

- configuración validada;
- bloqueo adquirido;
- documento seleccionado;
- correlativo reservado;
- respuesta de OpenAI validada;
- Google Docs creado;
- `.docx` creado y localizado;
- registro confirmado como `COMPLETADO`;
- bloqueo liberado.

## 8. Flujo manual desde la aplicación web

1. El usuario autorizado selecciona una de las notas mostradas.
2. La interfaz presenta el ID y propone el siguiente correlativo informativo.
3. El usuario confirma o edita un entero mayor que cero.
4. El servidor valida autorización, ID y rango numérico.
5. Se recorre la carpeta y se localiza exclusivamente el ID seleccionado, sin
   aplicar la reducción automática al archivo modificado más recientemente.
6. `HojaSeguimiento.gsheet` rechaza un ID ya registrado o un correlativo usado.
7. El procesamiento funcional se ejecuta para esa única nota.
8. La reclamación `EN_PROCESO` repite la validación bajo `ScriptLock`.
9. El flujo genera y verifica el DOCX y registra `PROCESADO` o `ERROR`.
10. `ACTAS_ULTIMO_CORRELATIVO` permanece sin cambios.

La misma operación puede iniciarse desde el editor de Apps Script mediante
`probarGeneracionActaManual`, después de configurar las propiedades
`PRUEBA_GENERACION_NOTA_ID` y `PRUEBA_GENERACION_CORRELATIVO`.
