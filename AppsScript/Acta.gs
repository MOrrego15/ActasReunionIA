/** Módulo generador del Google Docs de acta con formato funcional mínimo. */

const ACTA_MIME_DOCUMENTO_GOOGLE = 'application/vnd.google-apps.document';
const ACTA_LOGO_NOMBRE_ARCHIVO = 'LogoMEF.jpg';
const ACTA_DIRECTOR_PROYECTO = 'Damaso Carlos Tay';
const ACTA_REUNION = Object.freeze({
  CODIGO: 'CEL002',
  HORA: '09:00 am a 09:20 am'
});
const ACTA_AGENDA = 'Dayli – reunión de seguimiento';
const ACTA_SIGLAS_ACRONIMOS = Object.freeze([
  ['AFSP', 'Administración Financiera del Sector Público'],
  [
    'AP Inversiones',
    'Analista de prototipos de la Célula de Inversiones.'
  ],
  ['BI', 'Banco de Inversiones'],
  [
    'CAF Inversiones',
    'Coordinador de Aspectos Funcionales de Inversiones para la Definición e ' +
      'Implementación del Modelo Funcional Detallado del SIAF-RP.'
  ],
  ['CUI', 'Código Único de Inversiones'],
  ['EF Inversiones', 'Especialista Funcional de Inversiones'],
  [
    'EGR Inversiones',
    'Especialista de Gestión de Requerimientos de la Célula de Inversiones.'
  ],
  ['MFD', 'Modelo Funcional Detallado del SIAF RP.'],
  ['PMI', 'Programa Multianual de Inversiones.'],
  [
    'SIAF-RP',
    'Sistema Integrado Administración Financiera de Recursos Públicos.'
  ],
  [
    'SNPMGI',
    'Sistema Nacional de Programación Multianual y Gestión de Inversiones.'
  ]
]);
const ACTA_CABECERA = Object.freeze({
  TITULO: 'Acta de Reunión',
  CODIGO: 'FR 37',
  VERSION: '1',
  METODOLOGIA:
    'Metodología de Gestión de Proyectos Informáticos de la Oficina ' +
    'General de Tecnologías de la Información – OGTI',
  PROYECTO:
    'Mejoramiento de la Administración Financiera del Sector Público ' +
    'a través de la Transformación Digital'
});
const ACTA_FORMATO = Object.freeze({
  ANCHO_PAGINA: 595.28,
  ALTO_PAGINA: 841.89,
  MARGEN_SUPERIOR: 42.5,
  MARGEN_DERECHO: 85.05,
  MARGEN_INFERIOR: 70.85,
  MARGEN_IZQUIERDO: 85.05,
  ANCHO_COLUMNA_ETIQUETA: 103,
  ANCHO_COLUMNA_CONTENIDO: 322,
  ANCHO_COLUMNA_TITULO: 190,
  ANCHO_COLUMNA_CONTROL: 56,
  ANCHO_COLUMNA_VALOR: 76,
  ANCHO_ASISTENTE_NOMBRE: 165,
  ANCHO_ASISTENTE_CARGO: 100,
  ANCHO_ASISTENTE_UNIDAD: 57,
  ANCHO_SIGLA_NUMERO: 28,
  ANCHO_SIGLA_DESCRIPCION: 294,
  ANCHO_TEMA_NUMERO: 28,
  ANCHO_TEMA_DESCRIPCION: 294,
  ANCHO_LOGO: 100,
  ALTO_LOGO: 32
});
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
 * @property {{numero: number, descripcion: string, responsable: string}[]} acuerdos
 * @property {{numero: number, descripcion: string, responsable: string, fechaCompromiso: string}[]} tareas
 * @property {string} observaciones
 */

