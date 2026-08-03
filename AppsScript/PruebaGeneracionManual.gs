/** Manual Apps Script entry point for one controlled act generation test. */

const PRUEBA_GENERACION_NOTA_ID = 'PRUEBA_GENERACION_NOTA_ID';
const PRUEBA_GENERACION_CORRELATIVO = 'PRUEBA_GENERACION_CORRELATIVO';

/**
 * Runs the manual generation using values stored in Script Properties.
 * This function is intended to be selected and executed from Apps Script.
 *
 * @returns {{exito: boolean, datos: (Object|null), error: (Object|null)}}
 */
function probarGeneracionActaManual() {
  const propiedades = PropertiesService.getScriptProperties();
  const idDocumentoFuente = propiedades.getProperty(
    PRUEBA_GENERACION_NOTA_ID
  );
  const correlativoTexto = propiedades.getProperty(
    PRUEBA_GENERACION_CORRELATIVO
  );
  const correlativo = Number(correlativoTexto);
  if (typeof idDocumentoFuente !== 'string' ||
    idDocumentoFuente.trim().length === 0 ||
    !/^[1-9][0-9]*$/.test(correlativoTexto || '') ||
    !Number.isSafeInteger(correlativo) || correlativo > 999999) {
    const invalido = {
      exito: false,
      datos: null,
      error: {
        codigo: 'PRUEBA_GENERACION_CONFIGURACION_INVALIDA',
        mensaje: 'Configura un ID y un correlativo válido para la prueba.'
      }
    };
    console.log(invalido);
    return invalido;
  }
  const resultado = ejecutarGeneracionActaSeleccionada({
    idDocumentoFuente: idDocumentoFuente.trim(),
    correlativo: correlativo
  });
  console.log({
    exito: resultado.exito,
    correlativo: resultado.exito ? resultado.datos.correlativo : null,
    codigoError: resultado.error ? resultado.error.codigo : null,
    mensaje: resultado.error ? resultado.error.mensaje : 'Acta generada.'
  });
  return resultado;
}
