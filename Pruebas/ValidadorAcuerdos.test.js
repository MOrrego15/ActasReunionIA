const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const sandbox = {
  esObjetoPlano(valor) {
    return valor !== null && typeof valor === 'object' &&
      !Array.isArray(valor);
  }
};
vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync('AppsScript/ValidadorRespuesta.gs', 'utf8'),
  sandbox
);

const normalizados = sandbox._validadorNormalizarNumerados(
  [
    {
      numero: 1,
      descripcion: 'Continuar con la actividad.',
      responsable: 'Miguel Orrego'
    },
    {
      numero: 2,
      descripcion: 'Revisar el documento.'
    }
  ],
  false
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(normalizados)),
  [
    {
      numero: 1,
      descripcion: 'Continuar con la actividad.',
      responsable: 'Miguel Orrego'
    },
    {
      numero: 2,
      descripcion: 'Revisar el documento.',
      responsable: ''
    }
  ]
);

const prompt = fs.readFileSync('AppsScript/Prompt.gs', 'utf8');
assert.match(prompt, /acuerdos: \[\{numero:integer,descripcion:string no vacía,/);
assert.match(prompt, /responsable:string/);
assert.match(prompt, /usa cadena vacía si no existe/);

const sandboxOpenAI = {};
vm.createContext(sandboxOpenAI);
vm.runInContext(
  fs.readFileSync('AppsScript/OpenAI.gs', 'utf8'),
  sandboxOpenAI
);
const esquemaAcuerdo =
  sandboxOpenAI._openAIConstruirEsquemaActa().properties.acuerdos.items;
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(esquemaAcuerdo.required)),
  ['numero', 'descripcion', 'responsable']
);
assert.strictEqual(esquemaAcuerdo.additionalProperties, false);
assert.strictEqual(esquemaAcuerdo.properties.responsable.type, 'string');

console.log('ValidadorAcuerdos.test.js: responsable normalizado.');