/**
 * Genera, ubica y verifica un Google Docs de acta.
 * @param {RespuestaActaValidada} respuestaActaValidada Datos ya validados.
 * @param {{correlativo: number, carpetaDestinoId: string,
 *     carpetaRecursosId: string}} datosEmisionActa
 *     Datos técnicos de emisión.
 * @param {{nombre: string, cargo: string, unidad: string}[]} participantesActa
 *     Participantes resueltos desde el catálogo institucional.
 * @param {{idEjecucion: string}} contexto Contexto técnico obligatorio.
 * @returns {{exito: boolean, datos: ({idDocumentoGoogle: string}|null), error: (Object|null)}}
 */
function generarDocumentoActa(
  respuestaActaValidada,
  datosEmisionActa,
  participantesActa,
  contexto
) {
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
  if (!_actaValidarParticipantes(participantesActa)) {
    return _actaFinalizarError(ACTA_CODIGOS_ERROR.DATOS_INVALIDOS,
      'Los participantes resueltos del acta no son válidos.', undefined,
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

  const logoInstitucional = _actaObtenerLogoInstitucional(
    datosEmisionActa.carpetaRecursosId,
    contexto
  );

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
    _actaEscribirDocumento(
      documento,
      respuestaActaValidada,
      logoInstitucional,
      datosEmisionActa.correlativo,
      participantesActa
    );
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
    return _actaClavesExactas(item, ['numero','descripcion','responsable']) &&
      item.numero === indice + 1 && esCadenaNoVacia(item.descripcion) &&
      typeof item.responsable === 'string';
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
  return _actaClavesExactas(datos,
    ['correlativo','carpetaDestinoId','carpetaRecursosId']) &&
    Number.isSafeInteger(datos.correlativo) && datos.correlativo > 0 &&
    datos.correlativo <= 999999 && esCadenaNoVacia(datos.carpetaDestinoId) &&
    esCadenaNoVacia(datos.carpetaRecursosId);
}

function _actaValidarParticipantes(participantes) {
  return Array.isArray(participantes) && participantes.every(function (item) {
    return _actaClavesExactas(item, ['nombre','cargo','unidad']) &&
      esCadenaNoVacia(item.nombre) && typeof item.cargo === 'string' &&
      typeof item.unidad === 'string';
  });
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

function _actaEscribirDocumento(
  documento,
  acta,
  logoInstitucional,
  correlativo,
  participantesActa
) {
  const cuerpo = documento.getBody();
  _actaConfigurarPagina(cuerpo);
  _actaAgregarCabecera(cuerpo, acta.fechaReunion, logoInstitucional);

  _actaAgregarDatosReunion(cuerpo, correlativo, acta.fechaReunion);

  _actaAgregarAsistentes(cuerpo, participantesActa);

  _actaAgregarAgenda(cuerpo);

  _actaAgregarSiglasAcronimos(cuerpo);

  _actaAgregarTemasTratados(cuerpo, acta.acuerdos);

  _actaAgregarCierre(cuerpo, acta.tareas, acta.fechaReunion);
}

function _actaObtenerLogoInstitucional(carpetaRecursosId, contexto) {
  try {
    const carpetaRecursos = DriveApp.getFolderById(carpetaRecursosId);
    const archivos = carpetaRecursos.getFilesByName(ACTA_LOGO_NOMBRE_ARCHIVO);

    if (!archivos.hasNext()) {
      _actaRegistrarAdvertenciaLogo(contexto, 'no_encontrado');
      return null;
    }

    const archivoLogo = archivos.next();
    if (archivos.hasNext() || archivoLogo.isTrashed()) {
      _actaRegistrarAdvertenciaLogo(contexto, 'ambiguo_o_eliminado');
      return null;
    }

    const logo = archivoLogo.getBlob();
    if (!logo || logo.getBytes().length === 0 ||
      logo.getContentType().indexOf('image/') !== 0) {
      _actaRegistrarAdvertenciaLogo(contexto, 'contenido_invalido');
      return null;
    }
    return logo;
  } catch (errorLogo) {
    _actaRegistrarAdvertenciaLogo(contexto, 'carpeta_o_permisos');
    return null;
  }
}

function _actaRegistrarAdvertenciaLogo(contexto, causa) {
  try {
    registrarAdvertencia(
      'Acta',
      'generarDocumentoActa',
      'No fue posible incorporar el logotipo institucional; ' +
        'el acta continuará sin la imagen.',
      {
        idEjecucion: contexto.idEjecucion,
        datos: { etapa: 'cabecera', resultado: 'logo_omitido', causa: causa }
      }
    );
  } catch (errorRegistro) {
    // La ausencia de auditoría no impide generar el acta.
  }
}

function _actaConfigurarPagina(cuerpo) {
  cuerpo.setPageWidth(ACTA_FORMATO.ANCHO_PAGINA);
  cuerpo.setPageHeight(ACTA_FORMATO.ALTO_PAGINA);
  cuerpo.setMarginTop(ACTA_FORMATO.MARGEN_SUPERIOR);
  cuerpo.setMarginRight(ACTA_FORMATO.MARGEN_DERECHO);
  cuerpo.setMarginBottom(ACTA_FORMATO.MARGEN_INFERIOR);
  cuerpo.setMarginLeft(ACTA_FORMATO.MARGEN_IZQUIERDO);
}

function _actaAgregarCabecera(cuerpo, fechaReunion, logoInstitucional) {
  const tabla = cuerpo.appendTable([
    ['', ''],
    ['Proyecto:', ACTA_CABECERA.PROYECTO],
    ['Director de Proyecto:', ACTA_DIRECTOR_PROYECTO]
  ]);
  tabla.setBorderWidth(0.75);

  const celdaLogo = tabla.getRow(0).getCell(0);
  const celdaCabecera = tabla.getRow(0).getCell(1);
  _actaConfigurarAnchosFila(
    tabla.getRow(0),
    ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA,
    ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO
  );
  _actaAgregarLogo(celdaLogo, logoInstitucional);
  _actaAgregarControlesCabecera(
    celdaCabecera,
    _actaFormatearFechaCabecera(fechaReunion)
  );

  _actaConfigurarFilaInstitucional(
    tabla.getRow(1),
    'Proyecto:',
    ACTA_CABECERA.PROYECTO
  );
  _actaConfigurarFilaInstitucional(
    tabla.getRow(2),
    'Director de Proyecto:',
    ACTA_DIRECTOR_PROYECTO
  );
}

function _actaConfigurarAnchosFila(fila, anchoEtiqueta, anchoContenido) {
  fila.getCell(0).setWidth(anchoEtiqueta);
  fila.getCell(1).setWidth(anchoContenido);
}

function _actaAgregarLogo(celda, logoInstitucional) {
  celda.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
  const parrafo = celda.getChild(0).asParagraph();
  parrafo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  parrafo.setSpacingBefore(0);
  parrafo.setSpacingAfter(0);
  if (logoInstitucional === null) return;
  const imagen = parrafo.appendInlineImage(logoInstitucional);
  imagen.setWidth(ACTA_FORMATO.ANCHO_LOGO);
  imagen.setHeight(ACTA_FORMATO.ALTO_LOGO);
}

function _actaAgregarControlesCabecera(celda, fechaCabecera) {
  celda.clear();
  celda.setPaddingTop(0);
  celda.setPaddingBottom(0);
  celda.setPaddingLeft(0);
  celda.setPaddingRight(0);
  celda.setVerticalAlignment(DocumentApp.VerticalAlignment.TOP);
  const tabla = celda.appendTable([
    [ACTA_CABECERA.TITULO, 'Código:', ACTA_CABECERA.CODIGO],
    ['', 'Versión:', ACTA_CABECERA.VERSION],
    [ACTA_CABECERA.METODOLOGIA, 'Fecha:', fechaCabecera]
  ]);
  tabla.setBorderWidth(0.75);
  _actaCompactarCeldaConTabla(celda, tabla);

  for (let indice = 0; indice < tabla.getNumRows(); indice += 1) {
    const fila = tabla.getRow(indice);
    fila.getCell(0).setWidth(ACTA_FORMATO.ANCHO_COLUMNA_TITULO);
    fila.getCell(1).setWidth(ACTA_FORMATO.ANCHO_COLUMNA_CONTROL);
    fila.getCell(2).setWidth(ACTA_FORMATO.ANCHO_COLUMNA_VALOR);
    _actaFormatearCelda(fila.getCell(1), true, 9,
      DocumentApp.HorizontalAlignment.LEFT);
    _actaFormatearCelda(fila.getCell(2), indice !== 2, 9,
      DocumentApp.HorizontalAlignment.CENTER);
  }

  _actaFormatearCelda(tabla.getRow(0).getCell(0), true, 16,
    DocumentApp.HorizontalAlignment.CENTER);
  _actaFormatearCelda(tabla.getRow(1).getCell(0), false, 9,
    DocumentApp.HorizontalAlignment.CENTER);
  _actaFormatearCelda(tabla.getRow(2).getCell(0), true, 9,
    DocumentApp.HorizontalAlignment.LEFT);
}

function _actaCompactarCeldaConTabla(celda, tabla) {
  for (let indice = celda.getNumChildren() - 1; indice >= 0; indice -= 1) {
    const elemento = celda.getChild(indice);
    if (elemento === tabla ||
      elemento.getType() !== DocumentApp.ElementType.PARAGRAPH) {
      continue;
    }
    const parrafo = elemento.asParagraph();
    if (parrafo.getText().length !== 0) continue;
    try {
      celda.removeChild(elemento);
    } catch (errorCompactacion) {
      parrafo.setSpacingBefore(0);
      parrafo.setSpacingAfter(0);
      parrafo.setLineSpacing(0.06);
    }
  }
}

function _actaConfigurarFilaInstitucional(fila, etiqueta, valor) {
  _actaConfigurarAnchosFila(
    fila,
    ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA,
    ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO
  );
  fila.getCell(0).setText(etiqueta);
  fila.getCell(1).setText(valor);
  _actaFormatearCelda(fila.getCell(0), true, 9,
    DocumentApp.HorizontalAlignment.LEFT);
  _actaFormatearCelda(fila.getCell(1), true, 9,
    DocumentApp.HorizontalAlignment.LEFT);
}

function _actaFormatearCelda(celda, negrita, tamano, alineacion) {
  celda.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
  const parrafo = celda.getChild(0).asParagraph();
  parrafo.setAlignment(alineacion);
  parrafo.setSpacingBefore(0);
  parrafo.setSpacingAfter(0);
  const texto = parrafo.editAsText();
  if (texto.getText().length === 0) return;
  texto.setFontFamily('Arial');
  texto.setFontSize(tamano);
  texto.setBold(negrita);
}

function _actaFormatearFechaCabecera(fechaReunion) {
  return fechaReunion.replace(/\//g, '.');
}

function _actaAgregarDatosReunion(cuerpo, correlativo, fechaReunion) {
  const fechaFormateada = _actaFormatearFechaCabecera(fechaReunion);
  const tabla = cuerpo.appendTable([
    [
      'Reunión',
      _actaConstruirNumeroReunion(correlativo, fechaFormateada)
    ],
    ['Fecha', fechaFormateada],
    ['Hora', ACTA_REUNION.HORA]
  ]);

  for (let indice = 0; indice < tabla.getNumRows(); indice += 1) {
    const fila = tabla.getRow(indice);
    const celdaEtiqueta = fila.getCell(0);
    const celdaValor = fila.getCell(1);
    celdaEtiqueta.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA);
    celdaValor.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO);
    celdaEtiqueta.setBackgroundColor('#d9d9d9');
    celdaEtiqueta.editAsText()
      .setFontFamily('Arial')
      .setFontSize(10)
      .setBold(true);
    celdaValor.editAsText()
      .setFontFamily('Arial')
      .setFontSize(10)
      .setBold(false)
      .setItalic(true);
  }
}

function _actaConstruirNumeroReunion(correlativo, fechaFormateada) {
  const coincidencia = fechaFormateada.match(
    /^(?:\d{2}\.\d{2}\.(\d{4})|(\d{4})-\d{2}-\d{2})$/
  );
  if (!coincidencia) {
    throw new Error('fecha_reunion');
  }
  const anio = coincidencia[1] || coincidencia[2];
  return String(correlativo) + '-' + anio + '-' + ACTA_REUNION.CODIGO;
}

function _actaAgregarAgenda(cuerpo) {
  const tabla = cuerpo.appendTable([['Agenda', ACTA_AGENDA]]);
  tabla.setBorderWidth(0.75);
  const celdaEtiqueta = tabla.getRow(0).getCell(0);
  const celdaValor = tabla.getRow(0).getCell(1);
  celdaEtiqueta.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA);
  celdaValor.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO);
  celdaEtiqueta.setBackgroundColor('#d9d9d9');
  celdaEtiqueta.editAsText()
    .setFontFamily('Arial')
    .setFontSize(10)
    .setBold(true);
  celdaValor.editAsText()
    .setFontFamily('Arial')
    .setFontSize(10)
    .setBold(false);
}

