const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const encabezados = [
  'versionEsquema', 'idDocumentoFuente', 'estado', 'correlativo',
  'idEjecucion', 'fechaInicio', 'fechaActualizacion',
  'idDocumentoGoogle', 'idArchivoDocx', 'codigoError'
];
const filas = [[
  1, 'nota-generada', 'PROCESADO', 25, 'ejecucion-anterior',
  '2026-08-03T10:00:00.000Z', '2026-08-03T10:05:00.000Z',
  'documento-acta', 'archivo-docx', ''
]];
const hoja = {
  getLastRow: () => filas.length + 1,
  getLastColumn: () => encabezados.length,
  getRange: (fila, columna, cantidadFilas) => ({
    getValues: () => fila === 1
      ? [encabezados.slice()]
      : filas.slice(0, cantidadFilas).map((item) => item.slice())
  })
};
const sandbox = {
  SpreadsheetApp: {
    openById: (id) => {
      assert.strictEqual(id, 'hoja-seguimiento');
      return { getSheetByName: () => hoja };
    }
  },
  LockService: {
    getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} })
  },
  registrarInfo: () => {},
  registrarAdvertencia: () => {},
  registrarError: () => {},
  esObjetoPlano: (valor) => valor !== null && typeof valor === 'object' &&
    !Array.isArray(valor),
  esCadenaNoVacia: (valor) => typeof valor === 'string' &&
    valor.trim().length > 0,
  esNumeroFinito: (valor) => typeof valor === 'number' && Number.isFinite(valor)
};
vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync('AppsScript/Procesados.gs', 'utf8'),
  sandbox
);

assert.strictEqual(
  sandbox.consultarDisponibilidadGeneracion(
    'hoja-seguimiento', 'nota-generada', 30
  ).error.codigo,
  'PROCESADOS_DOCUMENTO_YA_PROCESADO'
);
assert.strictEqual(
  sandbox.consultarDisponibilidadGeneracion(
    'hoja-seguimiento', 'nota-generada', 30
  ).error.mensaje,
  'La reunión seleccionada ya generó el acta correspondiente.'
);
assert.strictEqual(
  sandbox.consultarDisponibilidadGeneracion(
    'hoja-seguimiento', 'nota-nueva', 25
  ).error.codigo,
  'PROCESADOS_CORRELATIVO_YA_UTILIZADO'
);
assert.strictEqual(
  sandbox.consultarDisponibilidadGeneracion(
    'hoja-seguimiento', 'nota-nueva', 26
  ).exito,
  true
);
assert.strictEqual(
  sandbox.proponerCorrelativoGeneracion(
    'hoja-seguimiento', 'nota-nueva', 25
  ).datos.correlativo,
  26
);
assert.strictEqual(
  sandbox.proponerCorrelativoDisponible(
    'hoja-seguimiento', 25
  ).datos.correlativo,
  26
);
assert.strictEqual(
  sandbox._procesadosRegistrarInicioInterno(
    'hoja-seguimiento',
    { idDocumentoFuente: 'nota-nueva', correlativo: 25 },
    'ejecucion-nueva'
  ).error.codigo,
  'PROCESADOS_CORRELATIVO_YA_UTILIZADO'
);

console.log('ProcesadosDisponibilidad.test.js: duplicados controlados.');
