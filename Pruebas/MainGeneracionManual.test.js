const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

let reservasAutomaticas = 0;
let correlativoRegistrado = null;
let datosEmisionRecibidos = null;
const exito = (datos) => ({ exito: true, datos, error: null });
const datosReunionEditados = {
  horaInicio: '10:15 AM',
  horaFin: '11:45 AM',
  agenda: 'Revisión del proyecto',
  proximaReunion: ''
};
const sandbox = {
  Utilities: {
    formatDate: () => '03/08/2026',
    getUuid: () => 'ejecucion-manual'
  },
  Session: { getScriptTimeZone: () => 'America/Lima' },
  leerContenidoDocumentoFuente: () => exito({ contenidoFuente: 'contenido' }),
  construirPromptActa: () => exito({ mensajes: [{}] }),
  solicitarActaEstructuradaGemini: () => exito({ respuestaTexto: '{}' }),
  solicitarActaEstructurada: () => exito({ respuestaTexto: '{}' }),
  validarRespuestaActa: () => exito({ respuestaActaValidada: {} }),
  listarDocumentosGoogleVinculados: () => exito({ documentos: [] }),
  leerContenidosDocumentosGoogle: () => exito({
    documentos: [{
      idDocumento: 'transcripcion', nombre: 'Transcripción',
      contenido: 'contenido'
    }]
  }),
  seleccionarTranscripcionAsociada: () => exito({
    idDocumentoTranscripcion: 'transcripcion'
  }),
  extraerParticipantesConfirmados: () => exito({ participantes: [] }),
  resolverParticipantesActa: () => exito({ participantes: [] }),
  reservarSiguienteCorrelativo: () => {
    reservasAutomaticas += 1;
    return exito({ correlativo: 999 });
  },
  registrarInicioProcesamiento: (repositorio, datos) => {
    correlativoRegistrado = datos.correlativo;
    return exito({ estado: 'EN_PROCESO' });
  },
  generarDocumentoActa: (respuesta, datosEmision) => {
    datosEmisionRecibidos = datosEmision;
    return exito({ idDocumentoGoogle: 'acta-google' });
  },
  exportarDocumentoWord: () => exito({ idArchivoDocx: 'acta-docx' }),
  marcarProcesamientoCompletado: () => exito({ estado: 'PROCESADO' }),
  marcarProcesamientoConError: () => exito({ estado: 'ERROR' }),
  obtenerConfiguracion: () => ({
    gemini: { carpetaNotasId: 'carpeta-notas' },
    plantilla: { documentoId: 'plantilla' },
    recursos: { carpetaOtrosId: 'recursos' },
    actas: {
      carpetaRaizId: 'actas', codigoFormato: 'FR 37',
      celula: 'CEL002', agendaFija: 'reunión de seguimiento'
    },
    procesados: { repositorioId: 'hoja-seguimiento' }
  }),
  obtenerDocumentoFuentePorId: (carpeta, id) => exito({
    documento: {
      idDocumentoFuente: id, nombre: 'Nota',
      mimeType: 'application/vnd.google-apps.document',
      fechaCreacion: '2026-08-03T10:00:00.000Z',
      fechaModificacion: '2026-08-03T10:01:00.000Z'
    }
  }),
  consultarDisponibilidadGeneracion: () => exito({
    estado: 'PENDIENTE', correlativo: null
  }),
  consultarEstadoProcesamiento: () => exito({
    estado: 'PENDIENTE', correlativo: null
  }),
  registrarInfo: () => {},
  registrarError: () => {},
  esObjetoPlano: (valor) => valor !== null && typeof valor === 'object' &&
    !Array.isArray(valor),
  esCadenaNoVacia: (valor) => typeof valor === 'string' &&
    valor.trim().length > 0
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Main.gs', 'utf8'), sandbox);

const resultado = sandbox._mainProcesarDocumento(
  {
    idDocumentoFuente: 'nota-seleccionada', nombre: 'Nota',
    mimeType: 'application/vnd.google-apps.document',
    fechaCreacion: '2026-08-03T10:00:00.000Z',
    fechaModificacion: '2026-08-03T10:01:00.000Z'
  },
  1,
  {
    procesados: { repositorioId: 'hoja-seguimiento' },
    actas: {
      carpetaRaizId: 'actas', codigoFormato: 'FR 37',
      celula: 'CEL002', agendaFija: 'reunión de seguimiento'
    },
    recursos: { carpetaOtrosId: 'recursos' }
  },
  { idEjecucion: 'ejecucion-manual' },
  77
);

assert.strictEqual(resultado.estado, 'PROCESADO');
assert.strictEqual(resultado.correlativo, 77);
assert.strictEqual(correlativoRegistrado, 77);
assert.strictEqual(reservasAutomaticas, 0);
assert.deepStrictEqual(JSON.parse(JSON.stringify(datosEmisionRecibidos)), {
  correlativo: 77,
  carpetaDestinoId: 'actas',
  carpetaRecursosId: 'recursos',
  codigoFormato: 'FR 37',
  celula: 'CEL002',
  agendaFija: 'reunión de seguimiento'
});

const dirigido = sandbox.ejecutarGeneracionActaSeleccionada({
  idDocumentoFuente: 'nota-anterior', correlativo: 78,
  datosReunion: datosReunionEditados
});
assert.strictEqual(dirigido.exito, true);
assert.strictEqual(dirigido.datos.correlativo, 78);
assert.strictEqual(dirigido.datos.idArchivoDocx, 'acta-docx');
assert.strictEqual(reservasAutomaticas, 0);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(datosEmisionRecibidos.datosReunion)),
  datosReunionEditados
);

const automatico = sandbox.ejecutarGeneracionActaSeleccionadaAutomatica({
  idDocumentoFuente: 'nota-automatica',
  datosReunion: datosReunionEditados
});
assert.strictEqual(automatico.exito, true);
assert.strictEqual(automatico.datos.correlativo, 999);
assert.strictEqual(automatico.datos.idArchivoDocx, 'acta-docx');
assert.strictEqual(reservasAutomaticas, 1);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(datosEmisionRecibidos.datosReunion)),
  datosReunionEditados
);
assert.strictEqual(
  sandbox.ejecutarGeneracionActaSeleccionadaAutomatica({
    idDocumentoFuente: 'nota-sin-datos'
  }).error.codigo,
  'MAIN_PARAMETRO_INVALIDO'
);
assert.strictEqual(
  sandbox._mainConstruirMensajeErrorGeneracion({
    etapaFinal: 'OPENAI',
    codigoError: 'GEMINI_IA_SOLICITUD_RECHAZADA'
  }),
  'No fue posible generar el acta seleccionada. Etapa: OPENAI. ' +
    'Código: GEMINI_IA_SOLICITUD_RECHAZADA.'
);

console.log('MainGeneracionManual.test.js: secuencias manual y automática.');