function _actaAgregarSiglasAcronimos(cuerpo) {
  const tablaExterior = cuerpo.appendTable([['Siglas y Acrónimos', '']]);
  tablaExterior.setBorderWidth(0.75);
  const celdaTitulo = tablaExterior.getRow(0).getCell(0);
  const celdaContenido = tablaExterior.getRow(0).getCell(1);
  celdaTitulo.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA);
  celdaContenido.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO);
  celdaTitulo.setBackgroundColor('#d9d9d9');
  _actaFormatearCelda(
    celdaTitulo,
    true,
    10,
    DocumentApp.HorizontalAlignment.LEFT
  );

  celdaContenido.clear();
  celdaContenido.setPaddingTop(0);
  celdaContenido.setPaddingBottom(0);
  celdaContenido.setPaddingLeft(0);
  celdaContenido.setPaddingRight(0);
  const filas = ACTA_SIGLAS_ACRONIMOS.map(function (elemento, indice) {
    return [
      String(indice + 1) + '.',
      elemento[0] + ': ' + elemento[1]
    ];
  });
  const tablaSiglas = celdaContenido.appendTable(filas);
  tablaSiglas.setBorderWidth(0);
  _actaCompactarCeldaConTabla(celdaContenido, tablaSiglas);

  for (let indice = 0; indice < tablaSiglas.getNumRows(); indice += 1) {
    const fila = tablaSiglas.getRow(indice);
    const celdaNumero = fila.getCell(0);
    const celdaDescripcion = fila.getCell(1);
    celdaNumero.setWidth(ACTA_FORMATO.ANCHO_SIGLA_NUMERO);
    celdaDescripcion.setWidth(ACTA_FORMATO.ANCHO_SIGLA_DESCRIPCION);
    celdaNumero.setPaddingTop(0);
    celdaNumero.setPaddingBottom(0);
    celdaDescripcion.setPaddingTop(0);
    celdaDescripcion.setPaddingBottom(0);
    _actaFormatearCelda(
      celdaNumero,
      false,
      9,
      DocumentApp.HorizontalAlignment.LEFT
    );
    _actaFormatearCelda(
      celdaDescripcion,
      false,
      9,
      DocumentApp.HorizontalAlignment.LEFT
    );
    celdaNumero.setVerticalAlignment(DocumentApp.VerticalAlignment.TOP);
    celdaDescripcion.setVerticalAlignment(DocumentApp.VerticalAlignment.TOP);
  }
}

