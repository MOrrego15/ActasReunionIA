/** Módulo de validación y normalización de RespuestaActaValidada. */

const VALIDADOR_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'VALIDADOR_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'VALIDADOR_CONTEXTO_INVALIDO',
  JSON_AMBIGUO: 'VALIDADOR_JSON_AMBIGUO',
  JSON_INVALIDO: 'VALIDADOR_JSON_INVALIDO',
  CONTRATO_INVALIDO: 'VALIDADOR_CONTRATO_INVALIDO',
  ERROR: 'VALIDADOR_ERROR'
});

const VALIDADOR_CAMPOS_ACTA = Object.freeze([
  'titulo','fechaReunion','horaInicio','horaFin','lugar','organizador',
  'participantes','agenda','resumenEjecutivo','acuerdos','tareas','observaciones'
]);

/**
 * @typedef {Object} RespuestaActaValidada
 * @property {string} titulo
 * @property {string} fechaReunion
 * @property {string} horaInicio
 * @property {string} horaFin
 * @property {string} lugar
 * @property {string} organizador
 * @property {{nombre: string, cargo: string}[]} participantes
 * @property {string[]} agenda
 * @property {string} resumenEjecutivo
 * @property {{numero: number, descripcion: string}[]} acuerdos
 * @property {{numero: number, descripcion: string, responsable: string, fechaCompromiso: string}[]} tareas
 * @property {string} observaciones
 */

/**
 * Valida y normaliza una respuesta textual de OpenAI.
 * @param {string} respuestaTexto Respuesta técnica recibida.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({respuestaActaValidada: RespuestaActaValidada}|null), error: (Object|null)}}
 */
