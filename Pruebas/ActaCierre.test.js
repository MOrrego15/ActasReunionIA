const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function crearTexto(contenido = '') {
  const estado = { contenido };
  return {
    estado,
    getText: () => estado.contenido,
    setFontFamily(valor) { estado.fuente = valor; return this; },
    setFontSize(valor) { estado.tamano = valor; return this; },
    setBold(valor) { estado.negrita = valor; return this; }
  };
}

function crearCelda(contenido = '') {
  const texto = crearTexto(contenido);
  const estado = { texto: texto.estado, listas: [] };
  const parrafo = {
    asParagraph() { return this; },
    getText: () => texto.estado.contenido,
    setAlignment(valor) { estado.alineacion = valor; return this; },
    setSpacingBefore(valor) { estado.espacioAntes = valor; return this; },
    setSpacingAfter(valor) { estado.espacioDespues = valor; return this; },
    editAsText: () => texto
  };
  return {
    estado,
    setText(valor) { texto.estado.contenido = valor; return this; },
    setWidth(valor) { estado.ancho = valor; return this; },
    setBackgroundColor(valor) { estado.fondo = valor; return this; },
    setVerticalAlignment(valor) { estado.vertical = valor; return this; },
    setPaddingTop(valor) { estado.rellenoSuperior = valor; return this; },
    setPaddingBottom(valor) { estado.rellenoInferior = valor; return this; },
    clear() { texto.estado.contenido = ''; return this; },
    getChild: () => parrafo,
    editAsText: () => texto,
    appendListItem(valor) {
      const textoLista = crearTexto(valor);
      const lista = {
        estado: { texto: textoLista.estado },
        setGlyphType(dato) { this.estado.vineta = dato; return this; },
        setSpacingBefore(dato) {
          this.estado.espacioAntes = dato;
          return this;
        },
        setSpacingAfter(dato) {
          this.estado.espacioDespues = dato;
          return this;
        },
        setIndentStart(dato) { this.estado.sangria = dato; return this; },
        setIndentFirstLine(dato) {
          this.estado.primeraLinea = dato;
          return this;
        },
        editAsText: () => textoLista
      };
      estado.listas.push(lista);
      return lista;
    }
  };
}

function crearFila(valores) {
  const celdas = valores.map((valor) => crearCelda(valor));
  celdas[1].merge = () => {
    const fusionada = celdas[0];
    celdas.splice(1, 1);
    return fusionada;
  };
  return {
    celdas,
    getCell: (indice) => celdas[indice]
  };
}

let tabla;
const cuerpo = {
  appendTable(filas) {
    const filasSimuladas = filas.map(crearFila);
    tabla = {
      filas: filasSimuladas,
      borde: null,
      setBorderWidth(valor) { this.borde = valor; return this; },
      getRow: (indice) => filasSimuladas[indice]
    };
    return tabla;
  }
};

const sandbox = {
  DocumentApp: {
    HorizontalAlignment: { LEFT: 'LEFT' },
    VerticalAlignment: { CENTER: 'CENTER' },
    GlyphType: { BULLET: 'BULLET' }
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Acta.gs', 'utf8'), sandbox);

assert.strictEqual(
  sandbox._actaConstruirTextoTarea({
    responsable: 'Miguel Orrego',
    descripcion: 'Continuar con la actividad.'
  }),
  'Miguel Orrego: Continuar con la actividad.'
);
assert.strictEqual(
  sandbox._actaConstruirTextoTarea({
    responsable: '',
    descripcion: 'Continuar con la actividad.'
  }),
  'Continuar con la actividad.'
);
assert.strictEqual(
  sandbox._actaCalcularProximaReunion('31/07/2026'),
  '3 de Agosto de 2026'
);
assert.strictEqual(
  sandbox._actaCalcularProximaReunion('31/12/2026'),
  '1 de Enero de 2027'
);
assert.strictEqual(
  sandbox._actaCalcularProximaReunion('28/02/2028'),
  '29 de Febrero de 2028'
);
assert.strictEqual(
  sandbox._actaCalcularProximaReunion('01/08/2026'),
  '3 de Agosto de 2026'
);
assert.strictEqual(
  sandbox._actaCalcularProximaReunion('02/08/2026'),
  '3 de Agosto de 2026'
);

sandbox._actaAgregarCierre(
  cuerpo,
  [
    {
      numero: 1,
      responsable: 'Miguel Orrego',
      descripcion: 'Continuar con la actividad.'
    },
    {
      numero: 2,
      responsable: '',
      descripcion: 'Revisar el documento.'
    }
  ],
  '31/07/2026'
);

assert.strictEqual(tabla.borde, 0.75);
assert.strictEqual(
  tabla.filas[0].celdas[1].estado.texto.contenido,
  '',
  'Riesgos o problemas debe quedar vacío.'
);
assert.strictEqual(
  tabla.filas[1].celdas[0].estado.texto.contenido,
  'Acuerdos'
);
assert.strictEqual(tabla.filas[1].celdas[0].estado.fondo, '#d9d9d9');
assert.strictEqual(tabla.filas[1].celdas.length, 2);
assert.strictEqual(tabla.filas[1].celdas[0].estado.ancho, 103);
assert.strictEqual(tabla.filas[1].celdas[1].estado.ancho, 322);
assert.deepStrictEqual(
  tabla.filas[1].celdas[1].estado.listas.map(
    (item) => item.estado.texto.contenido
  ),
  [
    'Miguel Orrego: Continuar con la actividad.',
    'Revisar el documento.'
  ]
);
tabla.filas[1].celdas[1].estado.listas.forEach((item) => {
  assert.strictEqual(item.estado.vineta, 'BULLET');
  assert.strictEqual(item.estado.espacioAntes, 0);
  assert.strictEqual(item.estado.espacioDespues, 0);
});
assert.strictEqual(
  tabla.filas[2].celdas[1].estado.texto.contenido,
  '3 de Agosto de 2026'
);
assert.strictEqual(tabla.filas[2].celdas[0].estado.fondo, '#d9d9d9');

console.log('ActaCierre.test.js: acuerdos y próxima reunión correctos.');
