/**
 * Módulo: GeminiIA
 *
 * Encapsula la comunicación técnica con la API de Google Gemini (generateContent)
 * para la estructuración de actas institucionales en formato JSON.
 * No valida el contrato funcional de las actas ni almacena secretos.
 */

const GEMINI_IA_ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

const GEMINI_IA_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'GEMINI_IA_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'GEMINI_IA_CONTEXTO_INVALIDO',
  CONFIGURACION_INVALIDA: 'GEMINI_IA_CONFIGURACION_INVALIDA',
  SOLICITUD_RECHAZADA: 'GEMINI_IA_SOLICITUD_RECHAZADA',
  AUTENTICACION_ERROR: 'GEMINI_IA_AUTENTICACION_ERROR',
  LIMITE_EXCEDIDO: 'GEMINI_IA_LIMITE_EXCEDIDO',
  SERVICIO_NO_DISPONIBLE: 'GEMINI_IA_SERVICIO_NO_DISPONIBLE',
  RESPUESTA_INVALIDA: 'GEMINI_IA_RESPUESTA_INVALIDA',
  RED_ERROR: 'GEMINI_IA_RED_ERROR',
  ERROR: 'GEMINI_IA_ERROR'
});

/**
 * Solicita a Google Gemini una respuesta textual estructurada como JSON.
 *
 * @param {{role: string, content: string}[]} mensajes Mensajes de Prompt.gs.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({respuestaTexto: string}|null), error: (Object|null)}}
 */
function solicitarActaEstructuradaGemini(mensajes, contexto) {
  if (!_geminiIAValidarMensajes(mensajes)) {
    return _geminiIAFinalizarError(
      GEMINI_IA_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'Los mensajes de la solicitud a Gemini no son válidos.',
      undefined,
      'validacion'
    );
  }
  if (!_geminiIAValidarContexto(contexto)) {
    return _geminiIAFinalizarError(
      GEMINI_IA_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de la solicitud no es válido.',
      undefined,
      'validacion'
    );
  }

  let configuracion;
  try {
    configuracion = obtenerConfiguracion();
  } catch (errorConfiguracion) {
    return _geminiIAFinalizarError(
      GEMINI_IA_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
      'La configuración de Gemini no es válida.',
      contexto,
      'configuracion'
    );
  }

  const configGeminiIA = configuracion && configuracion.geminiIA ? configuracion.geminiIA : null;
  if (
    !configGeminiIA ||
    !esCadenaNoVacia(configGeminiIA.apiKey) ||
    !esCadenaNoVacia(configGeminiIA.modelo)
  ) {
    return _geminiIAFinalizarError(
      GEMINI_IA_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
      'La configuración de la API de Gemini (API key o modelo) no es válida.',
      contexto,
      'configuracion'
    );
  }

  const modelo = configGeminiIA.modelo;
  const urlEndpoint = GEMINI_IA_ENDPOINT_BASE + modelo + ':generateContent?key=' + configGeminiIA.apiKey;

  const carga = _geminiIAConstruirCarga(mensajes);
  let respuestaHttp;

  try {
    respuestaHttp = UrlFetchApp.fetch(urlEndpoint, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(carga),
      muteHttpExceptions: true
    });
  } catch (errorRed) {
    return _geminiIAFinalizarError(
      GEMINI_IA_CODIGOS_ERROR.RED_ERROR,
      'No fue posible comunicar con la API de Google Gemini.',
      contexto,
      'red'
    );
  }

  const estadoHttp = respuestaHttp.getResponseCode();
  if (estadoHttp < 200 || estadoHttp >= 300) {
    return _geminiIAResultadoHttpError(estadoHttp, contexto);
  }

  const textoRespuestaHttp = respuestaHttp.getContentText();
  if (!esCadenaNoVacia(textoRespuestaHttp)) {
    return _geminiIAFinalizarError(
      GEMINI_IA_CODIGOS_ERROR.RESPUESTA_INVALIDA,
      'Google Gemini devolvió una respuesta vacía.',
      contexto,
      'respuesta'
    );
  }

  try {
    const cuerpo = JSON.parse(textoRespuestaHttp);
    const candidato = cuerpo && Array.isArray(cuerpo.candidates) && cuerpo.candidates.length > 0
      ? cuerpo.candidates[0]
      : null;

    if (!candidato) {
      return _geminiIAFinalizarError(
        GEMINI_IA_CODIGOS_ERROR.RESPUESTA_INVALIDA,
        'Google Gemini no generó candidatos válidos en la respuesta.',
        contexto,
        'respuesta'
      );
    }

    if (candidato.finishReason && candidato.finishReason !== 'STOP') {
      if (candidato.finishReason === 'SAFETY' || candidato.finishReason === 'RECITATION') {
        return _geminiIAFinalizarError(
          GEMINI_IA_CODIGOS_ERROR.SOLICITUD_RECHAZADA,
          'Google Gemini rechazó la solicitud por políticas de contenido (' + candidato.finishReason + ').',
          contexto,
          'respuesta'
        );
      }
    }

    const partes = candidato.content && Array.isArray(candidato.content.parts)
      ? candidato.content.parts
      : [];

    const parteTexto = partes.find(function (parte) {
      return esObjetoPlano(parte) && esCadenaNoVacia(parte.text);
    });

    const respuestaTexto = parteTexto ? parteTexto.text : null;

    if (!esCadenaNoVacia(respuestaTexto)) {
      return _geminiIAFinalizarError(
        GEMINI_IA_CODIGOS_ERROR.RESPUESTA_INVALIDA,
        'Google Gemini no incluyó texto de respuesta válido.',
        contexto,
        'respuesta'
      );
    }

    const resultado = {
      exito: true,
      datos: { respuestaTexto: respuestaTexto },
      error: null
    };

    _geminiIARegistrar(
      'La solicitud a Google Gemini finalizó correctamente.',
      contexto,
      { etapa: 'finalizacion', resultado: 'correcto', modelo: modelo },
      false
    );

    return resultado;
  } catch (errorParseo) {
    return _geminiIAFinalizarError(
      GEMINI_IA_CODIGOS_ERROR.RESPUESTA_INVALIDA,
      'No fue posible interpretar la respuesta JSON de Google Gemini.',
      contexto,
      'respuesta'
    );
  }
}

