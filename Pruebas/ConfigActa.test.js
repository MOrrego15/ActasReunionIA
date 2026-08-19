const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const sandbox = {
  esCadenaNoVacia: (valor) => typeof valor === 'string' &&
    valor.trim().length > 0
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Config.gs', 'utf8'), sandbox);

function propiedadesBase() {
  return {
    CARPETA_NOTAS_GEMINI_ID: 'notas',
    PLANTILLA_ACTA_ID: 'plantilla',
    CARPETA_OTRO: 'recursos',
    CARPETA_RAIZ_ACTAS_ID: 'actas',
    REPOSITORIO_PROCESADOS_ID: 'procesados',
    GEMINI_API_KEY: 'clave-prueba',
    PROMPT_VERSION: 'v1',
    ACTA_CODIGO_FORMATO: 'FR 37',
    ACTA_CELULA: 'CEL002',
    ACTA_AGENDA_FIJA: 'reunión de seguimiento'
  };
}

const configuracion = sandbox._configConstruir(propiedadesBase());
assert.strictEqual(configuracion.geminiIA.modelo, 'gemini-3.6-flash');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(configuracion.actas)),
  {
    carpetaRaizId: 'actas',
    codigoFormato: 'FR 37',
    celula: 'CEL002',
    agendaFija: 'reunión de seguimiento'
  }
);

const agendaVacia = propiedadesBase();
agendaVacia.ACTA_AGENDA_FIJA = '   ';
assert.strictEqual(
  sandbox._configConstruir(agendaVacia).actas.agendaFija,
  undefined
);

const celulaVacia = propiedadesBase();
celulaVacia.ACTA_CELULA = '';
assert.throws(
  () => sandbox._configConstruir(celulaVacia),
  /ACTA_CELULA/
);

const modeloRetirado = propiedadesBase();
modeloRetirado.GEMINI_MODELO = 'gemini-2.0-flash';
assert.strictEqual(
  sandbox._configConstruir(modeloRetirado).geminiIA.modelo,
  'gemini-3.6-flash'
);

const modeloVigente = propiedadesBase();
modeloVigente.GEMINI_MODELO = 'gemini-2.5-flash';
assert.strictEqual(
  sandbox._configConstruir(modeloVigente).geminiIA.modelo,
  'gemini-2.5-flash'
);

const codigoVacio = propiedadesBase();
codigoVacio.ACTA_CODIGO_FORMATO = '';
assert.throws(
  () => sandbox._configConstruir(codigoVacio),
  /ACTA_CODIGO_FORMATO/
);

console.log('ConfigActa.test.js: configuración del formato validada.');
