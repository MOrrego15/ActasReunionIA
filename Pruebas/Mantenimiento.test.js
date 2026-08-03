const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const valores = new Map([
  ['ACTAS_ULTIMO_CORRELATIVO', '34'],
  ['MANTENIMIENTO_CORREOS_AUTORIZADOS',
    'administrador@example.com; otro@example.com']
]);
let correoActivo = 'ADMINISTRADOR@example.com';
let bloqueoDisponible = true;
let bloqueoLiberado = false;
const auditoria = [];

const propiedades = {
  getProperty: (clave) => valores.has(clave) ? valores.get(clave) : null,
  setProperty: (clave, valor) => valores.set(clave, valor)
};
const sandbox = {
  Session: {
    getActiveUser: () => ({ getEmail: () => correoActivo })
  },
  PropertiesService: { getScriptProperties: () => propiedades },
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
    createTemplateFromFile: (archivo) => ({
      evaluate: () => ({
        archivo,
        setTitle(titulo) { this.titulo = titulo; return this; }
      })
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
assert.strictEqual(sandbox.doGet().titulo, 'Acceso no autorizado');

console.log('Mantenimiento.test.js: acceso y correlativo correctos.');