function _actaAgregarTemasTratados(cuerpo, acuerdos) {
  const tablaExterior = cuerpo.appendTable([['TEMAS TRATADOS:', '']]);
  tablaExterior.setBorderWidth(0.75);
  const celdaTitulo = tablaExterior.getRow(0).getCell(0);
  const celdaContenido = tablaExterior.getRow(0).getCell(1);
  celdaTitulo.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA);
  celdaContenido.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO);
  celdaTitulo.setBackgroundColor('#d9d9d9');
  _actaFormatearCelda(
    celdaTitulo,
    true,
    10,
    DocumentApp.HorizontalAlignment.LEFT
  );

  celdaContenido.clear();
  celdaContenido.setPaddingTop(0);
  celdaContenido.setPaddingBottom(0);
  celdaContenido.setPaddingLeft(0);
  celdaContenido.setPaddingRight(0);
  if (acuerdos.length === 0) return;

  const filas = acuerdos.map(function (acuerdo) {
    return [String(acuerdo.numero) + '.', acuerdo.descripcion];
  });
  const tablaTemas = celdaContenido.appendTable(filas);
  tablaTemas.setBorderWidth(0);
  _actaCompactarCeldaConTabla(celdaContenido, tablaTemas);

  for (let indice = 0; indice < tablaTemas.getNumRows(); indice += 1) {
    const fila = tablaTemas.getRow(indice);
    const celdaNumero = fila.getCell(0);
    const celdaDescripcion = fila.getCell(1);
    celdaNumero.setWidth(ACTA_FORMATO.ANCHO_TEMA_NUMERO);
    celdaDescripcion.setWidth(ACTA_FORMATO.ANCHO_TEMA_DESCRIPCION);
    celdaNumero.setPaddingTop(0);
    celdaNumero.setPaddingBottom(0);
    celdaDescripcion.setPaddingTop(0);
    celdaDescripcion.setPaddingBottom(0);
    _actaFormatearCelda(
      celdaNumero,
      false,
      9,
      DocumentApp.HorizontalAlignment.LEFT
    );
    _actaFormatearCelda(
      celdaDescripcion,
      false,
      9,
      DocumentApp.HorizontalAlignment.JUSTIFY
    );
    celdaNumero.setVerticalAlignment(DocumentApp.VerticalAlignment.TOP);
    celdaDescripcion.setVerticalAlignment(DocumentApp.VerticalAlignment.TOP);
  }
}

