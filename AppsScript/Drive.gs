/**
 * Módulo: Drive
 *
 * Responsabilidad principal:
 * Encapsular exclusivamente el acceso técnico a Google Drive.
 *
 * Responsabilidades excluidas:
 * - No identifica ni selecciona el documento que debe procesarse.
 * - No contiene reglas de negocio sobre carpetas mensuales.
 * - No decide nomenclaturas, correlativos ni estados de procesamiento.
 * - No interpreta ni genera contenido documental.
 * - No accede directamente a Script Properties.
 *
 * Dependencias previstas:
 * - DriveApp.
 * - DocumentApp para leer documentos Google Docs ya identificados.
 * - Funciones públicas aprobadas de Logger.gs y Utils.gs.
 */

const DRIVE_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'DRIVE_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'DRIVE_CONTEXTO_INVALIDO',
  CARPETA_NO_ENCONTRADA: 'DRIVE_CARPETA_NO_ENCONTRADA',
  CARPETA_NO_ACCESIBLE: 'DRIVE_CARPETA_NO_ACCESIBLE',
  LISTADO_ERROR: 'DRIVE_LISTADO_ERROR',
  RESPUESTA_INVALIDA: 'DRIVE_RESPUESTA_INVALIDA',
  RECURSO_NO_DISPONIBLE: 'DRIVE_RECURSO_NO_DISPONIBLE',
  TIPO_RECURSO_INCORRECTO: 'DRIVE_TIPO_RECURSO_INCORRECTO',
  CONTENIDO_NO_COMPATIBLE: 'DRIVE_CONTENIDO_NO_COMPATIBLE',
  ERROR: 'DRIVE_ERROR',
  ERROR_TEMPORAL: 'DRIVE_ERROR_TEMPORAL',
  CUOTA_EXCEDIDA: 'DRIVE_CUOTA_EXCEDIDA'
});

const DRIVE_MIME_ACCESO_DIRECTO =
  'application/vnd.google-apps.shortcut';

const DRIVE_MIME_DOCUMENTO_GOOGLE =
  'application/vnd.google-apps.document';

const DRIVE_MENSAJES_DOCUMENTOS_FUENTE = Object.freeze({
  PARAMETRO_INVALIDO: 'El identificador de la carpeta no es válido.',
  CONTEXTO_INVALIDO: 'El contexto de la operación no es válido.',
  CARPETA_NO_ENCONTRADA: 'La carpeta fuente no fue encontrada.',
  CARPETA_NO_ACCESIBLE: 'La carpeta fuente no está disponible.',
  LISTADO_ERROR: 'No fue posible obtener los documentos fuente.',
  RESPUESTA_INVALIDA:
    'Drive devolvió información de archivo no válida.',
  ERROR: 'No fue posible completar la operación de Drive.'
});

/**
 * @typedef {Object} DescriptorArchivo
 * @property {string} id Identificador del elemento enumerado.
 * @property {string} nombre Nombre reportado por Google Drive.
 * @property {string} mimeType Tipo MIME reportado por Google Drive.
 * @property {Date} fechaCreacion Fecha de creación del elemento.
 * @property {Date} fechaActualizacion Fecha de última actualización.
 * @property {boolean} esAccesoDirecto Indica si el elemento es un acceso
 *     directo. El destino no se consulta ni se sigue.
 * @property {boolean} estaEnPapelera Indica si el elemento está en la
 *     papelera. Los elementos con valor true no se devuelven públicamente.
 */

/**
 * @typedef {Object} ErrorDriveControlado
 * @property {string} codigo Código técnico con prefijo DRIVE_.
 * @property {string} mensaje Mensaje técnico controlado y sin datos sensibles.
 */

/**
 * @typedef {Object} ResultadoListadoArchivos
 * @property {boolean} exito Indica si la operación finalizó correctamente.
 * @property {DescriptorArchivo[]|null} datos Descriptores técnicos o null
 *     cuando la operación falla.
 * @property {ErrorDriveControlado|null} error Error controlado o null cuando
 *     la operación finaliza correctamente.
 */

/**
 * Enumera los archivos directos de una carpeta de Google Drive.
 *
 * Excluye los archivos ubicados en la papelera y no sigue el destino de los
 * accesos directos. No realiza conversiones implícitas, no expone objetos
 * nativos de Drive y no propaga excepciones. El contexto es opcional y solo
 * admite un idEjecucion no vacío para trazabilidad segura.
 *
 * @param {string} carpetaId Identificador de la carpeta que se enumerará.
 * @param {{idEjecucion: (string|undefined)}=} contexto Contexto técnico
 *     opcional.
 * @returns {ResultadoListadoArchivos} Resultado estructurado de la operación.
 */
