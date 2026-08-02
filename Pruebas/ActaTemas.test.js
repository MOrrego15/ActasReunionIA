const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function crearTexto(contenido) {
  const estado = { contenido };
  return {
    estado,
    getText: () => estado.contenido,
    setFontFamily(valor) {
      estado.fuente = valor;
      return this;
    },
    setFontSize(valor) {
      estado.tamano = valor;
      return this;
    },
    setBold(valor) {
      estado.negrita = valor;
      return this;
    }
  };
}

function crearCelda(contenido = '') {
  const texto = crearTexto(contenido);
  const estado = { texto: texto.estado };
  const parrafo = {
    getText: () => texto.estado.contenido,
    asParagraph() { return this; },
    setAlignment(valor) {
      estado.alineacion = valor;
      return this;
    },
    setSpacingBefore(valor) {
      estado.espacioAntes = valor;
      return this;
    },
    setSpacingAfter(valor) {
      estado.espacioDespues = valor;
      return this;
    },
    editAsText: () => texto
  };
  return {
    estado,
    setWidth(valor) {
      estado.ancho = valor;
      return this;
    },
    setBackgroundColor(valor) {
      estado.fondo = valor;
      return this;
    },
    setVerticalAlignment(valor) {
      estado.vertical = valor;
      return this;
    },
    setPaddingTop(valor) {
      estado.rellenoSuperior = valor;
      return this;
    },
    setPaddingBottom(valor) {
      estado.rellenoInferior = valor;
      return this;
    },
    setPaddingLeft(valor) {
      estado.rellenoIzquierdo = valor;
      return this;
    },
    setPaddingRight(valor) {
      estado.rellenoDerecho = valor;
      return this;
    },
    clear() {
      estado.limpiada = true;
      return this;
    },
    getChild: () => parrafo,
    getNumChildren: () => 1,
    removeChild() { return this; },
    editAsText: () => texto
  };
}

function crearTabla(filas) {
  const celdas = filas.map((fila) => fila.map((valor) => crearCelda(valor)));
  return {
    filas,
    celdas,
    borde: null,
    setBorderWidth(valor) {
      this.borde = valor;
      return this;
    },
    getNumRows: () => celdas.length,
    getRow(indice) {
      return { getCell: (columna) => celdas[indice][columna] };
    }
  };
}

let tablaExterior;
let tablaInterior;
const titulo = crearCelda('TEMAS TRATADOS:');
const contenido = crearCelda('');
contenido.appendTable = function (filas) {
  tablaInterior = crearTabla(filas);
  return tablaInterior;
};
contenido.getChild = () => ({
  getType: () => 'PARAGRAPH',
  asParagraph() { return this; },
  getText: () => ''
});
const cuerpo = {
  appendTable(filas) {
    tablaExterior = crearTabla(filas);
    tablaExterior.celdas[0][0] = titulo;
    tablaExterior.celdas[0][1] = contenido;
    return tablaExterior;
  }
};

const sandbox = {
  DocumentApp: {
    HorizontalAlignment: { LEFT: 'LEFT', JUSTIFY: 'JUSTIFY' },
    VerticalAlignment: { CENTER: 'CENTER', TOP: 'TOP' },
    ElementType: { PARAGRAPH: 'PARAGRAPH' }
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Acta.gs', 'utf8'), sandbox);

const acuerdos = [
  { numero: 1, descripcion: 'Primer asunto tratado.' },
  { numero: 2, descripcion: 'Segundo asunto tratado.' },
  { numero: 3, descripcion: 'Tercer asunto tratado.' },
  { numero: 4, descripcion: 'Cuarto asunto tratado.' }
];
sandbox._actaAgregarTemasTratados(cuerpo, acuerdos);

assert.strictEqual(tablaExterior.borde, 0.75);
assert.strictEqual(titulo.estado.fondo, '#d9d9d9');
assert.strictEqual(titulo.estado.ancho, 103);
assert.strictEqual(contenido.estado.ancho, 322);
assert.strictEqual(tablaInterior.borde, 0);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(tablaInterior.filas)),
  [
    ['1.', 'Primer asunto tratado.'],
    ['2.', 'Segundo asunto tratado.'],
    ['3.', 'Tercer asunto tratado.'],
    ['4.', 'Cuarto asunto tratado.']
  ]
);
tablaInterior.celdas.forEach((fila) => {
  assert.strictEqual(fila[0].estado.ancho, 28);
  assert.strictEqual(fila[1].estado.ancho, 294);
  assert.strictEqual(fila[0].estado.espacioAntes, 0);
  assert.strictEqual(fila[0].estado.espacioDespues, 0);
  assert.strictEqual(fila[1].estado.espacioAntes, 0);
  assert.strictEqual(fila[1].estado.espacioDespues, 0);
  assert.strictEqual(fila[0].estado.rellenoSuperior, 0);
  assert.strictEqual(fila[0].estado.rellenoInferior, 0);
  assert.strictEqual(fila[1].estado.rellenoSuperior, 0);
  assert.strictEqual(fila[1].estado.rellenoInferior, 0);
  assert.strictEqual(fila[1].estado.alineacion, 'JUSTIFY');
  assert.strictEqual(fila[1].estado.vertical, 'TOP');
});

console.log('ActaTemas.test.js: acuerdos y espaciado correctos.');
