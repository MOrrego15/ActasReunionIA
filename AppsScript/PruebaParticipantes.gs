/**
 * Módulo: PruebaParticipantes
 *
 * Diagnóstico manual y aislado de la extracción de participantes. Lee el
 * documento fuente más reciente y reutiliza el flujo vigente hasta la
 * validación de OpenAI. No genera actas, no reserva correlativos, no modifica
 * estados de procesamiento y no consulta ni actualiza el catálogo persona.
 */

const PRUEBA_PARTICIPANTES_CODIGOS_ERROR = Object.freeze({
  CONFIGURACION_INVALIDA: 'PRUEBA_PARTICIPANTES_CONFIGURACION_INVALIDA',
  FUENTE_NO_DISPONIBLE: 'PRUEBA_PARTICIPANTES_FUENTE_NO_DISPONIBLE',
  LECTURA_ERROR: 'PRUEBA_PARTICIPANTES_LECTURA_ERROR',
  PROMPT_ERROR: 'PRUEBA_PARTICIPANTES_PROMPT_ERROR',
  OPENAI_ERROR: 'PRUEBA_PARTICIPANTES_OPENAI_ERROR',
  VALIDACION_ERROR: 'PRUEBA_PARTICIPANTES_VALIDACION_ERROR',
  ERROR: 'PRUEBA_PARTICIPANTES_ERROR'
});

/**
 * Extrae los participantes del documento fuente más reciente.
 *
 * Esta función está destinada exclusivamente a ejecución manual desde el
 * editor de Apps Script. Realiza una llamada real a OpenAI. Para observar el
 * valor devuelto sin registrar datos personales, ejecútala con el depurador y
 * revisa la variable local `resultado` en la última línea.
 *
 * @returns {{exito: boolean, datos: ({cantidad: number,
 *     participantes: {nombre: string, cargo: string}[]}|null),
 *     error: (Object|null)}} Participantes extraídos o error controlado.
 */
function probarExtraccionParticipantes() {
  const contexto = Object.freeze({ idEjecucion: Utilities.getUuid() });
  let resultado;

  try {
    let configuracion;
    try {
      configuracion = obtenerConfiguracion();
    } catch (errorConfiguracion) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
        'La configuración requerida para la prueba no es válida.'
      );
    }

    const fuentes = obtenerDocumentosFuente(
      configuracion.gemini.carpetaNotasId,
      contexto
    );
    if (!_pruebaParticipantesResultadoExitoso(fuentes) ||
      !fuentes.datos || !Array.isArray(fuentes.datos.documentos) ||
      fuentes.datos.documentos.length !== 1) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.FUENTE_NO_DISPONIBLE,
        'No existe un único documento fuente reciente disponible.'
      );
    }

    const lectura = leerContenidoDocumentoFuente(
      fuentes.datos.documentos[0].idDocumentoFuente,
      contexto
    );
    if (!_pruebaParticipantesResultadoExitoso(lectura) ||
      !lectura.datos || !esCadenaNoVacia(lectura.datos.contenidoFuente)) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.LECTURA_ERROR,
        'No fue posible leer el documento fuente de la prueba.'
      );
    }

    const prompt = construirPromptActa(
      lectura.datos.contenidoFuente,
      contexto
    );
    if (!_pruebaParticipantesResultadoExitoso(prompt) ||
      !prompt.datos || !Array.isArray(prompt.datos.mensajes)) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.PROMPT_ERROR,
        'No fue posible construir el prompt de la prueba.'
      );
    }

    const respuestaOpenAI = solicitarActaEstructurada(
      prompt.datos.mensajes,
      contexto
    );
    if (!_pruebaParticipantesResultadoExitoso(respuestaOpenAI) ||
      !respuestaOpenAI.datos ||
      !esCadenaNoVacia(respuestaOpenAI.datos.respuestaTexto)) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.OPENAI_ERROR,
        'OpenAI no devolvió una respuesta utilizable para la prueba.'
      );
    }

    const validacion = validarRespuestaActa(
      respuestaOpenAI.datos.respuestaTexto,
      contexto
    );
    if (!_pruebaParticipantesResultadoExitoso(validacion) ||
      !validacion.datos ||
      !esObjetoPlano(validacion.datos.respuestaActaValidada) ||
      !Array.isArray(
        validacion.datos.respuestaActaValidada.participantes
      )) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.VALIDACION_ERROR,
        'La respuesta de la prueba no cumple el contrato del acta.'
      );
    }

    const participantes =
      validacion.datos.respuestaActaValidada.participantes.map(
        function (participante) {
          return {
            nombre: participante.nombre,
            cargo: participante.cargo
          };
        }
      );

    resultado = {
      exito: true,
      datos: {
        cantidad: participantes.length,
        participantes: participantes
      },
      error: null
    };
    return resultado;
  } catch (errorInterno) {
    return _pruebaParticipantesError(
      PRUEBA_PARTICIPANTES_CODIGOS_ERROR.ERROR,
      'No fue posible completar la prueba de participantes.'
    );
  }
}

function _pruebaParticipantesResultadoExitoso(resultado) {
  return esObjetoPlano(resultado) && resultado.exito === true &&
    resultado.error === null;
}

function _pruebaParticipantesError(codigo, mensaje) {
  return {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
}
