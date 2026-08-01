/**
 * Módulo: Gemini
 *
 * Responsabilidad principal:
 * Identificar documentos candidatos de notas generadas por Gemini y decidir
 * cuál debe procesarse.
 *
 * Consideración pendiente:
 * Los criterios de elegibilidad, ordenación y desempate permanecen pendientes
 * de definición y aprobación.
 *
 * Responsabilidades excluidas:
 * - No realiza directamente operaciones técnicas sobre Google Drive o Google Docs.
 * - No genera actas.
 * - No asigna correlativos ni registra documentos como procesados.
 *
 * Dependencias previstas:
 * - Drive.
 * - Procesados.
 * - Config.
 * - Logger.
 */

const GEMINI_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'GEMINI_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'GEMINI_CONTEXTO_INVALIDO',
  TRANSCRIPCION_NO_ENCONTRADA: 'GEMINI_TRANSCRIPCION_NO_ENCONTRADA',
  TRANSCRIPCION_AMBIGUA: 'GEMINI_TRANSCRIPCION_AMBIGUA',
  ERROR: 'GEMINI_ERROR'
});

/**
 * Selecciona una transcripción por su estructura interna.
 * No lee Drive ni interpreta contenido documental.
 *
 * @param {{idDocumentoFuente: string, nombre: string}} documentoFuente Notas.
 * @param {Object[]} documentos Google Docs leídos por Drive.
 * @param {{idEjecucion: string}} contexto Contexto técnico.
 * @returns {{exito: boolean, datos: ({idDocumentoTranscripcion: string}|null),
 *     error: (Object|null)}} Transcripción única asociada.
 */
function seleccionarTranscripcionAsociada(documentoFuente, documentos, contexto) {
  if (!esObjetoPlano(documentoFuente) ||
    !esCadenaNoVacia(documentoFuente.nombre) || !Array.isArray(documentos)) {
    return _geminiResultadoError(GEMINI_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'Los datos para seleccionar la transcripción no son válidos.');
  }
  if (!_geminiValidarContexto(contexto)) {
    return _geminiResultadoError(GEMINI_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de selección no es válido.');
  }

  try {
    const documentosValidos = documentos.filter(function (documento) {
      return esObjetoPlano(documento) &&
        esCadenaNoVacia(documento.idDocumento) &&
        esCadenaNoVacia(documento.nombre) &&
        esCadenaNoVacia(documento.contenido);
    });
    const fuenteActual = documentosValidos.filter(function (documento) {
      return documento.idDocumento === documentoFuente.idDocumentoFuente &&
        _geminiEsContenidoTranscripcion(documento.contenido);
    });
    if (fuenteActual.length === 1) {
      return {
        exito: true,
        datos: {
          idDocumentoTranscripcion: fuenteActual[0].idDocumento
        },
        error: null
      };
    }
    const identificadasPorNombre = documentosValidos.filter(
      function (documento) {
        return /(?:transcripci[oó]n|transcript)/i.test(documento.nombre);
      }
    );
    const coincidencias = identificadasPorNombre.length === 1
      ? identificadasPorNombre
      : documentosValidos.filter(function (documento) {
          return _geminiEsContenidoTranscripcion(documento.contenido);
        });

    if (coincidencias.length === 0) {
      return _geminiResultadoError(
        GEMINI_CODIGOS_ERROR.TRANSCRIPCION_NO_ENCONTRADA,
        'No se encontró una transcripción asociada a las notas.'
      );
    }
    if (coincidencias.length !== 1) {
      return _geminiResultadoError(
        GEMINI_CODIGOS_ERROR.TRANSCRIPCION_AMBIGUA,
        'Existe más de una transcripción asociada a las notas.'
      );
    }
    return {
      exito: true,
      datos: { idDocumentoTranscripcion: coincidencias[0].idDocumento },
      error: null
    };
  } catch (errorSeleccion) {
    return _geminiResultadoError(GEMINI_CODIGOS_ERROR.ERROR,
      'No fue posible seleccionar la transcripción asociada.');
  }
}

function _geminiEsContenidoTranscripcion(contenido) {
  const nombres = _geminiObtenerEtiquetasHablante(contenido);
  const unicos = Object.create(null);
  nombres.forEach(function (nombre) {
    unicos[_geminiNormalizarNombrePersona(nombre)] = true;
  });
  const cantidadUnicos = Object.keys(unicos).length;
  const tieneRepeticiones = nombres.length > cantidadUnicos;
  const tieneMarca = /(?:transcripci[oó]n|transcript)/i.test(contenido);
  const tieneTiempo = /(?:^|\n)\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:$|\n)/m
    .test(contenido);
  return cantidadUnicos >= 2 && tieneRepeticiones &&
    (tieneMarca || tieneTiempo || nombres.length >= 5);
}

