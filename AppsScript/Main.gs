/**
 * Módulo: Main
 *
 * Orquesta secuencialmente el flujo completo y consolida un resultado privado
 * de identificadores documentales y contenido institucional.
 */

const MAIN_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'MAIN_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'MAIN_CONTEXTO_INVALIDO',
  CONFIGURACION_INVALIDA: 'MAIN_CONFIGURACION_INVALIDA',
  FUENTES_ERROR: 'MAIN_FUENTES_ERROR',
  PROCESADOS_ERROR: 'MAIN_PROCESADOS_ERROR',
  LECTURA_ERROR: 'MAIN_LECTURA_ERROR',
  PROMPT_ERROR: 'MAIN_PROMPT_ERROR',
  OPENAI_ERROR: 'MAIN_OPENAI_ERROR',
  VALIDACION_ERROR: 'MAIN_VALIDACION_ERROR',
  CORRELATIVO_ERROR: 'MAIN_CORRELATIVO_ERROR',
  ACTA_ERROR: 'MAIN_ACTA_ERROR',
  WORD_ERROR: 'MAIN_WORD_ERROR',
  REGISTRO_ERROR: 'MAIN_REGISTRO_ERROR',
  ERROR: 'MAIN_ERROR'
});

const MAIN_MENSAJES_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'Los parámetros de la ejecución no son válidos.',
  CONTEXTO_INVALIDO: 'No fue posible generar el contexto de ejecución.',
  CONFIGURACION_INVALIDA: 'La configuración general no es válida.',
  FUENTES_ERROR: 'No fue posible obtener los documentos fuente.',
  PROCESADOS_ERROR: 'No fue posible consultar el registro de procesados.',
  ERROR: 'No fue posible completar la ejecución.'
});

const MAIN_ETAPAS = Object.freeze({
  INICIALIZACION: 'INICIALIZACION',
  OBTENCION_FUENTES: 'OBTENCION_FUENTES',
  CONSULTA_PROCESADOS: 'CONSULTA_PROCESADOS',
  LECTURA_FUENTE: 'LECTURA_FUENTE',
  PROMPT: 'PROMPT',
  OPENAI: 'OPENAI',
  VALIDACION: 'VALIDACION',
  CORRELATIVO: 'CORRELATIVO',
  ACTA: 'ACTA',
  WORD: 'WORD',
  PROCESADOS: 'PROCESADOS',
  FINALIZADO: 'FINALIZADO',
  YA_PROCESADO: 'YA_PROCESADO'
});

/**
 * Ejecuta la generación secuencial de actas para los documentos candidatos.
 *
 * @param {Object} parametros Objeto plano sin propiedades.
 * @returns {{exito: boolean, datos: (Object|null), error: (Object|null)}}
 */