function listarArchivosEnCarpeta(carpetaId, contexto) {
  const contextoRegistro =
    esObjetoPlano(contexto) && esCadenaNoVacia(contexto.idEjecucion)
      ? { idEjecucion: contexto.idEjecucion }
      : undefined;

  if (!_driveValidarIdentificador(carpetaId)) {
    registrarAdvertencia(
      'Drive',
      'listarArchivosEnCarpeta',
      'El identificador de la carpeta no es válido.',
      contextoRegistro
    );

    return _driveConstruirResultadoError(
      DRIVE_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'El identificador de la carpeta no es válido.'
    );
  }

  let carpeta;

  try {
    carpeta = _driveObtenerCarpetaPorId(carpetaId);
  } catch (errorAccesoCarpeta) {
    registrarAdvertencia(
      'Drive',
      'listarArchivosEnCarpeta',
      'La carpeta solicitada no está disponible.',
      contextoRegistro
    );

    return _driveConstruirResultadoError(
      DRIVE_CODIGOS_ERROR.RECURSO_NO_DISPONIBLE,
      'La carpeta solicitada no está disponible.'
    );
  }

  try {
    const iteradorArchivos = carpeta.getFiles();
    const descriptores = [];

    while (iteradorArchivos.hasNext()) {
      const descriptor = _driveConstruirDescriptorArchivo(
        iteradorArchivos.next()
      );

      if (!descriptor.estaEnPapelera) {
        descriptores.push(descriptor);
      }
    }

    const contextoExito = contextoRegistro
      ? {
          idEjecucion: contextoRegistro.idEjecucion,
          datos: { cantidad: descriptores.length }
        }
      : {
          datos: { cantidad: descriptores.length }
        };

    registrarInfo(
      'Drive',
      'listarArchivosEnCarpeta',
      'El listado técnico de archivos finalizó correctamente.',
      contextoExito
    );

    return _driveConstruirResultadoExitoso(descriptores);
  } catch (errorListado) {
    registrarError(
      'Drive',
      'listarArchivosEnCarpeta',
      new Error('No fue posible completar el listado técnico de archivos.'),
      contextoRegistro
    );

    return _driveConstruirResultadoError(
      DRIVE_CODIGOS_ERROR.ERROR,
      'No fue posible completar el listado técnico de archivos.'
    );
  }
}

/**
 * @typedef {Object} DocumentoFuenteDrive
 * @property {string} idDocumentoFuente Identificador estable de Drive.
 * @property {string} nombre Nombre real del documento.
 * @property {string} mimeType Tipo MIME real informado por Drive.
 * @property {string} fechaCreacion Fecha de creación ISO 8601 UTC.
 * @property {string} fechaModificacion Fecha de modificación ISO 8601 UTC.
 */

/**
 * @typedef {Object} ResultadoDocumentosFuenteDrive
 * @property {boolean} exito Resultado de la operación.
 * @property {{documentos: DocumentoFuenteDrive[], total: number}|null} datos
 *     Documentos candidatos o null ante error.
 * @property {ErrorDriveControlado|null} error Error controlado o null.
 */

/**
 * Obtiene documentos fuente Google Docs directos de una carpeta.
 *
 * Filtra por el MIME type aprobado, excluye papelera y accesos directos,
 * deduplica por ID y ordena por fecha de creación, nombre e ID. No expone
 * objetos nativos de Drive ni propaga excepciones.
 *
 * @param {string} carpetaId Identificador estable de la carpeta fuente.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {ResultadoDocumentosFuenteDrive} Resultado controlado.
 */
