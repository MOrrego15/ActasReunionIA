const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const estado = {
  tipoSolicitado: null,
  blobCreado: null
};

function crearBlob() {
  return {
    nombre: '',
    tipo: '',
    getBytes() {
      return [1, 2, 3];
    },
    setContentType(tipo) {
      this.tipo = tipo;
      return this;
    },
    setName(nombre) {
      this.nombre = nombre;
      return this;
    }
  };
}

const archivoSalida = {
  getId: () => 'docx-1',
  getName: () => '31.07.2026-025-Daily.docx',
  getMimeType: () =>
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  isTrashed: () => false,
  getParents: () => {
    let pendiente = true;
    return {
      hasNext: () => pendiente,
      next: () => {
        pendiente = false;
        return { getId: () => 'destino-1' };
      }
    };
  }
};

const archivoOrigen = {
  getMimeType: () => 'application/vnd.google-apps.document',
  isTrashed: () => false,
  getAs(tipo) {
    estado.tipoSolicitado = tipo;
    return crearBlob();
  }
};

const sandbox = {
  console,
  Date,
  Object,
  Number,
  String,
  MimeType: { MICROSOFT_WORD: 'MIME_MICROSOFT_WORD' },
  DriveApp: {
    getFileById(id) {
      return id === 'origen-1' ? archivoOrigen : archivoSalida;
    },
    getFolderById() {
      return {
        createFile(blob) {
          estado.blobCreado = blob;
          return archivoSalida;
        }
      };
    }
  },
  esCadenaNoVacia: (valor) =>
    typeof valor === 'string' && valor.trim().length > 0,
  esObjetoPlano: (valor) =>
    valor !== null && typeof valor === 'object' && !Array.isArray(valor),
  registrarInfo: () => {},
  registrarError: () => {}
};

vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync('AppsScript/Word.gs', 'utf8'),
  sandbox
);

const resultado = sandbox.exportarDocumentoWord(
  'origen-1',
  {
    correlativo: 25,
    fechaReunion: '31/07/2026',
    carpetaDestinoId: 'destino-1'
  },
  { idEjecucion: 'prueba-1' }
);

assert.strictEqual(resultado.exito, true);
assert.strictEqual(resultado.datos.idArchivoDocx, 'docx-1');
assert.strictEqual(estado.tipoSolicitado, 'MIME_MICROSOFT_WORD');
assert.strictEqual(
  estado.blobCreado.tipo,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
);
assert.strictEqual(estado.blobCreado.nombre, '31.07.2026-025-Daily.docx');
assert.strictEqual(
  fs.readFileSync('AppsScript/Word.gs', 'utf8').includes('getOAuthToken'),
  false
);
assert.strictEqual(
  fs.readFileSync('AppsScript/Word.gs', 'utf8').includes('UrlFetchApp.fetch'),
  false
);

console.log('WordExportacion.test.js: conversión nativa correcta.');