function ejecutarGeneracionActas(parametros) {
  if (!_mainValidarParametros(parametros)) {
    return _mainFinalizarErrorGlobal(
      MAIN_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      MAIN_MENSAJES_ERROR.PARAMETRO_INVALIDO,
      undefined,
      MAIN_ETAPAS.INICIALIZACION
    );
  }

  let contexto;
  try {
    const idEjecucion = Utilities.getUuid();
    if (!esCadenaNoVacia(idEjecucion)) throw new Error('contexto');
    contexto = Object.freeze({ idEjecucion: idEjecucion });
  } catch (errorContexto) {
    return _mainFinalizarErrorGlobal(
      MAIN_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      MAIN_MENSAJES_ERROR.CONTEXTO_INVALIDO,
      undefined,
      MAIN_ETAPAS.INICIALIZACION
    );
  }

  _mainRegistrar(
    'La ejecución End-to-End fue iniciada.',
    contexto,
    { etapa: MAIN_ETAPAS.INICIALIZACION, resultado: 'iniciado' },
    false
  );

  let configuracion;
  try {
    configuracion = obtenerConfiguracion();
  } catch (errorConfiguracion) {
    return _mainFinalizarErrorGlobal(
      MAIN_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
      MAIN_MENSAJES_ERROR.CONFIGURACION_INVALIDA,
      contexto,
      MAIN_ETAPAS.INICIALIZACION
    );
  }

  if (!_mainValidarConfiguracion(configuracion)) {
    return _mainFinalizarErrorGlobal(
      MAIN_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
      MAIN_MENSAJES_ERROR.CONFIGURACION_INVALIDA,
      contexto,
      MAIN_ETAPAS.INICIALIZACION
    );
  }

  let resultadoFuentes;
  try {
    resultadoFuentes = obtenerDocumentosFuente(
      configuracion.gemini.carpetaNotasId,
      contexto
    );
  } catch (errorFuentes) {
    resultadoFuentes = null;
  }

  if (!_mainResultadoExitoso(resultadoFuentes) ||
    !resultadoFuentes.datos ||
    !Array.isArray(resultadoFuentes.datos.documentos)) {
    return _mainFinalizarErrorGlobal(
      MAIN_CODIGOS_ERROR.FUENTES_ERROR,
      MAIN_MENSAJES_ERROR.FUENTES_ERROR,
      contexto,
      MAIN_ETAPAS.OBTENCION_FUENTES
    );
  }

  const documentos = resultadoFuentes.datos.documentos;
  const resultados = [];

  for (let indice = 0; indice < documentos.length; indice += 1) {
    const documento = documentos[indice];
    const posicion = indice + 1;

    if (!_mainValidarDescriptor(documento)) {
      resultados.push(_mainResultadoIndividualError(
        posicion,
        MAIN_ETAPAS.OBTENCION_FUENTES,
        null,
        MAIN_CODIGOS_ERROR.FUENTES_ERROR
      ));
      continue;
    }

    let consulta;
    try {
      consulta = consultarEstadoProcesamiento(
        configuracion.procesados.repositorioId,
        documento.idDocumentoFuente,
        contexto
      );
    } catch (errorConsulta) {
      consulta = null;
    }

    if (!_mainResultadoExitoso(consulta) || !consulta.datos) {
      return _mainFinalizarErrorGlobal(
        MAIN_CODIGOS_ERROR.PROCESADOS_ERROR,
        MAIN_MENSAJES_ERROR.PROCESADOS_ERROR,
        contexto,
        MAIN_ETAPAS.CONSULTA_PROCESADOS
      );
    }

    if (consulta.datos.estado === 'PROCESADO') {
      resultados.push({
        posicion: posicion,
        estado: 'OMITIDO',
        etapaFinal: MAIN_ETAPAS.YA_PROCESADO,
        correlativo: null,
        codigoError: null
      });
      continue;
    }

    if (consulta.datos.estado !== 'PENDIENTE') {
      resultados.push(_mainResultadoIndividualError(
        posicion,
        MAIN_ETAPAS.CONSULTA_PROCESADOS,
        null,
        MAIN_CODIGOS_ERROR.PROCESADOS_ERROR
      ));
      continue;
    }

    resultados.push(_mainProcesarDocumento(
      documento,
      posicion,
      configuracion,
      contexto
    ));
  }

  const datos = _mainConstruirResumen(
    contexto.idEjecucion,
    documentos.length,
    resultados
  );
  const resultado = { exito: true, datos: datos, error: null };
  _mainRegistrar(
    'La ejecución End-to-End finalizó.',
    contexto,
    {
      etapa: MAIN_ETAPAS.FINALIZADO,
      resultado: 'finalizado',
      totalDocumentosFuente: datos.totalDocumentosFuente,
      totalOmitidos: datos.totalOmitidos,
      totalProcesados: datos.totalProcesados,
      totalFallidos: datos.totalFallidos
    },
    false
  );
  return resultado;
}

