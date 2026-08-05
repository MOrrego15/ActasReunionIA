const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

let urlLlamada = '';
let opcionesLlamadas = null;

const sandbox = {
  UrlFetchApp: {
    fetch: (url, opciones) => {
      urlLlamada = url;
      opcionesLlamadas = opciones;
      return {
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify({
          candidates: [
            {
              finishReason: 'STOP',
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      titulo: 'Acta de Reunión',
                      fechaReunion: '04/08/2026',
                      horaInicio: '09:00',
                      horaFin: '10:00',
                      lugar: 'Google Meet',
                      organizador: 'Carlos',
                      participantes: [{ nombre: 'Carlos', cargo: 'Líder' }],
                      agenda: ['Punto 1'],
                      resumenEjecutivo: 'Resumen de prueba',
                      acuerdos: [{ numero: 1, descripcion: 'Acuerdo 1', responsable: 'Carlos' }],
                      tareas: [{ numero: 1, descripcion: 'Tarea 1', responsable: 'Carlos', fechaCompromiso: '05/08/2026' }],
                      observaciones: 'Ninguna'
                    })
                  }
                ]
              }
            }
          ]
        })
      };
    }
  },
  obtenerConfiguracion: () => ({
    geminiIA: {
      apiKey: 'CLAVE_TEST_GEMINI_123',
      modelo: 'gemini-2.0-flash'
    }
  }),
  registrarInfo: () => {},
  registrarError: () => {},
  esObjetoPlano: (valor) => valor !== null && typeof valor === 'object' && !Array.isArray(valor),
  esCadenaNoVacia: (valor) => typeof valor === 'string' && valor.trim().length > 0
};

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('AppsScript/GeminiIA.gs', 'utf8'), sandbox);

const mensajes = [
  { role: 'system', content: 'Eres un asistente experto.' },
  { role: 'user', content: 'Genera el acta estructurada.' }
];
const contexto = { idEjecucion: 'ejecucion-prueba-123' };

const resultado = sandbox.solicitarActaEstructuradaGemini(mensajes, contexto);

assert.strictEqual(resultado.exito, true);
assert.strictEqual(resultado.error, null);
assert.ok(resultado.datos.respuestaTexto.includes('Acta de Reunión'));

assert.ok(urlLlamada.includes('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=CLAVE_TEST_GEMINI_123'));

const cargaObj = JSON.parse(opcionesLlamadas.payload);
assert.strictEqual(cargaObj.systemInstruction.parts[0].text, 'Eres un asistente experto.');
assert.strictEqual(cargaObj.contents[0].parts[0].text, 'Genera el acta estructurada.');
assert.strictEqual(cargaObj.generationConfig.responseMimeType, 'application/json');
assert.strictEqual(cargaObj.generationConfig.responseSchema.type, 'OBJECT');

console.log('GeminiIA.test.js: Cliente GeminiIA y esquema estructurado verificados correctamente.');
