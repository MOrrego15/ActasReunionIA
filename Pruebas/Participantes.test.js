const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const contexto = { idEjecucion: 'prueba-local' };
const sandbox = {
  console,
  DocumentApp: {
    TabType: { DOCUMENT_TAB: 'DOCUMENT_TAB' }
  },
  registrarInfo() {},
  registrarError() {},
  esCadenaNoVacia(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
  },
  esObjetoPlano(valor) {
    return valor !== null && typeof valor === 'object' &&
      !Array.isArray(valor) &&
      (Object.getPrototypeOf(valor) === Object.prototype ||
       Object.getPrototypeOf(valor) === null);
  }
};
vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync('AppsScript/Gemini.gs', 'utf8'),
  sandbox
);
vm.runInContext(
  fs.readFileSync('AppsScript/Drive.gs', 'utf8'),
  sandbox
);

function documento(id, nombre, contenido) {
  return { idDocumento: id, nombre, contenido };
}

const transcripcionFuente = [
  'Reunión de prueba - Transcripción',
  '00:00:01',
  'Ana Torres: Buenos días.',
  'Luis Pérez: Buenos días.',
  'Ana Torres: Esperamos a Rosa.',
  'Carlos Ruiz: Ya ingresé.',
  'Luis Pérez: Empecemos.',
  'Diana Soto: De acuerdo.',
  'Ana Torres: Gracias.'
].join('\n');

const notasTematicas = [
  'Objetivos de la reunión: revisar el proyecto',
  'Coordinación: esperar la aprobación',
  'Acuerdos: continuar mañana'
].join('\n');

const contenidoCombinado = [
  'Resumen',
  'Coordinación inicial y espera de integrantes: texto temático.',
  'Estatus de la solicitud de cambio y validación: texto temático.',
  'Inicio de la reunión y registro fotográfico: texto temático.',
  'Objetivos de la reunión: texto temático.',
  'Ajustes al flujo de trabajo del PMI: texto temático.',
  transcripcionFuente
].join('\n');

const otraTranscripcion = [
  'Otra reunión - Transcripción',
  'Persona Uno: Inicio.',
  'Persona Dos: Conforme.',
  'Persona Uno: Fin.',
  'Persona Dos: Gracias.',
  'Persona Uno: Hasta luego.'
].join('\n');

const seleccionFuente = sandbox.seleccionarTranscripcionAsociada(
  { idDocumentoFuente: 'fuente', nombre: 'Notas de Gemini' },
  [
    documento('otra', 'Otra reunión - Transcripción', otraTranscripcion),
    documento('fuente', 'Notas de Gemini', transcripcionFuente)
  ],
  contexto
);
assert.strictEqual(seleccionFuente.exito, true);
assert.strictEqual(
  seleccionFuente.datos.idDocumentoTranscripcion,
  'fuente',
  'El documento fuente actual debe prevalecer sobre otra transcripción.'
);

const seleccionFuenteDuplicada = sandbox.seleccionarTranscripcionAsociada(
  { idDocumentoFuente: 'fuente', nombre: 'Notas de Gemini' },
  [
    documento('fuente', 'Notas de Gemini', transcripcionFuente),
    documento('fuente', 'Notas de Gemini', transcripcionFuente)
  ],
  contexto
);
assert.strictEqual(seleccionFuenteDuplicada.exito, true);
assert.strictEqual(
  seleccionFuenteDuplicada.datos.idDocumentoTranscripcion,
  'fuente',
  'Una autorreferencia al mismo Google Docs no debe crear ambigüedad.'
);

const seleccionVinculada = sandbox.seleccionarTranscripcionAsociada(
  { idDocumentoFuente: 'notas', nombre: 'Notas de Gemini' },
  [
    documento('notas', 'Notas de Gemini', notasTematicas),
    documento('vinculada', 'Transcripción', transcripcionFuente)
  ],
  contexto
);
assert.strictEqual(seleccionVinculada.exito, true);
assert.strictEqual(
  seleccionVinculada.datos.idDocumentoTranscripcion,
  'vinculada',
  'Debe aceptar la transcripción vinculada a las notas.'
);

const extraccion = sandbox.extraerParticipantesConfirmados(
  transcripcionFuente,
  contexto
);

const extraccionCombinada = sandbox.extraerParticipantesConfirmados(
  contenidoCombinado,
  contexto
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(extraccionCombinada.datos.participantes)),
  [
    { nombre: 'Ana Torres', cargo: '' },
    { nombre: 'Luis Pérez', cargo: '' },
    { nombre: 'Carlos Ruiz', cargo: '' },
    { nombre: 'Diana Soto', cargo: '' }
  ],
  'Debe ignorar encabezados anteriores al título y al tiempo.'
);
assert.strictEqual(extraccion.exito, true);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(extraccion.datos.participantes)),
  [
    { nombre: 'Ana Torres', cargo: '' },
    { nombre: 'Luis Pérez', cargo: '' },
    { nombre: 'Carlos Ruiz', cargo: '' },
    { nombre: 'Diana Soto', cargo: '' }
  ],
  'Debe extraer solo hablantes y excluir a Rosa, que fue mencionada.'
);

function pestana(texto, hijas = []) {
  const cuerpo = { getText: () => texto };
  return {
    getType: () => 'DOCUMENT_TAB',
    asDocumentTab: () => ({ getBody: () => cuerpo }),
    getChildTabs: () => hijas
  };
}

const pestanaHija = pestana('Contenido de pestaña anidada');
const documentoConPestanas = {
  getTabs: () => [
    pestana('Contenido de pestaña principal', [pestanaHija])
  ],
  getBody: () => {
    throw new Error('No debe limitarse al primer cuerpo.');
  }
};
const cuerpos = sandbox._driveObtenerCuerposDocumento(documentoConPestanas);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(cuerpos.map((cuerpo) => cuerpo.getText()))),
  ['Contenido de pestaña principal', 'Contenido de pestaña anidada'],
  'Debe recorrer pestañas principales y anidadas.'
);

console.log('Participantes.test.js: 6 casos correctos.');
