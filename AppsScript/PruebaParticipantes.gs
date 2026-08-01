/**
 * Módulo: PruebaParticipantes
 *
 * Diagnóstico manual y aislado de la extracción de participantes. Lee el
 * documento fuente más reciente y aplica la extracción determinista. No
 * genera actas, no llama a OpenAI, no reserva correlativos, no modifica
 * estados de procesamiento y no consulta ni actualiza el catálogo persona.
 */

const PRUEBA_PARTICIPANTES_CODIGOS_ERROR = Object.freeze({
  CONFIGURACION_INVALIDA: 'PRUEBA_PARTICIPANTES_CONFIGURACION_INVALIDA',
  FUENTE_NO_DISPONIBLE: 'PRUEBA_PARTICIPANTES_FUENTE_NO_DISPONIBLE',
  TRANSCRIPCION_NO_DISPONIBLE:
    'PRUEBA_PARTICIPANTES_TRANSCRIPCION_NO_DISPONIBLE',
  LECTURA_ERROR: 'PRUEBA_PARTICIPANTES_LECTURA_ERROR',
  EXTRACCION_ERROR: 'PRUEBA_PARTICIPANTES_EXTRACCION_ERROR',
  ERROR: 'PRUEBA_PARTICIPANTES_ERROR'
});

/**
 * Extrae los participantes del documento fuente más reciente.
 *
 * Esta función está destinada exclusivamente a ejecución manual desde el
 * editor de Apps Script. Para observar el
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

    const documentoFuente = fuentes.datos.documentos[0];
    const lecturaFuente = leerContenidoDocumentoFuente(
      documentoFuente.idDocumentoFuente,
      contexto
    );
    const vinculados = _pruebaParticipantesResultadoExitoso(lecturaFuente)
      ? listarDocumentosGoogleVinculados(
          documentoFuente.idDocumentoFuente,
          contexto
        )
      : null;
    const contenidosVinculados =
      _pruebaParticipantesResultadoExitoso(vinculados)
      ? leerContenidosDocumentosGoogle(vinculados.datos, contexto)
      : null;
    const documentosCandidatos =
      _pruebaParticipantesResultadoExitoso(lecturaFuente) &&
      _pruebaParticipantesResultadoExitoso(contenidosVinculados) &&
      contenidosVinculados.datos &&
      Array.isArray(contenidosVinculados.datos.documentos)
        ? [{
            idDocumento: documentoFuente.idDocumentoFuente,
            nombre: documentoFuente.nombre,
            contenido: lecturaFuente.datos.contenidoFuente
          }].concat(contenidosVinculados.datos.documentos)
        : null;
    const seleccion = Array.isArray(documentosCandidatos)
      ? seleccionarTranscripcionAsociada(
          documentoFuente,
          documentosCandidatos,
          contexto
        )
      : null;
    if (!_pruebaParticipantesResultadoExitoso(seleccion) ||
      !seleccion.datos ||
      !esCadenaNoVacia(seleccion.datos.idDocumentoTranscripcion)) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.TRANSCRIPCION_NO_DISPONIBLE,
        'No existe una transcripción única asociada al documento fuente.'
      );
    }

    const lectura = leerContenidoDocumentoFuente(
      seleccion.datos.idDocumentoTranscripcion,
      contexto
    );
    if (!_pruebaParticipantesResultadoExitoso(lectura) ||
      !lectura.datos || !esCadenaNoVacia(lectura.datos.contenidoFuente)) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.LECTURA_ERROR,
        'No fue posible leer el documento fuente de la prueba.'
      );
    }

    const extraccion = extraerParticipantesConfirmados(
      lectura.datos.contenidoFuente,
      contexto
    );
    if (!_pruebaParticipantesResultadoExitoso(extraccion) ||
      !extraccion.datos ||
      !Array.isArray(extraccion.datos.participantes)) {
      return _pruebaParticipantesError(
        PRUEBA_PARTICIPANTES_CODIGOS_ERROR.EXTRACCION_ERROR,
        'No fue posible extraer los participantes de la prueba.'
      );
    }

    const participantes = extraccion.datos.participantes.map(
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
