const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function crearParrafo(textoInicial = '') {
  const estado = { texto: textoInicial };
  return {
    estado,
    getType: () => 'PARAGRAPH',
    asParagraph() { return this; },
    getText: () => estado.texto,
    setAlignment(valor) { estado.alineacion = valor; return this; },
    setSpacingBefore(valor) { estado.antes = valor; return this; },
    setSpacingAfter(valor) { estado.despues = valor; return this; },
    setLineSpacing(valor) { estado.interlineado = valor; return this; },
    editAsText() {
      return {
        getText: () => estado.texto,
        setFontFamily(valor) { estado.fuente = valor; return this; },
        setFontSize(valor) { estado.tamano = valor; return this; },
        setBold(valor) { estado.negrita = valor; return this; }
      };
    },
    appendInlineImage(blob) {
      estado.logo = { blob };
      return {
        setWidth(valor) { estado.logo.ancho = valor; return this; },
        setHeight(valor) { estado.logo.alto = valor; return this; }
      };
    }
  };
}

function crearCelda(texto = '') {
  const estado = { texto };
  const parrafo = crearParrafo(texto);
  const hijos = [parrafo];
  return {
    estado,
    hijos,
    setWidth(valor) { estado.ancho = valor; return this; },
    setText(valor) {
      estado.texto = valor;
      parrafo.estado.texto = valor;
      return this;
    },
    setPaddingTop(valor) { estado.paddingTop = valor; return this; },
    setPaddingBottom(valor) { estado.paddingBottom = valor; return this; },
    setPaddingLeft(valor) { estado.paddingLeft = valor; return this; },
    setPaddingRight(valor) { estado.paddingRight = valor; return this; },
    setVerticalAlignment(valor) { estado.vertical = valor; return this; },
    clear() {
      estado.texto = '';
      parrafo.estado.texto = '';
      hijos.splice(0, hijos.length, parrafo);
      return this;
    },
    appendTable(filas) {
      const tabla = crearTabla(filas);
      hijos.push(tabla);
      estado.tabla = tabla;
      return tabla;
    },
    getNumChildren: () => hijos.length,
    getChild: (indice) => hijos[indice],
    removeChild(elemento) {
      hijos.splice(hijos.indexOf(elemento), 1);
      return this;
    }
  };
}

function crearTabla(filas) {
  const filasCreadas = filas.map((valores) => ({
    celdas: valores.map(crearCelda),
    getCell(indice) { return this.celdas[indice]; }
  }));
  return {
    filas: filasCreadas,
    setBorderWidth(valor) { this.borde = valor; return this; },
    getNumRows: () => filasCreadas.length,
    getRow: (indice) => filasCreadas[indice]
  };
}

let tablaExterior;
const cuerpo = {
  appendTable(filas) {
    tablaExterior = crearTabla(filas);
    return tablaExterior;
  }
};

const sandbox = {
  DocumentApp: {
    HorizontalAlignment: { LEFT: 'LEFT', CENTER: 'CENTER' },
    VerticalAlignment: { TOP: 'TOP', CENTER: 'CENTER' },
    ElementType: { PARAGRAPH: 'PARAGRAPH' }
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Acta.gs', 'utf8'), sandbox);

sandbox._actaAgregarCabecera(cuerpo, '02/07/2026', { imagen: true });

assert.strictEqual(tablaExterior.filas.length, 3);
const celdaLogo = tablaExterior.filas[0].celdas[0];
const celdaControles = tablaExterior.filas[0].celdas[1];
assert.strictEqual(celdaLogo.estado.ancho, 103);
assert.strictEqual(celdaControles.estado.ancho, 322);
assert.strictEqual(celdaLogo.estado.paddingTop, 0);
assert.strictEqual(celdaLogo.estado.paddingBottom, 0);
assert.strictEqual(celdaLogo.estado.paddingLeft, 0);
assert.strictEqual(celdaLogo.estado.paddingRight, 0);
assert.strictEqual(celdaLogo.estado.vertical, 'CENTER');
assert.strictEqual(celdaLogo.hijos[0].estado.logo.ancho, 100);
assert.strictEqual(celdaLogo.hijos[0].estado.logo.alto, 32);

const controles = celdaControles.estado.tabla;
assert.strictEqual(controles.filas.length, 3);
assert.strictEqual(controles.filas[0].celdas[0].estado.texto, 'Acta de Reunión');
assert.strictEqual(controles.filas[0].celdas[1].estado.texto, 'Código:');
assert.strictEqual(controles.filas[1].celdas[1].estado.texto, 'Versión:');
assert.strictEqual(controles.filas[2].celdas[1].estado.texto, 'Fecha:');
assert.strictEqual(controles.filas[2].celdas[2].estado.texto, '02.07.2026');
controles.filas.forEach((fila) => {
  assert.strictEqual(fila.celdas[0].estado.ancho, 190);
  assert.strictEqual(fila.celdas[1].estado.ancho, 56);
  assert.strictEqual(fila.celdas[2].estado.ancho, 76);
});
assert.strictEqual(celdaControles.hijos.length, 1);
assert.strictEqual(tablaExterior.filas[1].celdas[0].estado.texto, 'Proyecto:');
assert.strictEqual(
  tablaExterior.filas[2].celdas[0].estado.texto,
  'Director de Proyecto:'
);

console.log('ActaCabecera.test.js: estructura institucional correcta.');
