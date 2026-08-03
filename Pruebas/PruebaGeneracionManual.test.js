const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

let parametrosRecibidos = null;
const valores = new Map([
  ['PRUEBA_GENERACION_NOTA_ID', 'nota-prueba'],
  ['PRUEBA_GENERACION_CORRELATIVO', '211']
]);
const sandbox = {
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: (clave) => valores.get(clave) || null
    })
  },
  ejecutarGeneracionActaSeleccionada: (parametros) => {
    parametrosRecibidos = parametros;
    return {
      exito: true,
      datos: { estado: 'PROCESADO', correlativo: parametros.correlativo },
      error: null
    };
  },
  console: { log: () => {} }
};
vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync('AppsScript/PruebaGeneracionManual.gs', 'utf8'), sandbox
);

const resultado = sandbox.probarGeneracionActaManual();
assert.strictEqual(resultado.exito, true);
assert.strictEqual(parametrosRecibidos.idDocumentoFuente, 'nota-prueba');
assert.strictEqual(parametrosRecibidos.correlativo, 211);

console.log('PruebaGeneracionManual.test.js: propiedades e invocación correctas.');
