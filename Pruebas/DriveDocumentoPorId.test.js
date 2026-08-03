const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function crearArchivo(id, fecha) {
  return {
    getId: () => id,
    getName: () => `Nota ${id}`,
    getMimeType: () => 'application/vnd.google-apps.document',
    getDateCreated: () => fecha,
    getLastUpdated: () => fecha,
    isTrashed: () => false
  };
}
const archivos = [
  crearArchivo('nota-mas-reciente', new Date('2026-08-03T12:00:00Z')),
  crearArchivo('nota-seleccionada', new Date('2026-07-31T12:00:00Z'))
];
const sandbox = {
  DriveApp: {
    getFolderById: () => ({
      getFiles: () => {
        let indice = 0;
        return {
          hasNext: () => indice < archivos.length,
          next: () => archivos[indice++]
        };
      }
    })
  },
  registrarInfo: () => {}, registrarAdvertencia: () => {},
  registrarError: () => {},
  esObjetoPlano: (valor) => valor !== null && typeof valor === 'object' &&
    !Array.isArray(valor),
  esCadenaNoVacia: (valor) => typeof valor === 'string' &&
    valor.trim().length > 0,
  esFechaValida: (valor) => valor instanceof Date &&
    !Number.isNaN(valor.getTime())
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Drive.gs', 'utf8'), sandbox);

const resultado = sandbox.obtenerDocumentoFuentePorId(
  'carpeta-notas', 'nota-seleccionada', { idEjecucion: 'prueba' }
);
assert.strictEqual(resultado.exito, true);
assert.strictEqual(
  resultado.datos.documento.idDocumentoFuente,
  'nota-seleccionada'
);
assert.strictEqual(
  resultado.datos.documento.fechaCreacion,
  '2026-07-31T12:00:00.000Z'
);

console.log('DriveDocumentoPorId.test.js: selección exacta correcta.');
