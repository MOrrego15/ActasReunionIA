/** Módulo generador del Google Docs de acta con formato funcional mínimo. */

const ACTA_MIME_DOCUMENTO_GOOGLE = 'application/vnd.google-apps.document';
const ACTA_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'ACTA_PARAMETRO_INVALIDO',
  CONTEXTO_INVALIDO: 'ACTA_CONTEXTO_INVALIDO',
  DATOS_INVALIDOS: 'ACTA_DATOS_INVALIDOS',
  CONFIGURACION_INVALIDA: 'ACTA_CONFIGURACION_INVALIDA',
  CARPETA_NO_ACCESIBLE: 'ACTA_CARPETA_NO_ACCESIBLE',
  CREACION_ERROR: 'ACTA_CREACION_ERROR',
  ESCRITURA_ERROR: 'ACTA_ESCRITURA_ERROR',
  UBICACION_ERROR: 'ACTA_UBICACION_ERROR',
  VERIFICACION_ERROR: 'ACTA_VERIFICACION_ERROR',
  ERROR: 'ACTA_ERROR'
});

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
 * Genera, ubica y verifica un Google Docs de acta.
 * @param {RespuestaActaValidada} respuestaActaValidada Datos ya validados.
 * @param {{correlativo: number, carpetaDestinoId: string}} datosEmisionActa
 *     Datos técnicos de emisión.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({idDocumentoGoogle: string}|null), error: (Object|null)}}
 */
function generarDocumentoActa(respuestaActaValidada, datosEmisionActa, contexto) {
  if (!_actaValidarRespuesta(respuestaActaValidada)) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.DATOS_INVALIDOS,
      'Los datos estructurados del acta no son válidos.', undefined,
      'validacion');
  }
  if (!_actaValidarEmision(datosEmisionActa)) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.CONFIGURACION_INVALIDA,
      'Los datos de emisión del acta no son válidos.', undefined,
      'validacion');
  }
  if (!_actaValidarContexto(contexto)) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.CONTEXTO_INVALIDO,
      'El contexto de generación no es válido.', undefined, 'validacion');
  }

  const nombreDocumento = _actaConstruirNombre(datosEmisionActa.correlativo);
  let carpeta;
  try {
    carpeta = DriveApp.getFolderById(datosEmisionActa.carpetaDestinoId);
    if (!carpeta) throw new Error('carpeta');
  } catch (errorCarpeta) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.CARPETA_NO_ACCESIBLE,
      'La carpeta de destino no está disponible.', contexto, 'carpeta');
  }

  _actaRegistrar('Se inició la generación del acta.', contexto,
    { etapa: 'inicio', correlativo: datosEmisionActa.correlativo }, false);
  let documento;
  let idDocumentoGoogle;
  try {
    documento = DocumentApp.create(nombreDocumento);
    idDocumentoGoogle = documento.getId();
    if (!esCadenaNoVacia(idDocumentoGoogle)) throw new Error('id');
  } catch (errorCreacion) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.CREACION_ERROR,
      'No fue posible crear el documento del acta.', contexto, 'creacion');
  }

  try {
    _actaEscribirDocumento(documento, respuestaActaValidada);
    documento.saveAndClose();
  } catch (errorEscritura) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.ESCRITURA_ERROR,
      'No fue posible escribir el documento del acta.', contexto, 'escritura');
  }

  try {
    DriveApp.getFileById(idDocumentoGoogle).moveTo(carpeta);
  } catch (errorUbicacion) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.UBICACION_ERROR,
      'No fue posible ubicar el documento del acta.', contexto, 'ubicacion');
  }

  try {
    if (!_actaVerificarDocumento(idDocumentoGoogle, nombreDocumento,
      datosEmisionActa.carpetaDestinoId)) {
      throw new Error('verificacion');
    }
  } catch (errorVerificacion) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.VERIFICACION_ERROR,
      'No fue posible verificar el documento del acta.', contexto,
      'verificacion');
  }

  const resultado = { exito: true,
    datos: { idDocumentoGoogle: idDocumentoGoogle }, error: null };
  _actaRegistrar('El documento del acta fue generado correctamente.', contexto,
    { etapa: 'finalizacion', resultado: 'correcto',
      correlativo: datosEmisionActa.correlativo }, false);
  return resultado;
}

function _actaValidarRespuesta(acta) {
  const campos = ['titulo','fechaReunion','horaInicio','horaFin','lugar',
    'organizador','participantes','agenda','resumenEjecutivo','acuerdos',
    'tareas','observaciones'];
  if (!_actaClavesExactas(acta, campos)) return false;
  const textos = ['titulo','fechaReunion','horaInicio','horaFin','lugar',
    'organizador','resumenEjecutivo','observaciones'];
  if (!textos.every(function (campo) {
    return typeof acta[campo] === 'string';
  }) || !esCadenaNoVacia(acta.titulo) ||
    !esCadenaNoVacia(acta.fechaReunion) ||
    !esCadenaNoVacia(acta.resumenEjecutivo)) return false;
  if (!Array.isArray(acta.participantes) || !Array.isArray(acta.agenda) ||
    !Array.isArray(acta.acuerdos) || !Array.isArray(acta.tareas)) return false;
  if (!acta.participantes.every(function (item) {
    return _actaClavesExactas(item, ['nombre','cargo']) &&
      esCadenaNoVacia(item.nombre) && typeof item.cargo === 'string';
  })) return false;
  if (!acta.agenda.every(function (item) { return esCadenaNoVacia(item); })) {
    return false;
  }
  if (!acta.acuerdos.every(function (item, indice) {
    return _actaClavesExactas(item, ['numero','descripcion']) &&
      item.numero === indice + 1 && esCadenaNoVacia(item.descripcion);
  })) return false;
  return acta.tareas.every(function (item, indice) {
    return _actaClavesExactas(item,
      ['numero','descripcion','responsable','fechaCompromiso']) &&
      item.numero === indice + 1 && esCadenaNoVacia(item.descripcion) &&
      typeof item.responsable === 'string' &&
      typeof item.fechaCompromiso === 'string';
  });
}

