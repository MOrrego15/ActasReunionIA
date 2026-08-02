const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function textoSimulado(texto) {
  const estado = { contenido: texto };
  return {
    estado,
    getText() {
      return estado.contenido;
    },
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

function celdaSimulada(textoInicial = '') {
  const texto = textoSimulado(textoInicial);
  const estado = { texto: texto.estado };
  const parrafo = {
    getText: () => texto.estado.contenido,
    asParagraph() {
      return this;
    },
    setAlignment() {
      return this;
    },
    setSpacingBefore() {
      return this;
    },
    setSpacingAfter() {
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
      estado.alineacionVertical = valor;
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
    setPaddingLeft() { return this; },
    setPaddingRight() { return this; },
    clear() {
      estado.limpiada = true;
      return this;
    },
    getChild() {
      return parrafo;
    },
    getNumChildren() {
      return 1;
    },
    removeChild() {
      return this;
    },
    editAsText: () => texto
  };
}

function tablaDesdeFilas(filas) {
  const celdas = filas.map((fila) => fila.map((valor) =>
    celdaSimulada(valor)));
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
      return {
        getCell: (columna) => celdas[indice][columna]
      };
    }
  };
}

let tablaExterior;
let tablaInterior;
const titulo = celdaSimulada('Siglas y Acrónimos');
const contenido = celdaSimulada('');
contenido.appendTable = function (filas) {
  tablaInterior = tablaDesdeFilas(filas);
  return tablaInterior;
};
contenido.getChild = function () {
  return {
    getType: () => 'PARAGRAPH',
    asParagraph() {
      return this;
    },
    getText: () => ''
  };
};
const cuerpo = {
  appendTable(filas) {
    tablaExterior = tablaDesdeFilas(filas);
    tablaExterior.celdas[0][0] = titulo;
    tablaExterior.celdas[0][1] = contenido;
    return tablaExterior;
  }
};

const sandbox = {
  DocumentApp: {
    HorizontalAlignment: { LEFT: 'LEFT' },
    VerticalAlignment: { CENTER: 'CENTER', TOP: 'TOP' },
    ElementType: { PARAGRAPH: 'PARAGRAPH' }
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Acta.gs', 'utf8'), sandbox);
sandbox._actaAgregarSiglasAcronimos(cuerpo);

assert.strictEqual(tablaExterior.borde, 0.75);
assert.strictEqual(titulo.estado.fondo, '#d9d9d9');
assert.strictEqual(titulo.estado.ancho, 103);
assert.strictEqual(contenido.estado.ancho, 322);
assert.strictEqual(tablaInterior.borde, 0);
assert.strictEqual(tablaInterior.filas.length, 11);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(tablaInterior.filas[0])),
  ['1.', 'AFSP: Administración Financiera del Sector Público']
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(tablaInterior.filas[10])),
  [
    '11.',
    'SNPMGI: Sistema Nacional de Programación Multianual y Gestión de ' +
      'Inversiones.'
  ]
);
tablaInterior.celdas.forEach((fila) => {
  assert.strictEqual(fila[0].estado.ancho, 28);
  assert.strictEqual(fila[1].estado.ancho, 294);
  assert.strictEqual(fila[0].estado.texto.fuente, 'Arial');
  assert.strictEqual(fila[1].estado.texto.tamano, 9);
  assert.strictEqual(fila[0].estado.alineacionVertical, 'TOP');
  assert.strictEqual(fila[1].estado.alineacionVertical, 'TOP');
  assert.strictEqual(fila[0].estado.rellenoSuperior, 0);
  assert.strictEqual(fila[0].estado.rellenoInferior, 0);
  assert.strictEqual(fila[1].estado.rellenoSuperior, 0);
  assert.strictEqual(fila[1].estado.rellenoInferior, 0);
});

console.log('ActaSiglas.test.js: 11 elementos y formato correctos.');