function _actaAgregarCierre(cuerpo, tareas, fechaReunion) {
  const tabla = cuerpo.appendTable([
    ['Riesgos o problemas', ''],
    ['Acuerdos', ''],
    ['Próxima reunión', _actaCalcularProximaReunion(fechaReunion)]
  ]);
  tabla.setBorderWidth(0.75);

  const filaRiesgos = tabla.getRow(0);
  _actaConfigurarAnchosFila(
    filaRiesgos,
    ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA,
    ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO
  );
  _actaFormatearCelda(
    filaRiesgos.getCell(0),
    true,
    9,
    DocumentApp.HorizontalAlignment.LEFT
  );

  const filaAcuerdos = tabla.getRow(1);
  _actaConfigurarAnchosFila(
    filaAcuerdos,
    ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA,
    ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO
  );
  const celdaTitulo = filaAcuerdos.getCell(0);
  const celdaContenido = filaAcuerdos.getCell(1);
  celdaTitulo.setBackgroundColor('#d9d9d9');
  _actaFormatearCelda(
    celdaTitulo,
    true,
    9,
    DocumentApp.HorizontalAlignment.LEFT
  );

  celdaContenido.clear();
  celdaContenido.setPaddingTop(0);
  celdaContenido.setPaddingBottom(0);
  for (let indice = 0; indice < tareas.length; indice += 1) {
    const item = celdaContenido.appendListItem(
      _actaConstruirTextoTarea(tareas[indice])
    );
    item.setGlyphType(DocumentApp.GlyphType.BULLET);
    item.setSpacingBefore(0);
    item.setSpacingAfter(0);
    item.setIndentStart(14);
    item.setIndentFirstLine(0);
    const texto = item.editAsText();
    texto.setFontFamily('Arial');
    texto.setFontSize(9);
    texto.setBold(false);
  }

  const filaProxima = tabla.getRow(2);
  _actaConfigurarAnchosFila(
    filaProxima,
    ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA,
    ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO
  );
  const celdaProximaEtiqueta = filaProxima.getCell(0);
  const celdaProximaValor = filaProxima.getCell(1);
  celdaProximaEtiqueta.setBackgroundColor('#d9d9d9');
  _actaFormatearCelda(
    celdaProximaEtiqueta,
    true,
    9,
    DocumentApp.HorizontalAlignment.LEFT
  );
  _actaFormatearCelda(
    celdaProximaValor,
    false,
    9,
    DocumentApp.HorizontalAlignment.LEFT
  );
}

