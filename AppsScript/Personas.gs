/**
 * Módulo: Personas
 *
 * Resuelve los datos institucionales de los asistentes desde la hoja
 * "persona" del repositorio configurado y registra participantes nuevos.
 * No genera documentos, no procesa estados ni accede a Script Properties.
 */

const PERSONAS_HOJA = 'persona';
const PERSONAS_UNIDAD_PREDETERMINADA = 'UCP';
const PERSONAS_ENCABEZADOS = Object.freeze([
  'Nombre Participante',
  'Nombre Documento',
  'Cargo',
  'Unidad'
]);
const PERSONAS_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'PERSONAS_PARAMETRO_INVALIDO',
  BLOQUEO_NO_DISPONIBLE: 'PERSONAS_BLOQUEO_NO_DISPONIBLE',
  REPOSITORIO_NO_DISPONIBLE: 'PERSONAS_REPOSITORIO_NO_DISPONIBLE',
  ESQUEMA_INVALIDO: 'PERSONAS_ESQUEMA_INVALIDO',
  REGISTRO_DUPLICADO: 'PERSONAS_REGISTRO_DUPLICADO',
  PERSISTENCIA_ERROR: 'PERSONAS_PERSISTENCIA_ERROR',
  ERROR: 'PERSONAS_ERROR'
});

/**
 * @typedef {Object} ParticipanteActa
 * @property {string} nombre Nombre que se mostrará en el documento.
 * @property {string} cargo Cargo institucional o cadena vacía.
 * @property {string} unidad Unidad institucional o cadena vacía.
 */

/**
 * Resuelve los nombres, cargos y unidades que se mostrarán en el acta.
 * Los participantes no encontrados se registran con Unidad UCP.
 *
 * @param {string} repositorioProcesadosId ID del Spreadsheet compartido.
 * @param {{nombre: string, cargo: string}[]} participantes Participantes
 *     obtenidos de la respuesta validada.
 * @param {{idEjecucion: string}} contexto Contexto técnico de ejecución.
 * @returns {{exito: boolean, datos: ({participantes: ParticipanteActa[],
 *     registrados: number}|null), error: (Object|null)}} Resultado controlado.
 */
function resolverParticipantesActa(
  repositorioProcesadosId,
  participantes,
  contexto
) {
  if (!_personasValidarEntrada(
    repositorioProcesadosId,
    participantes,
    contexto
  )) {
    return _personasFinalizarError(
      PERSONAS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'Los parámetros para resolver participantes no son válidos.',
      contexto,
      'parametro_invalido',
      false
    );
  }

  let bloqueo;
  let bloqueoObtenido = false;
  let resultado;

  try {
    bloqueo = LockService.getScriptLock();
    bloqueoObtenido = bloqueo.tryLock(10000);
    if (!bloqueoObtenido) {
      resultado = _personasConstruirResultadoError(
        PERSONAS_CODIGOS_ERROR.BLOQUEO_NO_DISPONIBLE,
        'No fue posible obtener el bloqueo para resolver participantes.'
      );
    } else {
      resultado = _personasResolverConBloqueo(
        repositorioProcesadosId,
        participantes
      );
    }
  } catch (errorInterno) {
    resultado = _personasConstruirResultadoError(
      PERSONAS_CODIGOS_ERROR.ERROR,
      'No fue posible resolver los participantes del acta.'
    );
  } finally {
    if (bloqueoObtenido) {
      try {
        bloqueo.releaseLock();
      } catch (errorLiberacion) {
        // El resultado principal no se sustituye por un fallo de liberación.
      }
    }
  }

  _personasRegistrarResultado(resultado, contexto, bloqueoObtenido);
  return resultado;
}

function _personasResolverConBloqueo(repositorioId, participantes) {
  let hoja;
  try {
    const repositorio = SpreadsheetApp.openById(repositorioId);
    hoja = repositorio.getSheetByName(PERSONAS_HOJA);
    if (!hoja) {
      return _personasConstruirResultadoError(
        PERSONAS_CODIGOS_ERROR.REPOSITORIO_NO_DISPONIBLE,
        'La hoja de personas no está disponible.'
      );
    }
  } catch (errorRepositorio) {
    return _personasConstruirResultadoError(
      PERSONAS_CODIGOS_ERROR.REPOSITORIO_NO_DISPONIBLE,
      'El repositorio de personas no está disponible.'
    );
  }

  try {
    if (!_personasValidarEsquema(hoja)) {
      return _personasConstruirResultadoError(
        PERSONAS_CODIGOS_ERROR.ESQUEMA_INVALIDO,
        'El esquema de la hoja de personas no es válido.'
      );
    }

    const filas = _personasLeerFilas(hoja);
    const indiceResultado = _personasConstruirIndice(filas);
    if (!indiceResultado.exito) return indiceResultado;

    const resolucion = _personasResolverLista(
      participantes,
      indiceResultado.datos.indice
    );
    if (resolucion.filasNuevas.length > 0) {
      _personasAgregarFilas(hoja, resolucion.filasNuevas);
    }

    return {
      exito: true,
      datos: {
        participantes: resolucion.participantes,
        registrados: resolucion.filasNuevas.length
      },
      error: null
    };
  } catch (errorPersistencia) {
    return _personasConstruirResultadoError(
      PERSONAS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      'No fue posible consultar o actualizar la hoja de personas.'
    );
  }
}

