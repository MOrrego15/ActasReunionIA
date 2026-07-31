/**
 * Módulo: OpenAI
 *
 * Encapsula la comunicación técnica con Chat Completions y devuelve únicamente
 * el texto útil. No valida el contrato funcional ni registra solicitudes.
 */

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'OPENAI_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'OPENAI_CONTEXTO_INVALIDO',
  CONFIGURACION_INVALIDA: 'OPENAI_CONFIGURACION_INVALIDA',
  SOLICITUD_RECHAZADA: 'OPENAI_SOLICITUD_RECHAZADA',
  AUTENTICACION_ERROR: 'OPENAI_AUTENTICACION_ERROR',
  LIMITE_EXCEDIDO: 'OPENAI_LIMITE_EXCEDIDO',
  SERVICIO_NO_DISPONIBLE: 'OPENAI_SERVICIO_NO_DISPONIBLE',
  RESPUESTA_INVALIDA: 'OPENAI_RESPUESTA_INVALIDA',
  RED_ERROR: 'OPENAI_RED_ERROR',
  ERROR: 'OPENAI_ERROR'
});

/**
 * Solicita a OpenAI una respuesta textual estructurada como JSON.
 *
 * @param {{role: string, content: string}[]} mensajes Mensajes de Prompt.gs.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({respuestaTexto: string}|null), error: (Object|null)}}
 */
function solicitarActaEstructurada(mensajes, contexto) {
  if (!_openAIValidarMensajes(mensajes)) {
    return _openAIFinalizarError(
      OPENAI_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'Los mensajes de la solicitud no son válidos.',
      undefined,
      'validacion'
    );
  }
  if (!_openAIValidarContexto(contexto)) {
    return _openAIFinalizarError(
      OPENAI_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de la solicitud no es válido.',
      undefined,
      'validacion'
    );
  }

  let configuracion;
  try {
    configuracion = obtenerConfiguracion();
  } catch (errorConfiguracion) {
    return _openAIFinalizarError(
      OPENAI_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
      'La configuración de OpenAI no es válida.',
      contexto,
      'configuracion'
    );
  }

  if (
    !configuracion || !configuracion.openAI ||
    !esCadenaNoVacia(configuracion.openAI.apiKey) ||
    !esCadenaNoVacia(configuracion.openAI.modelo)
  ) {
    return _openAIFinalizarError(
      OPENAI_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
      'La configuración de OpenAI no es válida.',
      contexto,
      'configuracion'
    );
  }

  const carga = {
    model: 'gpt-5-mini-2025-08-07',
    reasoning_effort: 'minimal',
    max_completion_tokens: 2500,
    messages: mensajes,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'respuesta_acta_validada',
        strict: true,
        schema: _openAIConstruirEsquemaActa()
      }
    }
  };
  let respuestaHttp;

  try {
    respuestaHttp = UrlFetchApp.fetch(OPENAI_ENDPOINT, {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + configuracion.openAI.apiKey
      },
      payload: JSON.stringify(carga),
      muteHttpExceptions: true
    });
  } catch (errorRed) {
    return _openAIFinalizarError(
      OPENAI_CODIGOS_ERROR.RED_ERROR,
      'No fue posible comunicar con OpenAI.',
      contexto,
      'red'
    );
  }

  const codigoHttpDiagnostico = respuestaHttp.getResponseCode();
  const cuerpoHttpDiagnostico = respuestaHttp.getContentText();

  console.log('OPENAI_HTTP_STATUS=' + respuestaHttp.getResponseCode());
  // console.log('OPENAI_HTTP_BODY=' + cuerpoHttpDiagnostico);

  try {
    const estadoHttp = respuestaHttp.getResponseCode();
    if (estadoHttp < 200 || estadoHttp >= 300) {
      return _openAIResultadoHttpError(estadoHttp, contexto);
    }

    const textoRespuestaHttp = respuestaHttp.getContentText();
    if (!esCadenaNoVacia(textoRespuestaHttp)) {
      return _openAIFinalizarError(
        OPENAI_CODIGOS_ERROR.RESPUESTA_INVALIDA,
        'OpenAI devolvió una respuesta no válida.',
        contexto,
        'respuesta'
      );
    }

    const cuerpo = JSON.parse(textoRespuestaHttp);
    const mensajeRespuesta = cuerpo && Array.isArray(cuerpo.choices) &&
      cuerpo.choices.length > 0 && cuerpo.choices[0]
      ? cuerpo.choices[0].message
      : undefined;

    if (mensajeRespuesta &&
      esCadenaNoVacia(mensajeRespuesta.refusal)) {
      return _openAIFinalizarError(
        OPENAI_CODIGOS_ERROR.SOLICITUD_RECHAZADA,
        'OpenAI rechazó la solicitud.',
        contexto,
        'respuesta'
      );
    }

    const respuestaTexto = mensajeRespuesta
      ? mensajeRespuesta.content
      : undefined;

    if (!esCadenaNoVacia(respuestaTexto)) {
      return _openAIFinalizarError(
        OPENAI_CODIGOS_ERROR.RESPUESTA_INVALIDA,
        'OpenAI devolvió una respuesta no válida.',
        contexto,
        'respuesta'
      );
    }

    const resultado = {
      exito: true,
      datos: { respuestaTexto: respuestaTexto },
      error: null
    };
    _openAIRegistrar(
      'La solicitud a OpenAI finalizó correctamente.',
      contexto,
      { etapa: 'finalizacion', resultado: 'correcto' },
      false
    );
    return resultado;
  } catch (errorRespuesta) {
    return _openAIFinalizarError(
      OPENAI_CODIGOS_ERROR.RESPUESTA_INVALIDA,
      'OpenAI devolvió una respuesta no válida.',
      contexto,
      'respuesta'
    );
  }
}