function obtenerDocumentosFuente(carpetaId, contexto) {
  const operacion = 'obtenerDocumentosFuente';

  if (!_driveValidarIdentificador(carpetaId)) {
    const resultadoParametro =
      _driveConstruirResultadoDocumentosError(
        DRIVE_CODIGOS_ERROR.PARAMETRO_INVALIDO,
        DRIVE_MENSAJES_DOCUMENTOS_FUENTE.PARAMETRO_INVALIDO
      );
    _driveRegistrarResultadoDocumentos(
      operacion,
      resultadoParametro,
      undefined,
      { etapa: 'validacion' }
    );
    return resultadoParametro;
  }

  if (!_driveValidarContextoDocumentos(contexto)) {
    const resultadoContexto =
      _driveConstruirResultadoDocumentosError(
        DRIVE_CODIGOS_ERROR.CONTEXTO_INVALIDO,
        DRIVE_MENSAJES_DOCUMENTOS_FUENTE.CONTEXTO_INVALIDO
      );
    _driveRegistrarResultadoDocumentos(
      operacion,
      resultadoContexto,
      undefined,
      { etapa: 'validacion' }
    );
    return resultadoContexto;
  }

  const contextoSeguro = { idEjecucion: contexto.idEjecucion };
  _driveRegistrarInicioDocumentos(operacion, contextoSeguro);

  let carpeta;

  try {
    carpeta = _driveObtenerCarpetaPorId(carpetaId);
  } catch (errorAcceso) {
    const resultadoAcceso =
      _driveConstruirResultadoDocumentosError(
        DRIVE_CODIGOS_ERROR.CARPETA_NO_ACCESIBLE,
        DRIVE_MENSAJES_DOCUMENTOS_FUENTE.CARPETA_NO_ACCESIBLE
      );
    _driveRegistrarResultadoDocumentos(
      operacion,
      resultadoAcceso,
      contextoSeguro,
      { etapa: 'acceso' }
    );
    return resultadoAcceso;
  }

  if (carpeta === null || carpeta === undefined) {
    const resultadoNoEncontrado =
      _driveConstruirResultadoDocumentosError(
        DRIVE_CODIGOS_ERROR.CARPETA_NO_ENCONTRADA,
        DRIVE_MENSAJES_DOCUMENTOS_FUENTE.CARPETA_NO_ENCONTRADA
      );
    _driveRegistrarResultadoDocumentos(
      operacion,
      resultadoNoEncontrado,
      contextoSeguro,
      { etapa: 'acceso' }
    );
    return resultadoNoEncontrado;
  }

  return _driveListarDocumentosFuente(
    carpeta,
    operacion,
    contextoSeguro
  );
}

/**
 * Valida el contexto estricto de obtención de documentos.
 *
 * @param {*} contexto Contexto recibido.
 * @returns {boolean} true si solo contiene idEjecucion válido.
 */
function _driveValidarContextoDocumentos(contexto) {
  try {
    if (!esObjetoPlano(contexto)) {
      return false;
    }

    const claves = Object.keys(contexto);
    return (
      claves.length === 1 &&
      claves[0] === 'idEjecucion' &&
      esCadenaNoVacia(contexto.idEjecucion)
    );
  } catch (errorValidacion) {
    return false;
  }
}

/**
 * Enumera, filtra, deduplica y ordena documentos fuente.
 *
 * @param {GoogleAppsScript.Drive.Folder} carpeta Carpeta interna validada.
 * @param {string} operacion Operación pública.
 * @param {{idEjecucion: string}} contexto Contexto seguro.
 * @returns {ResultadoDocumentosFuenteDrive} Resultado controlado.
 */
function _driveListarDocumentosFuente(carpeta, operacion, contexto) {
  const documentosPorId = Object.create(null);
  let cantidadDescartados = 0;
  let cantidadDuplicados = 0;

  try {
    const archivos = carpeta.getFiles();

    while (archivos.hasNext()) {
      const archivo = archivos.next();
      const mimeType = archivo.getMimeType();

      if (
        archivo.isTrashed() ||
        !_driveEsMimeFuenteAdmitido(mimeType)
      ) {
        cantidadDescartados += 1;
        continue;
      }

      const descriptor = _driveConstruirDocumentoFuente(
        archivo,
        mimeType
      );

      if (descriptor === null) {
        const resultadoInvalido =
          _driveConstruirResultadoDocumentosError(
            DRIVE_CODIGOS_ERROR.RESPUESTA_INVALIDA,
            DRIVE_MENSAJES_DOCUMENTOS_FUENTE.RESPUESTA_INVALIDA
          );
        _driveRegistrarResultadoDocumentos(
          operacion,
          resultadoInvalido,
          contexto,
          { etapa: 'metadatos' }
        );
        return resultadoInvalido;
      }

      if (
        Object.prototype.hasOwnProperty.call(
          documentosPorId,
          descriptor.idDocumentoFuente
        )
      ) {
        cantidadDuplicados += 1;
      } else {
        documentosPorId[descriptor.idDocumentoFuente] = descriptor;
      }
    }
  } catch (errorListado) {
    const resultadoListado =
      _driveConstruirResultadoDocumentosError(
        DRIVE_CODIGOS_ERROR.LISTADO_ERROR,
        DRIVE_MENSAJES_DOCUMENTOS_FUENTE.LISTADO_ERROR
      );
    _driveRegistrarResultadoDocumentos(
      operacion,
      resultadoListado,
      contexto,
      { etapa: 'listado' }
    );
    return resultadoListado;
  }

  const documentos = Object.keys(documentosPorId).map(function (id) {
    return documentosPorId[id];
  });
  documentos.sort(_driveCompararDocumentosFuente);

  const resultado = _driveConstruirResultadoDocumentosExitoso(documentos);
  _driveRegistrarResultadoDocumentos(
    operacion,
    resultado,
    contexto,
    {
      etapa: documentos.length === 0 ? 'carpeta_vacia' : 'finalizacion',
      total: documentos.length,
      cantidadDescartados: cantidadDescartados,
      cantidadDuplicados: cantidadDuplicados
    }
  );
  return resultado;
}