function _mainProcesarDocumento(documento, posicion, configuracion, contexto) {
  let correlativo = null;
  let idDocumentoGoogle;
  let idArchivoDocx;
  let inicioRegistrado = false;

  try {
    const lectura = leerContenidoDocumentoFuente(
      documento.idDocumentoFuente,
      contexto
    );
    if (!_mainResultadoExitoso(lectura) || !lectura.datos ||
      !esCadenaNoVacia(lectura.datos.contenidoFuente)) {
      return _mainResultadoDesdeModulo(
        posicion,
        MAIN_ETAPAS.LECTURA_FUENTE,
        correlativo,
        lectura,
        MAIN_CODIGOS_ERROR.LECTURA_ERROR
      );
    }

    const prompt = construirPromptActa(
      lectura.datos.contenidoFuente,
      contexto
    );
    if (!_mainResultadoExitoso(prompt) || !prompt.datos ||
      !Array.isArray(prompt.datos.mensajes)) {
      return _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.PROMPT, correlativo, prompt,
        MAIN_CODIGOS_ERROR.PROMPT_ERROR
      );
    }

    const openAI = solicitarActaEstructurada(prompt.datos.mensajes, contexto);
    if (!_mainResultadoExitoso(openAI) || !openAI.datos ||
      !esCadenaNoVacia(openAI.datos.respuestaTexto)) {
      return _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.OPENAI, correlativo, openAI,
        MAIN_CODIGOS_ERROR.OPENAI_ERROR
      );
    }

    const validacion = validarRespuestaActa(
      openAI.datos.respuestaTexto,
      contexto
    );
    if (!_mainResultadoExitoso(validacion) || !validacion.datos ||
      !esObjetoPlano(validacion.datos.respuestaActaValidada)) {
      return _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.VALIDACION, correlativo, validacion,
        MAIN_CODIGOS_ERROR.VALIDACION_ERROR
      );
    }

    const fechaCreacionDocumento = new Date(documento.fechaCreacion);

    if (isNaN(fechaCreacionDocumento.getTime())) {
      throw new Error(
        'La fecha de creación del documento fuente no es válida.'
      );
    }

    validacion.datos.respuestaActaValidada.fechaReunion =
      Utilities.formatDate(
        fechaCreacionDocumento,
        Session.getScriptTimeZone(),
        'dd/MM/yyyy'
      );

    const reserva = reservarSiguienteCorrelativo(contexto);
    if (!_mainResultadoExitoso(reserva) || !reserva.datos ||
      !Number.isSafeInteger(reserva.datos.correlativo) ||
      reserva.datos.correlativo <= 0) {
      return _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.CORRELATIVO, correlativo, reserva,
        MAIN_CODIGOS_ERROR.CORRELATIVO_ERROR
      );
    }
    correlativo = reserva.datos.correlativo;

    const inicio = registrarInicioProcesamiento(
      configuracion.procesados.repositorioId,
      {
        idDocumentoFuente: documento.idDocumentoFuente,
        correlativo: correlativo
      },
      contexto
    );
    if (!_mainResultadoExitoso(inicio) || !inicio.datos ||
      inicio.datos.estado !== 'EN_PROCESO') {
      return _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.PROCESADOS, correlativo, inicio,
        MAIN_CODIGOS_ERROR.REGISTRO_ERROR
      );
    }
    inicioRegistrado = true;

    const acta = generarDocumentoActa(
      validacion.datos.respuestaActaValidada,
      {
        correlativo: correlativo,
        carpetaDestinoId: configuracion.actas.carpetaRaizId
      },
      contexto
    );
    if (!_mainResultadoExitoso(acta) || !acta.datos ||
      !esCadenaNoVacia(acta.datos.idDocumentoGoogle)) {
      const resultadoActa = _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.ACTA, correlativo, acta,
        MAIN_CODIGOS_ERROR.ACTA_ERROR
      );
      _mainPersistirErrorDocumento(
        documento.idDocumentoFuente,
        correlativo,
        resultadoActa.codigoError,
        undefined,
        undefined,
        configuracion,
        contexto
      );
      return resultadoActa;
    }
    idDocumentoGoogle = acta.datos.idDocumentoGoogle;

    const word = exportarDocumentoWord(
      idDocumentoGoogle,
      {
        correlativo: correlativo,
        fechaReunion:
          validacion.datos.respuestaActaValidada.fechaReunion,
        carpetaDestinoId: configuracion.actas.carpetaRaizId
      },
      contexto
    );
    if (!_mainResultadoExitoso(word) || !word.datos ||
      !esCadenaNoVacia(word.datos.idArchivoDocx)) {
      const resultadoWord = _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.WORD, correlativo, word,
        MAIN_CODIGOS_ERROR.WORD_ERROR
      );
      _mainPersistirErrorDocumento(
        documento.idDocumentoFuente,
        correlativo,
        resultadoWord.codigoError,
        idDocumentoGoogle,
        undefined,
        configuracion,
        contexto
      );
      return resultadoWord;
    }
    idArchivoDocx = word.datos.idArchivoDocx;

    const finalizacion = marcarProcesamientoCompletado(
      configuracion.procesados.repositorioId,
      {
        idDocumentoFuente: documento.idDocumentoFuente,
        correlativo: correlativo,
        idDocumentoGoogle: idDocumentoGoogle,
        idArchivoDocx: idArchivoDocx
      },
      contexto
    );
    if (!_mainResultadoExitoso(finalizacion) || !finalizacion.datos ||
      finalizacion.datos.estado !== 'PROCESADO') {
      return _mainResultadoDesdeModulo(
        posicion, MAIN_ETAPAS.PROCESADOS, correlativo, finalizacion,
        MAIN_CODIGOS_ERROR.REGISTRO_ERROR
      );
    }

    _mainRegistrar(
      'El documento finalizó correctamente.',
      contexto,
      { etapa: MAIN_ETAPAS.FINALIZADO, resultado: 'correcto',
        posicion: posicion, correlativo: correlativo },
      false
    );
    return {
      posicion: posicion,
      estado: 'PROCESADO',
      etapaFinal: MAIN_ETAPAS.FINALIZADO,
      correlativo: correlativo,
      codigoError: null
    };
  } catch (errorInterno) {
    if (inicioRegistrado && correlativo !== null) {
      _mainPersistirErrorDocumento(
        documento.idDocumentoFuente,
        correlativo,
        MAIN_CODIGOS_ERROR.ERROR,
        idDocumentoGoogle,
        idArchivoDocx,
        configuracion,
        contexto
      );
    }
    return _mainResultadoIndividualError(
      posicion,
      correlativo === null
        ? MAIN_ETAPAS.LECTURA_FUENTE
        : MAIN_ETAPAS.PROCESADOS,
      correlativo,
      MAIN_CODIGOS_ERROR.ERROR
    );
  }
}