function _actaValidarEmision(datos) {
  return _actaClavesExactas(datos, ['correlativo','carpetaDestinoId']) &&
    Number.isSafeInteger(datos.correlativo) && datos.correlativo > 0 &&
    datos.correlativo <= 999999 && esCadenaNoVacia(datos.carpetaDestinoId);
}

function _actaValidarContexto(contexto) {
  return _actaClavesExactas(contexto, ['idEjecucion']) &&
    esCadenaNoVacia(contexto.idEjecucion);
}

function _actaClavesExactas(valor, esperadas) {
  try {
    if (!esObjetoPlano(valor)) return false;
    const claves = Object.keys(valor);
    return claves.length === esperadas.length && claves.every(function (clave) {
      return esperadas.includes(clave);
    });
  } catch (errorValidacion) { return false; }
}

function _actaConstruirNombre(correlativo) {
  return 'ACTA-' + String(correlativo).padStart(6, '0');
}

function _actaEscribirDocumento(documento, acta) {
  const cuerpo = documento.getBody();
  const tituloPrincipal = cuerpo.appendParagraph('ACTA DE REUNIÓN');
  tituloPrincipal.editAsText().setBold(true);
  tituloPrincipal.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  const tituloActa = cuerpo.appendParagraph(acta.titulo);
  tituloActa.editAsText().setBold(true);
  tituloActa.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  _actaAgregarSeccion(cuerpo, 'Datos Generales');
  cuerpo.appendTable([
    ['Fecha', acta.fechaReunion],
    ['Hora de inicio', acta.horaInicio],
    ['Hora de fin', acta.horaFin],
    ['Lugar', acta.lugar],
    ['Organizador', acta.organizador]
  ]);

  _actaAgregarSeccion(cuerpo, 'Participantes');
  const participantes = [['Nombre', 'Cargo']];
  acta.participantes.forEach(function (item) {
    participantes.push([item.nombre, item.cargo]);
  });
  cuerpo.appendTable(participantes);

  _actaAgregarSeccion(cuerpo, 'Agenda');
  acta.agenda.forEach(function (item) {
    cuerpo.appendListItem(item).setGlyphType(DocumentApp.GlyphType.NUMBER);
  });

  _actaAgregarSeccion(cuerpo, 'Resumen Ejecutivo');
  cuerpo.appendParagraph(acta.resumenEjecutivo);

  _actaAgregarSeccion(cuerpo, 'Acuerdos');
  const acuerdos = [['N.º', 'Descripción']];
  acta.acuerdos.forEach(function (item) {
    acuerdos.push([String(item.numero), item.descripcion]);
  });
  cuerpo.appendTable(acuerdos);

  _actaAgregarSeccion(cuerpo, 'Tareas');
  const tareas = [['N.º', 'Descripción', 'Responsable', 'Fecha compromiso']];
  acta.tareas.forEach(function (item) {
    tareas.push([String(item.numero), item.descripcion,
      item.responsable, item.fechaCompromiso]);
  });
  cuerpo.appendTable(tareas);

  _actaAgregarSeccion(cuerpo, 'Observaciones');
  cuerpo.appendParagraph(acta.observaciones);
}

function _actaAgregarSeccion(cuerpo, titulo) {
  cuerpo.appendParagraph(titulo).editAsText().setBold(true);
}

function _actaVerificarDocumento(idDocumento, nombreEsperado, carpetaId) {
  const archivo = DriveApp.getFileById(idDocumento);
  if (archivo.getId() !== idDocumento || archivo.getName() !== nombreEsperado ||
    archivo.getMimeType() !== ACTA_MIME_DOCUMENTO_GOOGLE ||
    archivo.isTrashed()) return false;
  const padres = archivo.getParents();
  while (padres.hasNext()) {
    if (padres.next().getId() === carpetaId) return true;
  }
  return false;
}

function _actaFinalizarError(codigo, mensaje, contexto, etapa) {
  const resultado = { exito: false, datos: null,
    error: { codigo: codigo, mensaje: mensaje } };
  _actaRegistrar(mensaje, contexto,
    { etapa: etapa, resultado: 'error', codigo: codigo }, true);
  return resultado;
}

function _actaRegistrar(mensaje, contexto, datos, esError) {
  try {
    const registro = { datos: datos };
    if (contexto !== undefined) registro.idEjecucion = contexto.idEjecucion;
    if (esError) registrarError('Acta', 'generarDocumentoActa', mensaje, registro);
    else registrarInfo('Acta', 'generarDocumentoActa', mensaje, registro);
  } catch (errorRegistro) {
    // La auditoría no altera el resultado funcional.
  }
}
