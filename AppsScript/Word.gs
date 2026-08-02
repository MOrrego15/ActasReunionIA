/**
 * Módulo: Word
 *
 * Exporta un Google Docs a DOCX, crea el entregable en la carpeta indicada y
 * verifica el archivo resultante. No modifica el documento original ni
 * administra estados de procesamiento.
 */

const WORD_MIME_DOCUMENTO_GOOGLE =
  'application/vnd.google-apps.document';
const WORD_MIME_DOCX =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const WORD_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'WORD_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'WORD_CONTEXTO_INVALIDO',
  DOCUMENTO_NO_DISPONIBLE: 'WORD_DOCUMENTO_NO_DISPONIBLE',
  TIPO_DOCUMENTO_INVALIDO: 'WORD_TIPO_DOCUMENTO_INVALIDO',
  FECHA_INVALIDA: 'WORD_FECHA_INVALIDA',
  CARPETA_NO_DISPONIBLE: 'WORD_CARPETA_NO_DISPONIBLE',
  AUTENTICACION_ERROR: 'WORD_AUTENTICACION_ERROR',
  EXPORTACION_ERROR: 'WORD_EXPORTACION_ERROR',
  RESPUESTA_INVALIDA: 'WORD_RESPUESTA_INVALIDA',
  CREACION_ERROR: 'WORD_CREACION_ERROR',
  VERIFICACION_ERROR: 'WORD_VERIFICACION_ERROR',
  ERROR: 'WORD_ERROR'
});

/**
 * Exporta un documento Google Docs a Microsoft Word.
 *
 * @param {string} idDocumentoGoogle Identificador del Google Docs.
 * @param {{correlativo: number, fechaReunion: string, carpetaDestinoId: string}} datosExportacion
 *     Datos técnicos requeridos para nombrar y ubicar el entregable.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({idArchivoDocx: string}|null), error: (Object|null)}}
 */
function exportarDocumentoWord(
  idDocumentoGoogle,
  datosExportacion,
  contexto
) {
  if (!esCadenaNoVacia(idDocumentoGoogle) ||
    !_wordValidarDatosExportacion(datosExportacion)) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'Los datos de exportación no son válidos.',
      undefined,
      'validacion'
    );
  }

  if (!_wordValidarContexto(contexto)) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de exportación no es válido.',
      undefined,
      'validacion'
    );
  }

  const fechaNombre = _wordNormalizarFecha(datosExportacion.fechaReunion);
  if (fechaNombre === null) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.FECHA_INVALIDA,
      'La fecha de la reunión no es válida para nombrar el archivo.',
      contexto,
      'fecha'
    );
  }

  const nombreArchivo = fechaNombre + '-' +
    String(datosExportacion.correlativo).padStart(3, '0') +
    '-Daily.docx';
  let documento;
  let carpeta;

  try {
    documento = DriveApp.getFileById(idDocumentoGoogle);
    if (!documento || documento.isTrashed()) {
      throw new Error('documento');
    }
  } catch (errorDocumento) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.DOCUMENTO_NO_DISPONIBLE,
      'El documento Google no está disponible.',
      contexto,
      'documento'
    );
  }

  try {
    if (documento.getMimeType() !== WORD_MIME_DOCUMENTO_GOOGLE) {
      return _wordFinalizarError(
        WORD_CODIGOS_ERROR.TIPO_DOCUMENTO_INVALIDO,
        'El archivo de origen no es un documento Google Docs.',
        contexto,
        'tipo'
      );
    }
  } catch (errorTipo) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.DOCUMENTO_NO_DISPONIBLE,
      'El documento Google no está disponible.',
      contexto,
      'documento'
    );
  }

  try {
    carpeta = DriveApp.getFolderById(datosExportacion.carpetaDestinoId);
    if (!carpeta) throw new Error('carpeta');
  } catch (errorCarpeta) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.CARPETA_NO_DISPONIBLE,
      'La carpeta de destino no está disponible.',
      contexto,
      'carpeta'
    );
  }

  let blob;
  try {
    blob = documento.getAs(MimeType.MICROSOFT_WORD);
    if (!blob || blob.getBytes().length === 0) {
      throw new Error('respuesta');
    }
    blob.setContentType(WORD_MIME_DOCX);
    blob.setName(nombreArchivo);
  } catch (errorExportacion) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.EXPORTACION_ERROR,
      'No fue posible exportar el documento a Word.',
      contexto,
      'exportacion'
    );
  }

  let archivoDocx;
  let idArchivoDocx;
  try {
    archivoDocx = carpeta.createFile(blob);
    idArchivoDocx = archivoDocx.getId();
    if (!esCadenaNoVacia(idArchivoDocx)) throw new Error('creacion');
  } catch (errorCreacion) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.CREACION_ERROR,
      'No fue posible crear el archivo Word.',
      contexto,
      'creacion'
    );
  }

  try {
    if (!_wordVerificarArchivo(
      idArchivoDocx,
      nombreArchivo,
      datosExportacion.carpetaDestinoId
    )) {
      throw new Error('verificacion');
    }
  } catch (errorVerificacion) {
    return _wordFinalizarError(
      WORD_CODIGOS_ERROR.VERIFICACION_ERROR,
      'No fue posible verificar el archivo Word.',
      contexto,
      'verificacion'
    );
  }

  const resultado = {
    exito: true,
    datos: { idArchivoDocx: idArchivoDocx },
    error: null
  };
  _wordRegistrar(
    'La exportación a Word finalizó correctamente.',
    contexto,
    { etapa: 'finalizacion', resultado: 'correcto',
      correlativo: datosExportacion.correlativo },
    false
  );
  return resultado;
}