function _actaConstruirTextoTarea(tarea) {
  const responsable = tarea.responsable.trim();
  return responsable
    ? responsable + ': ' + tarea.descripcion
    : tarea.descripcion;
}

function _actaCalcularProximaReunion(fechaReunion) {
  const coincidencia = fechaReunion.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!coincidencia) throw new Error('fecha_reunion');
  const fecha = new Date(
    Number(coincidencia[3]),
    Number(coincidencia[2]) - 1,
    Number(coincidencia[1])
  );
  do {
    fecha.setDate(fecha.getDate() + 1);
  } while (fecha.getDay() === 0 || fecha.getDay() === 6);
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return fecha.getDate() + ' de ' + meses[fecha.getMonth()] +
    ' de ' + fecha.getFullYear();
}

function _actaAgregarAsistentes(cuerpo, participantes) {
  const tablaExterior = cuerpo.appendTable([['Asistentes', '']]);
  tablaExterior.setBorderWidth(0.75);
  const celdaTitulo = tablaExterior.getRow(0).getCell(0);
  const celdaContenido = tablaExterior.getRow(0).getCell(1);
  celdaTitulo.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_ETIQUETA);
  celdaContenido.setWidth(ACTA_FORMATO.ANCHO_COLUMNA_CONTENIDO);
  celdaTitulo.setBackgroundColor('#d9d9d9');
  celdaTitulo.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);
  _actaFormatearCelda(
    celdaTitulo,
    true,
    10,
    DocumentApp.HorizontalAlignment.LEFT
  );

  celdaContenido.clear();
  celdaContenido.setPaddingTop(0);
  celdaContenido.setPaddingBottom(0);
  celdaContenido.setPaddingLeft(0);
  celdaContenido.setPaddingRight(0);
  const filas = [['Nombres y apellidos', 'Cargo', 'Unidad']];
  participantes.forEach(function (participante) {
    filas.push([
      participante.nombre,
      participante.cargo,
      participante.unidad
    ]);
  });
  const tablaParticipantes = celdaContenido.appendTable(filas);
  tablaParticipantes.setBorderWidth(0.75);
  _actaCompactarCeldaConTabla(celdaContenido, tablaParticipantes);

  for (let indice = 0;
    indice < tablaParticipantes.getNumRows();
    indice += 1) {
    const fila = tablaParticipantes.getRow(indice);
    fila.getCell(0).setWidth(ACTA_FORMATO.ANCHO_ASISTENTE_NOMBRE);
    fila.getCell(1).setWidth(ACTA_FORMATO.ANCHO_ASISTENTE_CARGO);
    fila.getCell(2).setWidth(ACTA_FORMATO.ANCHO_ASISTENTE_UNIDAD);
    for (let columna = 0; columna < 3; columna += 1) {
      const celda = fila.getCell(columna);
      if (indice === 0) celda.setBackgroundColor('#d9d9d9');
      _actaFormatearCelda(
        celda,
        indice === 0,
        9,
        DocumentApp.HorizontalAlignment.LEFT
      );
    }
  }
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
