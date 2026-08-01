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
      '  titulo: string no vacía,',
      '  fechaReunion: string no vacía,',
      '  horaInicio: string,',
      '  horaFin: string,',
      '  lugar: string,',
      '  organizador: string,',
      '  participantes: [{nombre:string no vacía,cargo:string}],',
      '  agenda: [string no vacía],',
      '  resumenEjecutivo: string no vacía,',
      '  acuerdos: [{numero:integer,descripcion:string no vacía}],',
      '  tareas: [{numero:integer,descripcion:string no vacía,',
      '    responsable:string,fechaCompromiso:string}],',
      '  observaciones: string',
      '}'
    ].join('\n');
    const instrucciones = [
      'Estructura notas de reunión como un único objeto JSON.',
      'Devuelve exclusivamente JSON válido, sin Markdown ni texto adicional.',
      'Usa exactamente el esquema indicado y no agregues propiedades.',
      'No inventes datos, fechas, horas, responsables ni compromisos.',
      'Intenta extraer del documento todos los textos obligatorios.',
      'titulo, fechaReunion y resumenEjecutivo nunca deben quedar vacíos.',
      'Si no identificas titulo, usa exactamente "NO IDENTIFICADO".',
      'Si no identificas fechaReunion, usa exactamente "NO IDENTIFICADA".',
      'Si no identificas resumenEjecutivo, usa exactamente "NO IDENTIFICADO".',
      'Nunca uses cadena vacía ni null en esos tres campos obligatorios.',
      'Usa cadena vacía para textos opcionales ausentes.',
      'Usa arreglos vacíos para listas ausentes.',
      'No incluyas elementos vacíos o incompletos en las listas.',
      'Construye participantes como la unión de dos fuentes de evidencia: ' +
        'listas de asistencia con nombre y correo visible, y hablantes ' +
        'identificados explícitamente en la transcripción.',
      'Considera hablante confirmado a quien aparezca al inicio de una ' +
        'intervención con el formato Nombre: texto.',
      'El registro de ingreso con nombre y correo es suficiente: incluye a ' +
        'la persona aunque no haya hablado ni aparezca en el desarrollo.',
      'Incluye también organizadores, anfitriones y convocantes cuando su ' +
        'nombre tenga un correo asociado en el contenido fuente.',
      'Incluye a todo hablante identificado en la transcripción aunque no ' +
        'tenga correo visible en el contenido fuente.',
      'Revisa las listas de acceso y la transcripción e incluye exactamente ' +
        'una vez cada participante confirmado por cualquiera de las dos ' +
        'fuentes de evidencia.',
      'Usa como fuente de asistencia las listas o secciones de participantes ' +
        'donde figuren juntos el nombre y el correo, y las etiquetas de ' +
        'hablante que preceden intervenciones en la transcripción.',
      'No clasifiques como participante a una persona mencionada únicamente ' +
        'en temas, narraciones, acuerdos, tareas o referencias a terceros.',
      'No conviertas automáticamente responsables, destinatarios o personas ' +
        'citadas en asistentes.',
      'No omitas a una persona con correo por no tener intervenciones, tareas ' +
        'o menciones dentro del contenido narrativo.',
      'Una mención dentro del texto de una intervención no confirma ' +
        'asistencia; solo confirma asistencia una etiqueta de hablante o el ' +
        'registro conjunto de nombre y correo.',
      'Si no existe ninguna de esas dos evidencias, omite a la persona.',
      'Usa el correo solo como evidencia; no lo copies en nombre ni cargo y ' +
        'no agregues propiedades al esquema.',
      'Cada participante confirmado requiere nombre no vacío.',
      'Cada elemento de agenda requiere texto no vacío.',
      'Cada acuerdo y tarea requiere descripcion no vacía.',
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