/**
 * Transforma los mensajes del formato {role, content} al formato de la API REST de Gemini.
 *
 * @param {{role: string, content: string}[]} mensajes Arreglo de mensajes de entrada.
 * @returns {Object} Estructura JSON para la API de Gemini.
 * @private
 */
function _geminiIAConstruirCarga(mensajes) {
  let sistemaTexto = '';
  const contenidos = [];

  mensajes.forEach(function (mensaje) {
    if (mensaje.role === 'system') {
      sistemaTexto += (sistemaTexto ? '\n\n' : '') + mensaje.content;
    } else if (mensaje.role === 'user') {
      contenidos.push({
        role: 'user',
        parts: [{ text: mensaje.content }]
      });
    }
  });

  const carga = {
    contents: contenidos,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: _geminiIAConstruirEsquemaActa()
    }
  };

  if (esCadenaNoVacia(sistemaTexto)) {
    carga.systemInstruction = {
      parts: [{ text: sistemaTexto }]
    };
  }

  return carga;
}

/**
 * Construye el esquema JSON en formato OpenAPI/Gemini para la validación estricta de salida.
 *
 * @returns {Object} Esquema de objeto para la API de Gemini.
 * @private
 */
function _geminiIAConstruirEsquemaActa() {
  const texto = { type: 'STRING' };
  return {
    type: 'OBJECT',
    required: [
      'titulo', 'fechaReunion', 'horaInicio', 'horaFin', 'lugar',
      'organizador', 'participantes', 'agenda', 'resumenEjecutivo', 'acuerdos',
      'tareas', 'observaciones'
    ],
    properties: {
      titulo: texto,
      fechaReunion: texto,
      horaInicio: texto,
      horaFin: texto,
      lugar: texto,
      organizador: texto,
      participantes: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          required: ['nombre', 'cargo'],
          properties: { nombre: texto, cargo: texto }
        }
      },
      agenda: { type: 'ARRAY', items: texto },
      resumenEjecutivo: texto,
      acuerdos: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          required: ['numero', 'descripcion', 'responsable'],
          properties: {
            numero: { type: 'INTEGER' },
            descripcion: texto,
            responsable: texto
          }
        }
      },
      tareas: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          required: ['numero', 'descripcion', 'responsable', 'fechaCompromiso'],
          properties: {
            numero: { type: 'INTEGER' },
            descripcion: texto,
            responsable: texto,
            fechaCompromiso: texto
          }
        }
      },
      observaciones: texto
    }
  };
}

function _geminiIAValidarMensajes(mensajes) {
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

function _geminiIAValidarContexto(contexto) {
  try {
    const claves = esObjetoPlano(contexto) ? Object.keys(contexto) : [];
    return claves.length === 1 && claves[0] === 'idEjecucion' &&
      esCadenaNoVacia(contexto.idEjecucion);
  } catch (errorValidacion) {
    return false;
  }
}

function _geminiIAResultadoHttpError(estadoHttp, contexto) {
  let codigo = GEMINI_IA_CODIGOS_ERROR.SOLICITUD_RECHAZADA;
  let mensaje = 'Google Gemini rechazó la solicitud.';
  if (estadoHttp === 401 || estadoHttp === 403) {
    codigo = GEMINI_IA_CODIGOS_ERROR.AUTENTICACION_ERROR;
    mensaje = 'No fue posible autenticar la solicitud a la API de Google Gemini (verifica la clave GEMINI_API_KEY).';
  } else if (estadoHttp === 429) {
    codigo = GEMINI_IA_CODIGOS_ERROR.LIMITE_EXCEDIDO;
    mensaje = 'Google Gemini no puede atender la solicitud por límites de cuota (429).';
  } else if (estadoHttp >= 500) {
    codigo = GEMINI_IA_CODIGOS_ERROR.SERVICIO_NO_DISPONIBLE;
    mensaje = 'El servicio de Google Gemini no está disponible temporalmente.';
  }
  return _geminiIAFinalizarError(codigo, mensaje, contexto, 'http');
}

function _geminiIAFinalizarError(codigo, mensaje, contexto, etapa) {
  const resultado = {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
  _geminiIARegistrar(mensaje, contexto, {
    etapa: etapa, resultado: 'error', codigo: codigo
  }, true);
  return resultado;
}

function _geminiIARegistrar(mensaje, contexto, datos, esError) {
  try {
    const contextoRegistro = { datos: datos };
    if (contexto !== undefined) contextoRegistro.idEjecucion = contexto.idEjecucion;
    if (esError) {
      registrarError('GeminiIA', 'solicitarActaEstructuradaGemini', mensaje, contextoRegistro);
    } else {
      registrarInfo('GeminiIA', 'solicitarActaEstructuradaGemini', mensaje, contextoRegistro);
    }
  } catch (errorRegistro) {
    // La auditoría no altera el resultado funcional.
  }
}