function _wordValidarDatosExportacion(datos) {
  return _wordClavesExactas(
    datos,
    ['correlativo', 'fechaReunion', 'carpetaDestinoId']
  ) && Number.isSafeInteger(datos.correlativo) &&
    datos.correlativo > 0 && esCadenaNoVacia(datos.fechaReunion) &&
    esCadenaNoVacia(datos.carpetaDestinoId);
}

function _wordValidarContexto(contexto) {
  return _wordClavesExactas(contexto, ['idEjecucion']) &&
    esCadenaNoVacia(contexto.idEjecucion);
}

function _wordClavesExactas(valor, esperadas) {
  try {
    if (!esObjetoPlano(valor)) return false;
    const claves = Object.keys(valor);
    return claves.length === esperadas.length && claves.every(function (clave) {
      return esperadas.includes(clave);
    });
  } catch (errorValidacion) {
    return false;
  }
}

function _wordNormalizarFecha(fechaReunion) {
  const patrones = [
    { expresion: /^(\d{4})-(\d{2})-(\d{2})$/, orden: [1, 2, 3] },
    { expresion: /^(\d{2})[./](\d{2})[./](\d{4})$/, orden: [3, 2, 1] }
  ];

  for (let indice = 0; indice < patrones.length; indice += 1) {
    const coincidencia = patrones[indice].expresion.exec(fechaReunion);
    if (!coincidencia) continue;
    const anio = Number(coincidencia[patrones[indice].orden[0]]);
    const mes = Number(coincidencia[patrones[indice].orden[1]]);
    const dia = Number(coincidencia[patrones[indice].orden[2]]);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));

    if (fecha.getUTCFullYear() === anio &&
      fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia) {
      return String(dia).padStart(2, '0') + '.' +
        String(mes).padStart(2, '0') + '.' + String(anio);
    }
  }
  return null;
}

function _wordVerificarArchivo(idArchivo, nombre, carpetaId) {
  const archivo = DriveApp.getFileById(idArchivo);
  if (!archivo || archivo.isTrashed() || archivo.getId() !== idArchivo ||
    archivo.getName() !== nombre || archivo.getMimeType() !== WORD_MIME_DOCX) {
    return false;
  }
  const padres = archivo.getParents();
  while (padres.hasNext()) {
    if (padres.next().getId() === carpetaId) return true;
  }
  return false;
}

function _wordFinalizarError(codigo, mensaje, contexto, etapa) {
  const resultado = {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
  _wordRegistrar(
    mensaje,
    contexto,
    { etapa: etapa, resultado: 'error', codigo: codigo },
    true
  );
  return resultado;
}

function _wordRegistrar(mensaje, contexto, datos, esError) {
  try {
    const contextoRegistro = { datos: datos };
    if (contexto !== undefined) {
      contextoRegistro.idEjecucion = contexto.idEjecucion;
    }
    if (esError) {
      registrarError('Word', 'exportarDocumentoWord', mensaje, contextoRegistro);
    } else {
      registrarInfo('Word', 'exportarDocumentoWord', mensaje, contextoRegistro);
    }
  } catch (errorRegistro) {
    // Un fallo de Logger no altera la exportación.
  }
}