/**
 * Determina si el MIME type corresponde a notas Google Docs.
 *
 * @param {*} mimeType Tipo informado por Drive.
 * @returns {boolean} true únicamente para Google Docs.
 */
function _driveEsMimeFuenteAdmitido(mimeType) {
  return mimeType === DRIVE_MIME_DOCUMENTO_GOOGLE;
}

/**
 * Construye un descriptor serializable y validado.
 *
 * @param {GoogleAppsScript.Drive.File} archivo Archivo interno.
 * @param {string} mimeType MIME type previamente admitido.
 * @returns {DocumentoFuenteDrive|null} Descriptor o null si es inválido.
 */
function _driveConstruirDocumentoFuente(archivo, mimeType) {
  try {
    const idDocumentoFuente = archivo.getId();
    const nombre = archivo.getName();
    const fechaCreacion = _driveConvertirFechaIso(
      archivo.getDateCreated()
    );
    const fechaModificacion = _driveConvertirFechaIso(
      archivo.getLastUpdated()
    );

    if (
      !esCadenaNoVacia(idDocumentoFuente) ||
      !esCadenaNoVacia(nombre) ||
      !esCadenaNoVacia(mimeType) ||
      fechaCreacion === null ||
      fechaModificacion === null
    ) {
      return null;
    }

    return {
      idDocumentoFuente: idDocumentoFuente,
      nombre: nombre,
      mimeType: mimeType,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion
    };
  } catch (errorMetadatos) {
    return null;
  }
}

/**
 * Convierte una fecha nativa válida a ISO 8601 UTC.
 *
 * @param {*} fecha Fecha recibida desde Drive.
 * @returns {string|null} Representación ISO o null.
 */
function _driveConvertirFechaIso(fecha) {
  return esFechaValida(fecha) ? fecha.toISOString() : null;
}

/**
 * Compara documentos sin depender de la configuración regional.
 *
 * @param {DocumentoFuenteDrive} primero Primer descriptor.
 * @param {DocumentoFuenteDrive} segundo Segundo descriptor.
 * @returns {number} Orden ascendente determinista.
 */
function _driveCompararDocumentosFuente(primero, segundo) {
  const campos = ['fechaCreacion', 'nombre', 'idDocumentoFuente'];

  for (let indice = 0; indice < campos.length; indice += 1) {
    const campo = campos[indice];

    if (primero[campo] < segundo[campo]) {
      return -1;
    }

    if (primero[campo] > segundo[campo]) {
      return 1;
    }
  }

  return 0;
}

/**
 * Construye el resultado exitoso de documentos fuente.
 *
 * @param {DocumentoFuenteDrive[]} documentos Documentos ordenados.
 * @returns {ResultadoDocumentosFuenteDrive} Resultado exitoso.
 */
function _driveConstruirResultadoDocumentosExitoso(documentos) {
  return {
    exito: true,
    datos: {
      documentos: documentos,
      total: documentos.length
    },
    error: null
  };
}

/**
 * Construye un error controlado de documentos fuente.
 *
 * @param {string} codigo Código DRIVE_ controlado.
 * @param {string} mensaje Mensaje público seguro.
 * @returns {ResultadoDocumentosFuenteDrive} Resultado fallido.
 */
