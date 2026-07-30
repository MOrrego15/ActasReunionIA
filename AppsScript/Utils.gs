/**
 * Módulo: Utils
 *
 * Responsabilidad principal:
 * Alojar únicamente utilidades técnicas transversales y reutilizables.
 *
 * Responsabilidades excluidas:
 * - No contiene reglas de negocio.
 * - No coordina el flujo.
 * - No accede directamente a servicios externos.
 * - No mantiene estado persistente.
 *
 * Dependencias previstas:
 * - Object, Date y Number del entorno estándar compatible con V8.
 */

/**
 * Determina si un valor es una cadena con contenido distinto de espacios.
 *
 * Las entradas inválidas o de tipos diferentes producen false. La función no
 * realiza conversiones implícitas ni propaga excepciones por dichas entradas.
 *
 * @param {*} valor Valor que se validará.
 * @returns {boolean} true si el valor es una cadena no vacía; de lo contrario,
 *     false.
 */
function esCadenaNoVacia(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

/**
 * Determina si un valor es un objeto plano.
 *
 * Solo acepta objetos cuyo prototipo sea Object.prototype o null. Las entradas
 * inválidas, los objetos especializados y los fallos al consultar el prototipo
 * producen false. No realiza conversiones implícitas ni propaga excepciones.
 *
 * @param {*} valor Valor que se validará.
 * @returns {boolean} true si el valor es un objeto plano; de lo contrario,
 *     false.
 */
function esObjetoPlano(valor) {
  if (valor === null || typeof valor !== 'object') {
    return false;
  }

  try {
    const prototipo = Object.getPrototypeOf(valor);
    return prototipo === Object.prototype || prototipo === null;
  } catch (errorPrototipo) {
    return false;
  }
}

/**
 * Determina si un valor es un número finito.
 *
 * Las entradas inválidas o de tipos diferentes producen false. La función no
 * convierte cadenas ni otros valores y no propaga excepciones por entradas
 * inválidas.
 *
 * @param {*} valor Valor que se validará.
 * @returns {boolean} true si el valor es un número finito; de lo contrario,
 *     false.
 */
function esNumeroFinito(valor) {
  return typeof valor === 'number' && Number.isFinite(valor);
}

/**
 * Determina si un valor pertenece estrictamente al tipo booleano.
 *
 * Las entradas inválidas o de tipos diferentes producen false. La función no
 * interpreta valores equivalentes, no realiza conversiones implícitas ni
 * propaga excepciones por entradas inválidas.
 *
 * @param {*} valor Valor que se validará.
 * @returns {boolean} true únicamente para true o false; de lo contrario,
 *     false.
 */
function esBooleano(valor) {
  return typeof valor === 'boolean';
}

/**
 * Determina si un valor es una instancia válida de Date.
 *
 * No interpreta ni convierte cadenas, números u otros valores. Las entradas
 * inválidas y los fallos al consultar el tiempo producen false, sin propagar
 * excepciones.
 *
 * @param {*} valor Valor que se validará.
 * @returns {boolean} true si el valor es una fecha válida; de lo contrario,
 *     false.
 */
function esFechaValida(valor) {
  if (!(valor instanceof Date)) {
    return false;
  }

  try {
    return Number.isFinite(valor.getTime());
  } catch (errorFecha) {
    return false;
  }
}