function _mainPersistirErrorDocumento(
  idDocumentoFuente,
  correlativo,
  codigoError,
  idDocumentoGoogle,
  idArchivoDocx,
  configuracion,
  contexto
) {
  try {
    const datos = {
      idDocumentoFuente: idDocumentoFuente,
      correlativo: correlativo,
      codigoError: codigoError
    };
    if (esCadenaNoVacia(idDocumentoGoogle)) {
      datos.idDocumentoGoogle = idDocumentoGoogle;
    }
    if (esCadenaNoVacia(idArchivoDocx)) {
      datos.idArchivoDocx = idArchivoDocx;
    }
    marcarProcesamientoConError(
      configuracion.procesados.repositorioId,
      datos,
      contexto
    );
  } catch (errorPersistencia) {
    // El fallo original prevalece y no se realiza rollback.
  }
}

function _mainValidarParametros(parametros) {
  try {
    return esObjetoPlano(parametros) && Object.keys(parametros).length === 0;
  } catch (errorValidacion) {
    return false;
  }
}

function _mainValidarConfiguracion(configuracion) {
  try {
    return esObjetoPlano(configuracion) &&
      esObjetoPlano(configuracion.gemini) &&
      esCadenaNoVacia(configuracion.gemini.carpetaNotasId) &&
      esObjetoPlano(configuracion.actas) &&
      esCadenaNoVacia(configuracion.actas.carpetaRaizId) &&
      esObjetoPlano(configuracion.procesados) &&
      esCadenaNoVacia(configuracion.procesados.repositorioId);
  } catch (errorValidacion) {
    return false;
  }
}

function _mainValidarDescriptor(documento) {
  try {
    const claves = [
      'idDocumentoFuente', 'nombre', 'mimeType',
      'fechaCreacion', 'fechaModificacion'
    ];
    return esObjetoPlano(documento) &&
      Object.keys(documento).length === claves.length &&
      Object.keys(documento).every(function (clave) {
        return claves.includes(clave);
      }) && esCadenaNoVacia(documento.idDocumentoFuente) &&
      esCadenaNoVacia(documento.nombre) &&
      esCadenaNoVacia(documento.mimeType) &&
      esCadenaNoVacia(documento.fechaCreacion) &&
      esCadenaNoVacia(documento.fechaModificacion);
  } catch (errorValidacion) {
    return false;
  }
}

function _mainResultadoExitoso(resultado) {
  return esObjetoPlano(resultado) && resultado.exito === true &&
    resultado.error === null;
}

function _mainResultadoDesdeModulo(
  posicion,
  etapa,
  correlativo,
  resultadoModulo,
  codigoPredeterminado
) {
  const codigo = resultadoModulo && resultadoModulo.error &&
    esCadenaNoVacia(resultadoModulo.error.codigo)
    ? resultadoModulo.error.codigo
    : codigoPredeterminado;
  return _mainResultadoIndividualError(
    posicion,
    etapa,
    correlativo,
    codigo
  );
}

function _mainResultadoIndividualError(posicion, etapa, correlativo, codigo) {
  const resultado = {
    posicion: posicion,
    estado: 'ERROR',
    etapaFinal: etapa,
    correlativo: correlativo,
    codigoError: codigo
  };
  return resultado;
}

function _mainConstruirResumen(idEjecucion, totalFuentes, resultados) {
  return {
    idEjecucion: idEjecucion,
    totalDocumentosFuente: totalFuentes,
    totalOmitidos: resultados.filter(function (item) {
      return item.estado === 'OMITIDO';
    }).length,
    totalProcesados: resultados.filter(function (item) {
      return item.estado === 'PROCESADO';
    }).length,
    totalFallidos: resultados.filter(function (item) {
      return item.estado === 'ERROR';
    }).length,
    resultados: resultados
  };
}

function _mainFinalizarErrorGlobal(codigo, mensaje, contexto, etapa) {
  const resultado = {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
  _mainRegistrar(
    mensaje,
    contexto,
    { etapa: etapa, resultado: 'error', codigo: codigo },
    true
  );
  return resultado;
}

function _mainRegistrar(mensaje, contexto, datos, esError) {
  try {
    const contextoRegistro = { datos: datos };
    if (contexto !== undefined) {
      contextoRegistro.idEjecucion = contexto.idEjecucion;
    }
    if (esError) {
      registrarError('Main', 'ejecutarGeneracionActas', mensaje,
        contextoRegistro);
    } else {
      registrarInfo('Main', 'ejecutarGeneracionActas', mensaje,
        contextoRegistro);
    }
  } catch (errorRegistro) {
    // Un fallo de Logger no modifica el resultado funcional.
  }
}
