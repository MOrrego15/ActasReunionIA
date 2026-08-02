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

const llamadasHttp = [];
const esperas = [];
const sandbox = {
  DocumentApp: {
    HorizontalAlignment: { LEFT: 'LEFT', CENTER: 'CENTER' },
    VerticalAlignment: { TOP: 'TOP', CENTER: 'CENTER' },
    ElementType: { PARAGRAPH: 'PARAGRAPH' }
  },
  ScriptApp: { getOAuthToken: () => 'token-prueba' },
  Utilities: { sleep: (milisegundos) => esperas.push(milisegundos) },
  UrlFetchApp: {
    fetch(url, opciones) {
      llamadasHttp.push({ url, opciones });
      if (opciones.method === 'get') {
        return {
          getResponseCode: () => 200,
          getContentText: () => JSON.stringify({
            body: { content: [{ endIndex: 1 }, { startIndex: 7, table: {} }] }
          })
        };
      }
      return { getResponseCode: () => 200 };
    }
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Acta.gs', 'utf8'), sandbox);

sandbox._actaAgregarCabecera(cuerpo, '02/07/2026', { imagen: true });

assert.strictEqual(tablaExterior.filas.length, 5);
const celdaLogo = tablaExterior.filas[0].celdas[0];
assert.strictEqual(celdaLogo.estado.ancho, 103);
assert.strictEqual(celdaLogo.estado.paddingTop, 0);
assert.strictEqual(celdaLogo.estado.paddingBottom, 0);
assert.strictEqual(celdaLogo.estado.paddingLeft, 0);
assert.strictEqual(celdaLogo.estado.paddingRight, 0);
assert.strictEqual(celdaLogo.estado.vertical, 'CENTER');
assert.strictEqual(celdaLogo.hijos[0].estado.logo.ancho, 100);
assert.strictEqual(celdaLogo.hijos[0].estado.logo.alto, 32);

assert.strictEqual(tablaExterior.filas[0].celdas[1].estado.texto, 'Acta de Reunión');
assert.strictEqual(tablaExterior.filas[0].celdas[2].estado.texto, 'Código:');
assert.strictEqual(tablaExterior.filas[1].celdas[2].estado.texto, 'Versión:');
assert.strictEqual(tablaExterior.filas[2].celdas[2].estado.texto, 'Fecha:');
assert.strictEqual(tablaExterior.filas[2].celdas[3].estado.texto, '02.07.2026');
tablaExterior.filas.forEach((fila) => {
  assert.strictEqual(fila.celdas[0].estado.ancho, 103);
  assert.strictEqual(fila.celdas[1].estado.ancho, 190);
  assert.strictEqual(fila.celdas[2].estado.ancho, 56);
  assert.strictEqual(fila.celdas[3].estado.ancho, 76);
});
assert.strictEqual(
  tablaExterior.filas[3].celdas[0].estado.texto,
  'Proyecto:'
);
assert.strictEqual(
  tablaExterior.filas[4].celdas[0].estado.texto,
  'Director de Proyecto:'
);

sandbox._actaCombinarCabecera('documento-123');
assert.strictEqual(llamadasHttp.length, 2);
assert.strictEqual(
  llamadasHttp[0].url,
  'https://docs.googleapis.com/v1/documents/documento-123'
);
const lote = JSON.parse(llamadasHttp[1].opciones.payload);
assert.strictEqual(lote.requests.length, 4);
const rangos = lote.requests.map((solicitud) =>
  solicitud.mergeTableCells.tableRange
);
assert.deepStrictEqual(
  rangos.map((rango) => [
    rango.tableCellLocation.tableStartLocation.index,
    rango.tableCellLocation.rowIndex,
    rango.tableCellLocation.columnIndex,
    rango.rowSpan,
    rango.columnSpan
  ]),
  [
    [7, 0, 0, 3, 1],
    [7, 0, 1, 2, 1],
    [7, 3, 1, 1, 3],
    [7, 4, 1, 1, 3]
  ]
);

sandbox._actaAgregarCabeceraCompatible(
  cuerpo,
  '02/07/2026',
  { imagen: true }
);
assert.strictEqual(tablaExterior.filas.length, 3);
assert.strictEqual(tablaExterior.filas[0].celdas[0].estado.logo, undefined);
assert.strictEqual(
  tablaExterior.filas[0].celdas[0].hijos[0].estado.logo.ancho,
  100
);
assert.strictEqual(
  tablaExterior.filas[0].celdas[1].estado.tabla.filas.length,
  3
);
assert.strictEqual(tablaExterior.filas[1].celdas[0].estado.texto, 'Proyecto:');

let intento = 0;
sandbox.UrlFetchApp.fetch = () => {
  intento += 1;
  return { getResponseCode: () => intento === 1 ? 404 : 200 };
};
const respuestaReintentada = sandbox._actaFetchDocsConReintento('url', {});
assert.strictEqual(respuestaReintentada.getResponseCode(), 200);
assert.strictEqual(intento, 2);
assert.deepStrictEqual(esperas, [500]);
assert.strictEqual(sandbox._actaEsEstadoTransitorioDocs(429), true);
assert.strictEqual(sandbox._actaEsEstadoTransitorioDocs(403), false);

console.log('ActaCabecera.test.js: combinaciones y contingencia correctas.');