function validarRespuestaActa(respuestaTexto, contexto) {
  if (!esCadenaNoVacia(respuestaTexto)) {
    return _validadorFinalizarError(VALIDADOR_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      'La respuesta recibida no es válida.', undefined, 'validacion');
  }
  if (!_validadorValidarContexto(contexto)) {
    return _validadorFinalizarError(VALIDADOR_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de validación no es válido.', undefined, 'validacion');
  }
  try {
    const objetos = _validadorExtraerObjetosJson(respuestaTexto);
    if (objetos.length !== 1) {
      return _validadorFinalizarError(VALIDADOR_CODIGOS_ERROR.JSON_AMBIGUO,
        'La respuesta no contiene un único objeto JSON.', contexto, 'extraccion');
    }
    let valor;
    try { valor = JSON.parse(objetos[0]); }
    catch (errorJson) {
      return _validadorFinalizarError(VALIDADOR_CODIGOS_ERROR.JSON_INVALIDO,
        'La respuesta contiene JSON no válido.', contexto, 'parseo');
    }
    const acta = _validadorNormalizarActa(valor);
    if (acta === null) {
      return _validadorFinalizarError(VALIDADOR_CODIGOS_ERROR.CONTRATO_INVALIDO,
        'La respuesta no cumple el contrato del acta.', contexto, 'contrato');
    }
    const resultado = { exito: true,
      datos: { respuestaActaValidada: acta }, error: null };
    _validadorRegistrar('La respuesta del acta fue validada correctamente.',
      contexto, { etapa: 'finalizacion', resultado: 'correcto',
        cantidadParticipantes: acta.participantes.length,
        cantidadAcuerdos: acta.acuerdos.length,
        cantidadTareas: acta.tareas.length }, false);
    return resultado;
  } catch (errorInterno) {
    return _validadorFinalizarError(VALIDADOR_CODIGOS_ERROR.ERROR,
      'No fue posible validar la respuesta del acta.', contexto, 'error_interno');
  }
}

function _validadorValidarContexto(contexto) {
  try {
    const claves = esObjetoPlano(contexto) ? Object.keys(contexto) : [];
    return claves.length === 1 && claves[0] === 'idEjecucion' &&
      esCadenaNoVacia(contexto.idEjecucion);
  } catch (errorValidacion) { return false; }
}

function _validadorExtraerObjetosJson(texto) {
  const objetos = [];
  let inicio = -1;
  let profundidad = 0;
  let profundidadArreglo = 0;
  let enCadena = false;
  let escapado = false;
  for (let indice = 0; indice < texto.length; indice += 1) {
    const codigo = texto.charCodeAt(indice);
    if (enCadena) {
      if (escapado) escapado = false;
      else if (codigo === 92) escapado = true;
      else if (codigo === 34) enCadena = false;
      continue;
    }
    if (codigo === 34 && (profundidad > 0 || profundidadArreglo > 0)) {
      enCadena = true;
    } else if (codigo === 91) {
      profundidadArreglo += 1;
    } else if (codigo === 93) {
      if (profundidadArreglo === 0) return [];
      profundidadArreglo -= 1;
    } else if (codigo === 123) {
      if (profundidadArreglo > 0 && profundidad === 0) return [];
      if (profundidad === 0) inicio = indice;
      profundidad += 1;
    } else if (codigo === 125 && profundidad > 0) {
      profundidad -= 1;
      if (profundidad === 0 && inicio >= 0) {
        objetos.push(texto.slice(inicio, indice + 1));
        inicio = -1;
      }
    }
  }
  return profundidad === 0 && profundidadArreglo === 0 && !enCadena
    ? objetos
    : [];
}

function _validadorNormalizarActa(valor) {
  if (!_validadorClavesPermitidas(valor, VALIDADOR_CAMPOS_ACTA)) return null;
  if (!['titulo','fechaReunion','resumenEjecutivo'].every(function (campo) {
    return Object.prototype.hasOwnProperty.call(valor, campo);
  })) return null;
  const textos = {};
  const camposTexto = ['titulo','fechaReunion','horaInicio','horaFin','lugar',
    'organizador','resumenEjecutivo','observaciones'];
  for (let i = 0; i < camposTexto.length; i += 1) {
    const campo = camposTexto[i];
    const obligatorio = ['titulo','fechaReunion','resumenEjecutivo'].includes(campo);
    const normalizado = _validadorNormalizarTexto(valor[campo], obligatorio);
    if (normalizado === null) return null;
    textos[campo] = normalizado;
  }
  const participantes = _validadorNormalizarParticipantes(valor.participantes);
  const agenda = _validadorNormalizarAgenda(valor.agenda);
  const acuerdos = _validadorNormalizarNumerados(valor.acuerdos, false);
  const tareas = _validadorNormalizarNumerados(valor.tareas, true);
  if ([participantes, agenda, acuerdos, tareas].some(function (v) {
    return v === null;
  })) return null;
  return {
    titulo: textos.titulo, fechaReunion: textos.fechaReunion,
    horaInicio: textos.horaInicio, horaFin: textos.horaFin,
    lugar: textos.lugar, organizador: textos.organizador,
    participantes: participantes, agenda: agenda,
    resumenEjecutivo: textos.resumenEjecutivo, acuerdos: acuerdos,
    tareas: tareas, observaciones: textos.observaciones
  };
}

function _validadorClavesPermitidas(valor, permitidas) {
  return esObjetoPlano(valor) && Object.keys(valor).every(function (clave) {
    return permitidas.includes(clave);
  });
}

function _validadorNormalizarTexto(valor, obligatorio) {
  if (valor === undefined && !obligatorio) return '';
  if (typeof valor !== 'string') return null;
  const texto = valor.trim();
  if (obligatorio && texto.length === 0) return null;
  return _validadorTextoSeguro(texto) ? texto : null;
}

function _validadorTextoSeguro(texto) {
  return !/```|<[^>]+>|(^|\n)\s*#{1,6}\s|\[[^\]]+\]\([^)]*\)|[{}]/.test(texto);
}

function _validadorNormalizarParticipantes(valor) {
  if (valor === undefined) return [];
  if (!Array.isArray(valor)) return null;
  const salida = [];
  for (let i = 0; i < valor.length; i += 1) {
    const item = valor[i];
    if (!_validadorClavesPermitidas(item, ['nombre','cargo']) ||
      !Object.prototype.hasOwnProperty.call(item, 'nombre')) return null;
    const nombre = _validadorNormalizarTexto(item.nombre, true);
    const cargo = _validadorNormalizarTexto(item.cargo, false);
    if (nombre === null || cargo === null) return null;
    salida.push({ nombre: nombre, cargo: cargo });
  }
  return salida;
}

function _validadorNormalizarAgenda(valor) {
  if (valor === undefined) return [];
  if (!Array.isArray(valor)) return null;
  const salida = [];
  for (let i = 0; i < valor.length; i += 1) {
    const texto = _validadorNormalizarTexto(valor[i], true);
    if (texto === null) return null;
    salida.push(texto);
  }
  return salida;
}

function _validadorNormalizarNumerados(valor, esTarea) {
  if (valor === undefined) return [];
  if (!Array.isArray(valor)) return null;
  const salida = [];
  const claves = esTarea
    ? ['numero','descripcion','responsable','fechaCompromiso']
    : ['numero','descripcion'];
  for (let i = 0; i < valor.length; i += 1) {
    const item = valor[i];
    if (!_validadorClavesPermitidas(item, claves) ||
      !Number.isSafeInteger(item.numero) || item.numero !== i + 1) return null;
    const descripcion = _validadorNormalizarTexto(item.descripcion, true);
    if (descripcion === null) return null;
    if (esTarea) {
      const responsable = _validadorNormalizarTexto(item.responsable, false);
      const fecha = _validadorNormalizarTexto(item.fechaCompromiso, false);
      if (responsable === null || fecha === null) return null;
      salida.push({ numero: item.numero, descripcion: descripcion,
        responsable: responsable, fechaCompromiso: fecha });
    } else {
      salida.push({ numero: item.numero, descripcion: descripcion });
    }
  }
  return salida;
}

function _validadorFinalizarError(codigo, mensaje, contexto, etapa) {
  const resultado = { exito: false, datos: null,
    error: { codigo: codigo, mensaje: mensaje } };
  _validadorRegistrar(mensaje, contexto,
    { etapa: etapa, resultado: 'error', codigo: codigo }, true);
  return resultado;
}

function _validadorRegistrar(mensaje, contexto, datos, esError) {
  try {
    const registro = { datos: datos };
    if (contexto !== undefined) registro.idEjecucion = contexto.idEjecucion;
    if (esError) {
      registrarError('ValidadorRespuesta', 'validarRespuestaActa', mensaje, registro);
    } else {
      registrarInfo('ValidadorRespuesta', 'validarRespuestaActa', mensaje, registro);
    }
  } catch (errorRegistro) {
    // La auditoría no altera el resultado funcional.
  }
}