function _personasValidarEntrada(repositorioId, participantes, contexto) {
  try {
    return esCadenaNoVacia(repositorioId) &&
      Array.isArray(participantes) &&
      participantes.every(function (participante) {
        return esObjetoPlano(participante) &&
          Object.keys(participante).length === 2 &&
          Object.prototype.hasOwnProperty.call(participante, 'nombre') &&
          Object.prototype.hasOwnProperty.call(participante, 'cargo') &&
          esCadenaNoVacia(participante.nombre) &&
          typeof participante.cargo === 'string';
      }) &&
      esObjetoPlano(contexto) &&
      Object.keys(contexto).length === 1 &&
      esCadenaNoVacia(contexto.idEjecucion);
  } catch (errorValidacion) {
    return false;
  }
}

function _personasValidarEsquema(hoja) {
  if (hoja.getLastRow() < 1 || hoja.getLastColumn() < 4) return false;
  const encabezados = hoja.getRange(1, 1, 1, 4).getDisplayValues()[0];
  return PERSONAS_ENCABEZADOS.every(function (encabezado, indice) {
    return encabezados[indice] === encabezado;
  });
}

function _personasLeerFilas(hoja) {
  const cantidad = Math.max(hoja.getLastRow() - 1, 0);
  return cantidad === 0
    ? []
    : hoja.getRange(2, 1, cantidad, 4).getDisplayValues();
}

function _personasConstruirIndice(filas) {
  const indice = Object.create(null);
  for (let posicion = 0; posicion < filas.length; posicion += 1) {
    const fila = filas[posicion];
    const nombreParticipante = fila[0];
    if (!esCadenaNoVacia(nombreParticipante)) continue;
    const clave = _personasNormalizarNombre(nombreParticipante);
    if (Object.prototype.hasOwnProperty.call(indice, clave)) {
      return _personasConstruirResultadoError(
        PERSONAS_CODIGOS_ERROR.REGISTRO_DUPLICADO,
        'Existen participantes duplicados en el catálogo de personas.'
      );
    }
    indice[clave] = {
      nombreDocumento: fila[1],
      cargo: fila[2],
      unidad: fila[3]
    };
  }
  return { exito: true, datos: { indice: indice }, error: null };
}

function _personasResolverLista(participantes, indice) {
  const participantesResueltos = [];
  const filasNuevas = [];
  const nombresNuevos = Object.create(null);

  participantes.forEach(function (participante) {
    const clave = _personasNormalizarNombre(participante.nombre);
    const persona = indice[clave];
    if (persona) {
      participantesResueltos.push({
        nombre: esCadenaNoVacia(persona.nombreDocumento)
          ? persona.nombreDocumento
          : participante.nombre,
        cargo: persona.cargo,
        unidad: persona.unidad
      });
      return;
    }

    participantesResueltos.push({
      nombre: participante.nombre,
      cargo: '',
      unidad: PERSONAS_UNIDAD_PREDETERMINADA
    });
    if (!Object.prototype.hasOwnProperty.call(nombresNuevos, clave)) {
      filasNuevas.push([
        participante.nombre,
        '',
        '',
        PERSONAS_UNIDAD_PREDETERMINADA
      ]);
      nombresNuevos[clave] = true;
    }
  });

  return {
    participantes: participantesResueltos,
    filasNuevas: filasNuevas
  };
}

function _personasNormalizarNombre(nombre) {
  return nombre.trim().toLocaleLowerCase('es');
}

function _personasAgregarFilas(hoja, filas) {
  const filaInicial = hoja.getLastRow() + 1;
  hoja.getRange(filaInicial, 1, filas.length, 4).setValues(filas);
  const persistidas = hoja.getRange(
    filaInicial,
    1,
    filas.length,
    4
  ).getDisplayValues();
  if (JSON.stringify(persistidas) !== JSON.stringify(filas)) {
    throw new Error('verificacion');
  }
}

function _personasConstruirResultadoError(codigo, mensaje) {
  return {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
}

function _personasFinalizarError(
  codigo,
  mensaje,
  contexto,
  causa,
  esError
) {
  const resultado = _personasConstruirResultadoError(codigo, mensaje);
  _personasRegistrar(mensaje, contexto, {
    resultado: 'error',
    causa: causa
  }, esError);
  return resultado;
}

function _personasRegistrarResultado(resultado, contexto, bloqueoObtenido) {
  if (resultado.exito) {
    _personasRegistrar(
      'Los participantes fueron resueltos correctamente.',
      contexto,
      {
        resultado: 'correcto',
        cantidad: resultado.datos.participantes.length,
        registrados: resultado.datos.registrados
      },
      false
    );
    return;
  }
  _personasRegistrar(
    resultado.error.mensaje,
    contexto,
    {
      resultado: 'error',
      causa: resultado.error.codigo,
      bloqueoObtenido: bloqueoObtenido
    },
    true
  );
}

function _personasRegistrar(mensaje, contexto, datos, esError) {
  try {
    const contextoRegistro = { datos: datos };
    if (contexto && esCadenaNoVacia(contexto.idEjecucion)) {
      contextoRegistro.idEjecucion = contexto.idEjecucion;
    }
    if (esError) {
      registrarError('Personas', 'resolverParticipantesActa', mensaje,
        contextoRegistro);
    } else {
      registrarInfo('Personas', 'resolverParticipantesActa', mensaje,
        contextoRegistro);
    }
  } catch (errorRegistro) {
    // El fallo de auditoría no altera el resultado funcional.
  }
}
