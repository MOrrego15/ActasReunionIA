const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

function crearCelda(textoInicial) {
  const estado = { texto: textoInicial };
  const texto = {
    setFontFamily() { return this; },
    setFontSize() { return this; },
    setBold() { return this; },
    setItalic() { return this; }
  };
  return {
    estado,
    setWidth() { return this; },
    setBackgroundColor() { return this; },
    editAsText() { return texto; }
  };
}

let tablaCreada;
const cuerpo = {
  appendTable(filas) {
    const filasCreadas = filas.map(function (valores) {
      const celdas = valores.map(crearCelda);
      return { getCell: (indice) => celdas[indice], celdas };
    });
    tablaCreada = {
      getNumRows: () => filasCreadas.length,
      getRow: (indice) => filasCreadas[indice],
      filas: filasCreadas
    };
    return tablaCreada;
  }
};

const sandbox = {
  esCadenaNoVacia: (valor) => typeof valor === 'string' &&
    valor.trim().length > 0,
  esObjetoPlano: (valor) => valor !== null && typeof valor === 'object' &&
    !Array.isArray(valor)
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/Acta.gs', 'utf8'), sandbox);

const datosEditados = {
  horaInicio: '10:15 AM',
  horaFin: '11:45 AM',
  agenda: 'Revisión del proyecto',
  proximaReunion: ''
};

sandbox._actaAgregarDatosReunion(
  cuerpo,
  15,
  '18/08/2026',
  'CEL002',
  datosEditados
);
assert.strictEqual(
  tablaCreada.filas[2].celdas[1].estado.texto,
  '10:15 AM a 11:45 AM'
);

sandbox._actaAgregarDatosReunion(
  cuerpo,
  15,
  '18/08/2026',
  'CEL002'
);
assert.strictEqual(
  tablaCreada.filas[2].celdas[1].estado.texto,
  '09:00 am a 09:20 am'
);

assert.strictEqual(
  sandbox._actaValidarDatosReunionEditable(datosEditados),
  true
);
assert.strictEqual(
  sandbox._actaValidarDatosReunionEditable({
    horaInicio: '24:00 PM',
    horaFin: '11:45 AM',
    agenda: 'Revisión',
    proximaReunion: ''
  }),
  false
);

console.log(
  'ActaDatosReunionEditable.test.js: horas y validación correctas.'
);
