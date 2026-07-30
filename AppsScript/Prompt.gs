/**
 * Módulo: Prompt
 *
 * Construye mensajes para solicitar a OpenAI un acta JSON estricta. No invoca
 * servicios externos, no trunca contenido y no registra texto institucional.
 */

const PROMPT_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'PROMPT_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'PROMPT_CONTEXTO_INVALIDO',
  ERROR: 'PROMPT_ERROR'
});

/**
 * Construye los mensajes de sistema y usuario para estructurar un acta.
 *
 * @param {string} contenidoFuente Texto completo del documento fuente.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({mensajes: Object[]}|null), error: (Object|null)}}
 */
function construirPromptActa(contenidoFuente, contexto) {
  if (!esCadenaNoVacia(contenidoFuente)) {
    return _promptFinalizarError(
      PROMPT_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'El contenido fuente no es válido.',
      undefined
    );
  }

  if (!_promptValidarContexto(contexto)) {
    return _promptFinalizarError(
      PROMPT_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto del prompt no es válido.',
      undefined
    );
  }

  try {
    const esquema = [
      '{',
      '  titulo: string,',
      '  fechaReunion: string,',
      '  horaInicio: string,',
      '  horaFin: string,',
      '  lugar: string,',
      '  organizador: string,',
      '  participantes: [{nombre:string,cargo:string}],',
      '  agenda: [string],',
      '  resumenEjecutivo: string,',
      '  acuerdos: [{numero:integer,descripcion:string}],',
      '  tareas: [{numero:integer,descripcion:string,',
      '    responsable:string,fechaCompromiso:string}],',
      '  observaciones: string',
      '}'
    ].join('\n');
    const instrucciones = [
      'Estructura notas de reunión como un único objeto JSON.',
      'Devuelve exclusivamente JSON válido, sin Markdown ni texto adicional.',
      'Usa exactamente el esquema indicado y no agregues propiedades.',
      'No inventes datos, fechas, horas, responsables ni compromisos.',
      'Usa cadena vacía para textos opcionales ausentes.',
      'Usa arreglos vacíos para listas ausentes.',
      'Numera acuerdos y tareas secuencialmente desde 1.',
      'No incluyas HTML, Markdown, bloques de código ni JSON en textos.',
      'Esquema obligatorio:',
      esquema
    ].join('\n');
    const mensajes = [
      { role: 'system', content: instrucciones },
      {
        role: 'user',
        content: 'Contenido fuente de la reunión:\n\n' + contenidoFuente
      }
    ];
    const resultado = {
      exito: true,
      datos: { mensajes: mensajes },
      error: null
    };

    _promptRegistrar(
      'La construcción del prompt finalizó correctamente.',
      contexto,
      { etapa: 'finalizacion', resultado: 'correcto' },
      false
    );
    return resultado;
  } catch (errorInterno) {
    return _promptFinalizarError(
      PROMPT_CODIGOS_ERROR.ERROR,
      'No fue posible construir el prompt del acta.',
      contexto
    );
  }
}

function _promptValidarContexto(contexto) {
  try {
    const claves = esObjetoPlano(contexto) ? Object.keys(contexto) : [];
    return claves.length === 1 && claves[0] === 'idEjecucion' &&
      esCadenaNoVacia(contexto.idEjecucion);
  } catch (errorValidacion) {
    return false;
  }
}

function _promptFinalizarError(codigo, mensaje, contexto) {
  const resultado = {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
  _promptRegistrar(mensaje, contexto, {
    etapa: 'error', resultado: 'error', codigo: codigo
  }, true);
  return resultado;
}

function _promptRegistrar(mensaje, contexto, datos, esError) {
  try {
    const contextoRegistro = { datos: datos };
    if (contexto !== undefined) {
      contextoRegistro.idEjecucion = contexto.idEjecucion;
    }
    if (esError) {
      registrarError('Prompt', 'construirPromptActa', mensaje, contextoRegistro);
    } else {
      registrarInfo('Prompt', 'construirPromptActa', mensaje, contextoRegistro);
    }
  } catch (errorRegistro) {
    // La auditoría no altera el resultado funcional.
  }
}
