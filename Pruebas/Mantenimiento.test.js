const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const valores = new Map([
  ['ACTAS_ULTIMO_CORRELATIVO', '34'],
  ['CARPETA_NOTAS_GEMINI_ID', 'carpeta-notas'],
  ['MANTENIMIENTO_CORREOS_AUTORIZADOS',
    'administrador@example.com; otro@example.com']
]);
let correoActivo = 'ADMINISTRADOR@example.com';
let bloqueoDisponible = true;
let bloqueoLiberado = false;
const auditoria = [];
const archivosNotas = [];
for (let indice = 1; indice <= 12; indice += 1) {
  archivosNotas.push({
    id: `nota-${indice}`,
    nombre: `Nota ${indice}`,
    fecha: new Date(Date.UTC(2026, 7, indice, 14, 30)),
    mimeType: 'application/vnd.google-apps.document',
    eliminada: false
  });
}
archivosNotas.push({
  id: 'archivo-pdf', nombre: 'No es una nota',
  fecha: new Date(Date.UTC(2026, 7, 31, 14, 30)),
  mimeType: 'application/pdf', eliminada: false
});
archivosNotas.push({
  id: 'nota-papelera', nombre: 'Nota eliminada',
  fecha: new Date(Date.UTC(2026, 7, 30, 14, 30)),
  mimeType: 'application/vnd.google-apps.document', eliminada: true
});

const propiedades = {
  getProperty: (clave) => valores.has(clave) ? valores.get(clave) : null,
  setProperty: (clave, valor) => valores.set(clave, valor)
};
const sandbox = {
  Session: {
    getActiveUser: () => ({ getEmail: () => correoActivo })
  },
  PropertiesService: { getScriptProperties: () => propiedades },
  DriveApp: {
    getFolderById: (id) => {
      assert.strictEqual(id, 'carpeta-notas');
      let posicion = 0;
      return {
        getFiles: () => ({
          hasNext: () => posicion < archivosNotas.length,
          next: () => {
            const archivo = archivosNotas[posicion++];
            return {
              getId: () => archivo.id,
              getName: () => archivo.nombre,
              getDateCreated: () => archivo.fecha,
              getMimeType: () => archivo.mimeType,
              isTrashed: () => archivo.eliminada
            };
          }
        })
      };
    }
  },
  LockService: {
    getScriptLock: () => ({
      tryLock: () => bloqueoDisponible,
      releaseLock: () => { bloqueoLiberado = true; }
    })
  },
  HtmlService: {
    createHtmlOutput: (contenido) => ({
      contenido,
      setTitle(titulo) { this.titulo = titulo; return this; }
    }),
    createTemplateFromFile: (archivo) => {
      const plantilla = {
        evaluate: () => ({
          archivo,
          urlAplicacion: plantilla.urlAplicacion,
          setTitle(titulo) { this.titulo = titulo; return this; }
        })
      };
      return plantilla;
    }
  },
  ScriptApp: {
    getService: () => ({
      getUrl: () => 'https://script.google.com/macros/s/prueba/exec'
    })
  },
  registrarInfo: (...argumentos) => auditoria.push(argumentos),
  esObjetoPlano: (valor) => valor !== null && typeof valor === 'object' &&
    !Array.isArray(valor)
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Correlativo.gs', 'utf8'), sandbox);
vm.runInContext(
  fs.readFileSync('AppsScript/Web/Mantenimiento.gs', 'utf8'),
  sandbox
);

const manifiesto = JSON.parse(
  fs.readFileSync('AppsScript/appsscript.json', 'utf8')
);
assert.deepStrictEqual(manifiesto.webapp, {
  access: 'ANYONE',
  executeAs: 'USER_ACCESSING'
});

assert.strictEqual(sandbox._mantenimientoEsUsuarioAutorizado(), true);
assert.strictEqual(sandbox.doGet().archivo, 'Web/PaginaMantenimiento');
assert.strictEqual(
  sandbox.doGet().urlAplicacion,
  'https://script.google.com/macros/s/prueba/exec'
);
const paginaNotas = sandbox.doGet({ parameter: { vista: 'notas' } });
assert.strictEqual(paginaNotas.archivo, 'Web/NotasGemini');
assert.strictEqual(paginaNotas.titulo, 'Notas de Reuniones por Meet');

const listadoNotas = sandbox.obtenerNotasGeminiDisponibles();
assert.strictEqual(listadoNotas.exito, true);
assert.strictEqual(listadoNotas.datos.cantidad, 10);
assert.strictEqual(listadoNotas.datos.notas.length, 10);
assert.strictEqual(listadoNotas.datos.notas[0].id, 'nota-12');
assert.strictEqual(listadoNotas.datos.notas[9].id, 'nota-3');
assert.strictEqual(
  listadoNotas.datos.notas[0].fechaCreacion,
  '2026-08-12T14:30:00.000Z'
);
assert.strictEqual(
  listadoNotas.datos.notas.some((nota) => nota.id === 'archivo-pdf'),
  false
);
assert.strictEqual(
  listadoNotas.datos.notas.some((nota) => nota.id === 'nota-papelera'),
  false
);

const estado = sandbox.obtenerEstadoMantenimiento();
assert.strictEqual(estado.exito, true);
assert.strictEqual(estado.datos.ultimoCorrelativo, 34);
assert.strictEqual(estado.datos.siguienteCorrelativo, 35);

const actualizado = sandbox.actualizarCorrelativoMantenimiento(40);
assert.strictEqual(actualizado.exito, true);
assert.strictEqual(valores.get('ACTAS_ULTIMO_CORRELATIVO'), '40');
assert.strictEqual(actualizado.datos.siguienteCorrelativo, 41);
assert.strictEqual(bloqueoLiberado, true);
assert.strictEqual(auditoria.length, 1);

assert.strictEqual(
  sandbox.actualizarCorrelativoMantenimiento(1.5).error.codigo,
  'MANTENIMIENTO_VALOR_INVALIDO'
);

bloqueoDisponible = false;
assert.strictEqual(
  sandbox.actualizarCorrelativoMantenimiento(41).error.codigo,
  'MANTENIMIENTO_BLOQUEO_NO_DISPONIBLE'
);

correoActivo = 'no-autorizado@example.com';
assert.strictEqual(sandbox._mantenimientoEsUsuarioAutorizado(), false);
assert.strictEqual(
  sandbox.obtenerEstadoMantenimiento().error.codigo,
  'MANTENIMIENTO_NO_AUTORIZADO'
);
assert.strictEqual(
  sandbox.obtenerNotasGeminiDisponibles().error.codigo,
  'MANTENIMIENTO_NO_AUTORIZADO'
);
assert.strictEqual(sandbox.doGet().titulo, 'Acceso no autorizado');

console.log('Mantenimiento.test.js: acceso, correlativo y notas correctos.');
