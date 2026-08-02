const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function textoSimulado() {
  const estado = {};
  return {
    estado,
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

function celdaSimulada() {
  const texto = textoSimulado();
  const estado = { texto: texto.estado };
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
    editAsText() {
      return texto;
    }
  };
}

const etiqueta = celdaSimulada();
const valor = celdaSimulada();
const tabla = {
  borde: null,
  setBorderWidth(ancho) {
    this.borde = ancho;
    return this;
  },
  getRow() {
    return {
      getCell(indice) {
        return indice === 0 ? etiqueta : valor;
      }
    };
  }
};
let filasRecibidas;
const cuerpo = {
  appendTable(filas) {
    filasRecibidas = filas;
    return tabla;
  }
};

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Acta.gs', 'utf8'), sandbox);
sandbox._actaAgregarAgenda(cuerpo);

assert.deepStrictEqual(
  JSON.parse(JSON.stringify(filasRecibidas)),
  [['Agenda', 'Dayli – reunión de seguimiento']]
);
assert.strictEqual(tabla.borde, 0.75);
assert.strictEqual(etiqueta.estado.ancho, 103);
assert.strictEqual(valor.estado.ancho, 322);
assert.strictEqual(etiqueta.estado.fondo, '#d9d9d9');
assert.deepStrictEqual(
  etiqueta.estado.texto,
  { fuente: 'Arial', tamano: 10, negrita: true }
);
assert.deepStrictEqual(
  valor.estado.texto,
  { fuente: 'Arial', tamano: 10, negrita: false }
);

console.log('ActaAgenda.test.js: contenido y formato correctos.');