function _driveConstruirResultadoDocumentosError(codigo, mensaje) {
  return {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
}

/**
 * Registra el inicio técnico del listado sin incluir la carpeta.
 *
 * @param {string} operacion Operación pública.
 * @param {{idEjecucion: string}} contexto Contexto seguro.
 * @returns {void}
 */
function _driveRegistrarInicioDocumentos(operacion, contexto) {
  try {
    registrarInfo(
      'Drive',
      operacion,
      'Se inició la obtención de documentos fuente.',
      {
        idEjecucion: contexto.idEjecucion,
        datos: { etapa: 'inicio' }
      }
    );
  } catch (errorRegistro) {
    // La auditoría no modifica el resultado funcional.
  }
}

/**
 * Registra resultados agregados sin IDs, nombres ni metadatos individuales.
 *
 * @param {string} operacion Operación pública.
 * @param {ResultadoDocumentosFuenteDrive} resultado Resultado determinado.
 * @param {{idEjecucion: string}|undefined} contexto Contexto seguro.
 * @param {Object} datos Datos técnicos primitivos y controlados.
 * @returns {void}
 */
function _driveRegistrarResultadoDocumentos(
  operacion,
  resultado,
  contexto,
  datos
) {
  try {
    const contextoRegistro = { datos: datos };

    if (contexto !== undefined) {
      contextoRegistro.idEjecucion = contexto.idEjecucion;
    }

    if (resultado.exito) {
      if (datos.cantidadDuplicados > 0) {
        registrarAdvertencia(
          'Drive',
          operacion,
          'Drive devolvió documentos duplicados; fueron deduplicados.',
          {
            idEjecucion: contexto.idEjecucion,
            datos: {
              etapa: 'deduplicacion',
              cantidadDuplicados: datos.cantidadDuplicados
            }
          }
        );
      }

      registrarInfo(
        'Drive',
        operacion,
        datos.total === 0
          ? 'La carpeta fuente no contiene documentos candidatos.'
          : 'La obtención de documentos fuente finalizó correctamente.',
        contextoRegistro
      );
      return;
    }

    contextoRegistro.datos.resultado = 'error';
    contextoRegistro.datos.codigo = resultado.error.codigo;

    if (
      resultado.error.codigo === DRIVE_CODIGOS_ERROR.PARAMETRO_INVALIDO ||
      resultado.error.codigo === DRIVE_CODIGOS_ERROR.CONTEXTO_INVALIDO ||
      resultado.error.codigo ===
        DRIVE_CODIGOS_ERROR.CARPETA_NO_ENCONTRADA ||
      resultado.error.codigo ===
        DRIVE_CODIGOS_ERROR.CARPETA_NO_ACCESIBLE
    ) {
      registrarAdvertencia(
        'Drive',
        operacion,
        resultado.error.mensaje,
        contextoRegistro
      );
    } else {
      registrarError(
        'Drive',
        operacion,
        resultado.error.mensaje,
        contextoRegistro
      );
    }
  } catch (errorRegistro) {
    // La auditoría no modifica el resultado funcional.
  }
}

/**
 * Determina si un identificador técnico de Drive es válido como entrada.
 *
 * @param {*} valor Valor que se validará.
 * @returns {boolean} true si es una cadena no vacía; de lo contrario, false.
 */
function _driveValidarIdentificador(valor) {
  return esCadenaNoVacia(valor);
}

/**
 * Obtiene internamente una carpeta mediante su identificador.
 *
 * La excepción de Drive se conserva dentro del límite interno y debe ser
 * controlada por la función pública invocante.
 *
 * @param {string} carpetaId Identificador validado de la carpeta.
 * @returns {GoogleAppsScript.Drive.Folder} Carpeta nativa para uso interno.
 */
function _driveObtenerCarpetaPorId(carpetaId) {
  return DriveApp.getFolderById(carpetaId);
}

/**
 * Construye el descriptor técnico de un archivo sin seguir accesos directos.
 *
 * @param {GoogleAppsScript.Drive.File} archivo Archivo nativo de uso interno.
 * @returns {DescriptorArchivo} Descriptor sin objetos nativos de Drive.
 */
function _driveConstruirDescriptorArchivo(archivo) {
  const mimeType = archivo.getMimeType();

  return {
    id: archivo.getId(),
    nombre: archivo.getName(),
    mimeType: mimeType,
    fechaCreacion: archivo.getDateCreated(),
    fechaActualizacion: archivo.getLastUpdated(),
    esAccesoDirecto: mimeType === DRIVE_MIME_ACCESO_DIRECTO,
    estaEnPapelera: archivo.isTrashed()
  };
}

/**
 * Construye un resultado exitoso de listado.
 *
 * @param {DescriptorArchivo[]} descriptores Descriptores obtenidos.
 * @returns {ResultadoListadoArchivos} Resultado exitoso.
 */
function _driveConstruirResultadoExitoso(descriptores) {
  return {
    exito: true,
    datos: descriptores,
    error: null
  };
}

/**
 * Construye un resultado fallido con información técnica controlada.
 *
 * @param {string} codigo Código técnico con prefijo DRIVE_.
 * @param {string} mensaje Mensaje técnico sin información sensible.
 * @returns {ResultadoListadoArchivos} Resultado fallido.
 */
function _driveConstruirResultadoError(codigo, mensaje) {
  return {
    exito: false,
    datos: null,
    error: {
      codigo: codigo,
      mensaje: mensaje
    }
  };
}

/**
 * Lee el texto completo de un documento fuente Google Docs.
 *
 * Verifica tipo, disponibilidad y contenido sin registrar ni devolver
 * metadatos identificativos. No transforma ni trunca el texto.
 *
 * @param {string} idDocumentoFuente Identificador estable del documento.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({contenidoFuente: string}|null), error: (ErrorDriveControlado|null)}}
 */
function leerContenidoDocumentoFuente(idDocumentoFuente, contexto) {
  const operacion = 'leerContenidoDocumentoFuente';

  if (!_driveValidarIdentificador(idDocumentoFuente)) {
    return _driveFinalizarLecturaError(
      operacion,
      DRIVE_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'El identificador del documento fuente no es válido.',
      undefined,
      'validacion'
    );
  }

  if (!_driveValidarContextoDocumentos(contexto)) {
    return _driveFinalizarLecturaError(
      operacion,
      DRIVE_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de la operación no es válido.',
      undefined,
      'validacion'
    );
  }

  const contextoSeguro = { idEjecucion: contexto.idEjecucion };

  try {
    const archivo = DriveApp.getFileById(idDocumentoFuente);

    if (!archivo || archivo.isTrashed()) {
      return _driveFinalizarLecturaError(
        operacion,
        DRIVE_CODIGOS_ERROR.RECURSO_NO_DISPONIBLE,
        'El documento fuente no está disponible.',
        contextoSeguro,
        'acceso'
      );
    }

    if (archivo.getMimeType() !== DRIVE_MIME_DOCUMENTO_GOOGLE) {
      return _driveFinalizarLecturaError(
        operacion,
        DRIVE_CODIGOS_ERROR.TIPO_RECURSO_INCORRECTO,
        'El recurso fuente no es un documento Google Docs.',
        contextoSeguro,
        'tipo'
      );
    }

    const documento = DocumentApp.openById(idDocumentoFuente);
    const contenidoFuente = documento.getBody().getText();

    if (!esCadenaNoVacia(contenidoFuente)) {
      return _driveFinalizarLecturaError(
        operacion,
        DRIVE_CODIGOS_ERROR.CONTENIDO_NO_COMPATIBLE,
        'El documento fuente no contiene texto utilizable.',
        contextoSeguro,
        'contenido'
      );
    }

    const resultado = {
      exito: true,
      datos: { contenidoFuente: contenidoFuente },
      error: null
    };
    _driveRegistrarLectura(
      operacion,
      'La lectura del documento fuente finalizó correctamente.',
      contextoSeguro,
      { etapa: 'finalizacion', resultado: 'correcto' },
      false
    );
    return resultado;
  } catch (errorLectura) {
    return _driveFinalizarLecturaError(
      operacion,
      DRIVE_CODIGOS_ERROR.RECURSO_NO_DISPONIBLE,
      'El documento fuente no está disponible.',
      contextoSeguro,
      'lectura'
    );
  }
}

function _driveFinalizarLecturaError(
  operacion,
  codigo,
  mensaje,
  contexto,
  etapa
) {
  const resultado = _driveConstruirResultadoError(codigo, mensaje);
  _driveRegistrarLectura(
    operacion,
    mensaje,
    contexto,
    { etapa: etapa, resultado: 'error', codigo: codigo },
    true
  );
  return resultado;
}

function _driveRegistrarLectura(
  operacion,
  mensaje,
  contexto,
  datos,
  esError
) {
  try {
    const contextoRegistro = { datos: datos };
    if (contexto !== undefined) {
      contextoRegistro.idEjecucion = contexto.idEjecucion;
    }
    if (esError) {
      registrarError('Drive', operacion, mensaje, contextoRegistro);
    } else {
      registrarInfo('Drive', operacion, mensaje, contextoRegistro);
    }
  } catch (errorRegistro) {
    // La auditoría no modifica el resultado funcional.
  }
}
