const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

let reservasAutomaticas = 0;
let correlativoRegistrado = null;
const exito = (datos) => ({ exito: true, datos, error: null });
const sandbox = {
  Utilities: { formatDate: () => '03/08/2026' },
  Session: { getScriptTimeZone: () => 'America/Lima' },
  leerContenidoDocumentoFuente: () => exito({ contenidoFuente: 'contenido' }),
  construirPromptActa: () => exito({ mensajes: [{}] }),
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
  generarDocumentoActa: () => exito({ idDocumentoGoogle: 'acta-google' }),
  exportarDocumentoWord: () => exito({ idArchivoDocx: 'acta-docx' }),
  marcarProcesamientoCompletado: () => exito({ estado: 'PROCESADO' }),
  marcarProcesamientoConError: () => exito({ estado: 'ERROR' }),
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
    actas: { carpetaRaizId: 'actas' },
    recursos: { carpetaOtrosId: 'recursos' }
  },
  { idEjecucion: 'ejecucion-manual' },
  77
);

assert.strictEqual(resultado.estado, 'PROCESADO');
assert.strictEqual(resultado.correlativo, 77);
assert.strictEqual(correlativoRegistrado, 77);
assert.strictEqual(reservasAutomaticas, 0);

console.log('MainGeneracionManual.test.js: correlativo manual sin reserva.');