function _openAIValidarMensajes(mensajes) {
  return Array.isArray(mensajes) && mensajes.length > 0 &&
    mensajes.every(function (mensaje) {
      if (!esObjetoPlano(mensaje)) return false;
      const claves = Object.keys(mensaje);
      return claves.length === 2 && claves.includes('role') &&
        claves.includes('content') &&
        ['system', 'user'].includes(mensaje.role) &&
        esCadenaNoVacia(mensaje.content);
    });
}

function _openAIValidarContexto(contexto) {
  try {
    const claves = esObjetoPlano(contexto) ? Object.keys(contexto) : [];
    return claves.length === 1 && claves[0] === 'idEjecucion' &&
      esCadenaNoVacia(contexto.idEjecucion);
  } catch (errorValidacion) {
    return false;
  }
}

function _openAIConstruirEsquemaActa() {
  const texto = { type: 'string' };
  return {
    type: 'object',
    additionalProperties: false,
    required: ['titulo','fechaReunion','horaInicio','horaFin','lugar',
      'organizador','participantes','agenda','resumenEjecutivo','acuerdos',
      'tareas','observaciones'],
    properties: {
      titulo: texto, fechaReunion: texto, horaInicio: texto, horaFin: texto,
      lugar: texto, organizador: texto,
      participantes: {
        type: 'array', items: {
          type: 'object', additionalProperties: false,
          required: ['nombre','cargo'],
          properties: { nombre: texto, cargo: texto }
        }
      },
      agenda: { type: 'array', items: texto },
      resumenEjecutivo: texto,
      acuerdos: {
        type: 'array', items: {
          type: 'object', additionalProperties: false,
          required: ['numero','descripcion'],
          properties: {
            numero: { type: 'integer', minimum: 1 },
            descripcion: texto
          }
        }
      },
      tareas: {
        type: 'array', items: {
          type: 'object', additionalProperties: false,
          required: ['numero','descripcion','responsable','fechaCompromiso'],
          properties: {
            numero: { type: 'integer', minimum: 1 }, descripcion: texto,
            responsable: texto, fechaCompromiso: texto
          }
        }
      },
      observaciones: texto
    }
  };
}

function _openAIResultadoHttpError(estadoHttp, contexto) {
  let codigo = OPENAI_CODIGOS_ERROR.SOLICITUD_RECHAZADA;
  let mensaje = 'OpenAI rechazó la solicitud.';
  if (estadoHttp === 401 || estadoHttp === 403) {
    codigo = OPENAI_CODIGOS_ERROR.AUTENTICACION_ERROR;
    mensaje = 'No fue posible autenticar la solicitud a OpenAI.';
  } else if (estadoHttp === 429) {
    codigo = OPENAI_CODIGOS_ERROR.LIMITE_EXCEDIDO;
    mensaje = 'OpenAI no puede atender la solicitud por límites operativos.';
  } else if (estadoHttp >= 500) {
    codigo = OPENAI_CODIGOS_ERROR.SERVICIO_NO_DISPONIBLE;
    mensaje = 'El servicio de OpenAI no está disponible.';
  }
  return _openAIFinalizarError(codigo, mensaje, contexto, 'http');
}

function _openAIFinalizarError(codigo, mensaje, contexto, etapa) {
  const resultado = { exito: false, datos: null,
    error: { codigo: codigo, mensaje: mensaje } };
  _openAIRegistrar(mensaje, contexto, {
    etapa: etapa, resultado: 'error', codigo: codigo
  }, true);
  return resultado;
}

function _openAIRegistrar(mensaje, contexto, datos, esError) {
  try {
    const contextoRegistro = { datos: datos };
    if (contexto !== undefined) contextoRegistro.idEjecucion = contexto.idEjecucion;
    if (esError) {
      registrarError('OpenAI', 'solicitarActaEstructurada', mensaje, contextoRegistro);
    } else {
      registrarInfo('OpenAI', 'solicitarActaEstructurada', mensaje, contextoRegistro);
    }
  } catch (errorRegistro) {
    // La auditoría no altera el resultado funcional.
  }
}
