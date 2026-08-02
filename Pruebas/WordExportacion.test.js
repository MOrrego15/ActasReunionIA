const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const estado = {
  blobCreado: null,
  urlExportacion: null,
  opcionesExportacion: null
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
  isTrashed: () => false
};

const sandbox = {
  console,
  Date,
  Object,
  Number,
  String,
  ScriptApp: {
    getOAuthToken: () => 'token-prueba'
  },
  UrlFetchApp: {
    fetch(url, opciones) {
      estado.urlExportacion = url;
      estado.opcionesExportacion = opciones;
      return {
        getResponseCode: () => 200,
        getBlob: () => crearBlob()
      };
    }
  },
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
assert.match(
  estado.urlExportacion,
  /^https:\/\/www\.googleapis\.com\/drive\/v3\/files\/origen-1\/export\?/
);
assert.match(estado.urlExportacion, /mimeType=application%2Fvnd\.openxmlformats/);
assert.strictEqual(
  estado.opcionesExportacion.headers.Authorization,
  'Bearer token-prueba'
);
assert.strictEqual(
  estado.blobCreado.tipo,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
);
assert.strictEqual(estado.blobCreado.nombre, '31.07.2026-025-Daily.docx');
const manifiesto = JSON.parse(
  fs.readFileSync('AppsScript/appsscript.json', 'utf8')
);
assert.deepStrictEqual(manifiesto.oauthScopes, [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/script.external_request'
]);

console.log('WordExportacion.test.js: Drive API y alcances correctos.');