/**
 * Obtiene asistentes confirmados mediante etiquetas de hablante de la
 * transcripción y añade un organizador identificado explícitamente.
 * Las menciones dentro de intervenciones no acreditan asistencia.
 *
 * @param {string} contenidoFuente Texto completo del documento fuente.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({participantes: Object[]}|null),
 *     error: (Object|null)}} Resultado de la extracción.
 */
function extraerParticipantesConfirmados(contenidoFuente, contexto) {
  if (!esCadenaNoVacia(contenidoFuente)) {
    return _geminiResultadoError(GEMINI_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'El contenido fuente no es válido.');
  }
  if (!_geminiValidarContexto(contexto)) {
    return _geminiResultadoError(GEMINI_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de extracción no es válido.');
  }

  try {
    const participantes = [];
    const indices = Object.create(null);
    let organizador = '';

    const lineas = contenidoFuente.replace(/\r\n?/g, '\n').split('\n');
    lineas.forEach(function (lineaOriginal) {
      const linea = lineaOriginal.trim();
      if (!linea) return;
      const coincidenciaOrganizador = linea.match(
        /^(?:organizador|organizer)\s*:\s*(.+?)\s*$/i
      );
      if (coincidenciaOrganizador) {
        if (_geminiEsNombrePersona(coincidenciaOrganizador[1])) {
          organizador = coincidenciaOrganizador[1].trim();
        }
        return;
      }
      const coincidenciaHablante = linea.match(/^([^:]{1,120})\s*:\s*(.*)$/);
      if (!coincidenciaHablante) return;
      const nombre = coincidenciaHablante[1].trim();
      if (_geminiEsNombrePersona(nombre)) {
        _geminiAgregarParticipante(participantes, indices, nombre);
      }
    });

    if (organizador) {
      _geminiAgregarParticipante(participantes, indices, organizador);
    }
    _geminiRegistrar(
      'La extracción determinista de participantes finalizó correctamente.',
      contexto,
      { etapa: 'finalizacion', cantidadParticipantes: participantes.length },
      false
    );
    return { exito: true, datos: { participantes: participantes }, error: null };
  } catch (errorInterno) {
    _geminiRegistrar('No fue posible extraer los participantes confirmados.',
      contexto, { etapa: 'error', codigo: GEMINI_CODIGOS_ERROR.ERROR }, true);
    return _geminiResultadoError(GEMINI_CODIGOS_ERROR.ERROR,
      'No fue posible extraer los participantes confirmados.');
  }
}

function _geminiObtenerEtiquetasHablante(contenido) {
  const nombres = [];
  contenido.replace(/\r\n?/g, '\n').split('\n').forEach(
    function (lineaOriginal) {
      const linea = lineaOriginal.trim();
      const coincidencia = linea.match(/^([^:]{1,120})\s*:\s*(.*)$/);
      if (!coincidencia) return;
      const nombre = coincidencia[1].trim();
      if (_geminiEsNombrePersona(nombre) &&
        !/^(?:organizador|organizer)$/i.test(nombre)) {
        nombres.push(nombre);
      }
    }
  );
  return nombres;
}

function _geminiNormalizarNombrePersona(nombre) {
  return nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

function _geminiEsNombrePersona(valor) {
  if (!esCadenaNoVacia(valor) || valor.length > 120 || /@/.test(valor)) {
    return false;
  }
  if (/^(?:https?|fecha|hora|lugar|reuni[oó]n|tema|resumen|notas?|organizador|organizer|participantes?|asistentes?|transcripci[oó]n|proyecto|metodolog[ií]a|convocatoria|duraci[oó]n|agenda|acuerdos?|tareas?|acciones?|objetivo|ubicaci[oó]n|invitados?)\b/i.test(valor)) {
    return false;
  }
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ.'’-]*(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ.'’-]*)*$/.test(valor);
}

function _geminiAgregarParticipante(participantes, indices, nombre) {
  const clave = _geminiNormalizarNombrePersona(nombre);
  if (indices[clave]) return;
  indices[clave] = true;
  participantes.push({ nombre: nombre, cargo: '' });
}

function _geminiValidarContexto(contexto) {
  try {
    return esObjetoPlano(contexto) && Object.keys(contexto).length === 1 &&
      esCadenaNoVacia(contexto.idEjecucion);
  } catch (errorValidacion) {
    return false;
  }
}

function _geminiResultadoError(codigo, mensaje) {
  return { exito: false, datos: null, error: { codigo: codigo, mensaje: mensaje } };
}

function _geminiRegistrar(mensaje, contexto, datos, esError) {
  try {
    const contextoRegistro = { idEjecucion: contexto.idEjecucion, datos: datos };
    if (esError) {
      registrarError('Gemini', 'extraerParticipantesConfirmados', mensaje,
        contextoRegistro);
    } else {
      registrarInfo('Gemini', 'extraerParticipantesConfirmados', mensaje,
        contextoRegistro);
    }
  } catch (errorRegistro) {
    // La auditoría no altera el resultado funcional.
  }
}
