/**
 * Módulo: Logger
 *
 * Responsabilidad principal:
 * Construir, sanitizar y escribir registros técnicos mínimos para la
 * trazabilidad básica del proceso.
 *
 * Responsabilidades excluidas:
 * - No registra contenido sensible completo.
 * - No registra secretos, claves, tokens ni credenciales.
 * - No decide el flujo ni ejecuta reglas de negocio.
 * - No genera identificadores de ejecución.
 * - No persiste auditorías ni configura destinos adicionales.
 *
 * Dependencias previstas:
 * - Logger nativo de Google Apps Script.
 * - Date y funciones estándar compatibles con V8.
 */

const LOGGER_NIVELES = Object.freeze({
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
});

const LOGGER_NIVELES_VALIDOS = Object.freeze([
  LOGGER_NIVELES.INFO,
  LOGGER_NIVELES.WARN,
  LOGGER_NIVELES.ERROR
]);

const LOGGER_LIMITE_TEXTO = 500;

const LOGGER_FRAGMENTOS_PROHIBIDOS = Object.freeze([
  'apikey',
  'token',
  'authorization',
  'cookie',
  'header',
  'credential',
  'credencial',
  'password',
  'contrasena',
  'secret',
  'secreto',
  'scriptpropert',
  'config',
  'prompt',
  'response',
  'respuesta',
  'requestbody',
  'responsebody',
  'nota',
  'contenido',
  'documentoid',
  'archivoid',
  'carpetaid',
  'driveid',
  'docsid',
  'email',
  'correo',
  'nombre',
  'telefono'
]);

/**
 * Registra un evento informativo.
 *
 * @param {string} modulo Módulo que origina el evento.
 * @param {string} operacion Operación que se está ejecutando.
 * @param {string} mensaje Descripción segura del evento.
 * @param {Object=} contexto Contexto opcional.
 * @return {boolean} true si el registro se escribió; false en caso contrario.
 */
function registrarInfo(modulo, operacion, mensaje, contexto) {
  return _loggerRegistrar(
    LOGGER_NIVELES.INFO,
    modulo,
    operacion,
    mensaje,
    undefined,
    contexto
  );
}

/**
 * Registra una advertencia.
 *
 * @param {string} modulo Módulo que origina el evento.
 * @param {string} operacion Operación que se está ejecutando.
 * @param {string} mensaje Descripción segura de la advertencia.
 * @param {Object=} contexto Contexto opcional.
 * @return {boolean} true si el registro se escribió; false en caso contrario.
 */
function registrarAdvertencia(modulo, operacion, mensaje, contexto) {
  return _loggerRegistrar(
    LOGGER_NIVELES.WARN,
    modulo,
    operacion,
    mensaje,
    undefined,
    contexto
  );
}

/**
 * Registra un error mediante una representación segura.
 *
 * @param {string} modulo Módulo que origina el error.
 * @param {string} operacion Operación que falló.
 * @param {*} error Error o valor desconocido recibido.
 * @param {Object=} contexto Contexto opcional.
 * @return {boolean} true si el registro se escribió; false en caso contrario.
 */
function registrarError(modulo, operacion, error, contexto) {
  return _loggerRegistrar(
    LOGGER_NIVELES.ERROR,
    modulo,
    operacion,
    undefined,
    error,
    contexto
  );
}

/**
 * Coordina la validación, construcción, sanitización y escritura.
 *
 * Esta función absorbe cualquier excepción para impedir que el registro
 * interrumpa el proceso principal.
 *
 * @param {string} nivel Nivel del registro.
 * @param {string} modulo Módulo que origina el evento.
 * @param {string} operacion Operación relacionada.
 * @param {string|undefined} mensaje Mensaje del evento.
 * @param {*} error Error opcional.
 * @param {Object=} contexto Contexto opcional.
 * @return {boolean} Resultado de la escritura.
 * @private
 */
function _loggerRegistrar(
  nivel,
  modulo,
  operacion,
  mensaje,
  error,
  contexto
) {
  try {
    const esNivelError = nivel === LOGGER_NIVELES.ERROR;

    if (
      !LOGGER_NIVELES_VALIDOS.includes(nivel) ||
      !_loggerEsCadenaNoVacia(modulo) ||
      !_loggerEsCadenaNoVacia(operacion) ||
      (!esNivelError && !_loggerEsCadenaNoVacia(mensaje))
    ) {
      return false;
    }

    const registro = _loggerConstruirRegistro(
      nivel,
      modulo,
      operacion,
      mensaje,
      error,
      contexto
    );

    return _loggerEscribir(registro);
  } catch (errorInterno) {
    return false;
  }
}

/**
 * Construye un registro con los campos mínimos autorizados.
 *
 * @param {string} nivel Nivel del registro.
 * @param {string} modulo Módulo de origen.
 * @param {string} operacion Operación relacionada.
 * @param {string|undefined} mensaje Mensaje del evento.
 * @param {*} error Error opcional.
 * @param {Object=} contexto Contexto opcional.
 * @return {Object} Registro sanitizado.
 * @private
 */
function _loggerConstruirRegistro(
  nivel,
  modulo,
  operacion,
  mensaje,
  error,
  contexto
) {
  const contextoSeguro = _loggerSanitizarContexto(contexto);
  const errorSeguro =
    nivel === LOGGER_NIVELES.ERROR
      ? _loggerSanitizarError(error)
      : undefined;
  const mensajeSeguro =
    nivel === LOGGER_NIVELES.ERROR
      ? errorSeguro.mensaje
      : _loggerSanitizarTexto(mensaje);
  const registro = {
    fechaHora: new Date().toISOString(),
    nivel: nivel,
    modulo: _loggerSanitizarTexto(modulo),
    operacion: _loggerSanitizarTexto(operacion),
    mensaje: mensajeSeguro
  };

  if (contextoSeguro.idEjecucion !== undefined) {
    registro.idEjecucion = contextoSeguro.idEjecucion;
  }

  if (contextoSeguro.datos !== undefined) {
    registro.datos = contextoSeguro.datos;
  }

  if (nivel === LOGGER_NIVELES.ERROR) {
    registro.error = errorSeguro;
  }

  return registro;
}

/**
 * Determina si un valor es una cadena con contenido.
 *
 * @param {*} valor Valor que se validará.
 * @return {boolean} true si es una cadena no vacía.
 * @private
 */
function _loggerEsCadenaNoVacia(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

/**
 * Conserva únicamente idEjecucion y datos del contexto.
 *
 * @param {*} contexto Contexto recibido.
 * @return {Object} Contexto sanitizado.
 * @private
 */
function _loggerSanitizarContexto(contexto) {
  const contextoSeguro = {};

  if (
    contexto === null ||
    typeof contexto !== 'object' ||
    Array.isArray(contexto)
  ) {
    return contextoSeguro;
  }

  if (_loggerEsCadenaNoVacia(contexto.idEjecucion)) {
    contextoSeguro.idEjecucion = _loggerSanitizarTexto(
      contexto.idEjecucion
    );
  }

  if (Object.prototype.hasOwnProperty.call(contexto, 'datos')) {
    const datosSeguros = _loggerSanitizarDatos(contexto.datos);

    if (datosSeguros !== undefined) {
      contextoSeguro.datos = datosSeguros;
    }
  }

  return contextoSeguro;
}

/**
 * Sanitiza valores primitivos u objetos planos con valores primitivos.
 *
 * Arreglos, objetos anidados y valores no admitidos se omiten.
 *
 * @param {*} datos Datos recibidos.
 * @return {*|undefined} Datos seguros o ausencia explícita.
 * @private
 */
function _loggerSanitizarDatos(datos) {
  if (datos === null) {
    return null;
  }

  if (typeof datos === 'string') {
    return _loggerSanitizarTexto(datos);
  }

  if (typeof datos === 'boolean') {
    return datos;
  }

  if (typeof datos === 'number') {
    return Number.isFinite(datos) ? datos : undefined;
  }

  if (
    typeof datos !== 'object' ||
    Array.isArray(datos) ||
    Object.getPrototypeOf(datos) !== Object.prototype
  ) {
    return undefined;
  }

  const datosSeguros = {};

  Object.keys(datos).forEach(function (clave) {
    if (_loggerEsClaveProhibida(clave)) {
      return;
    }

    const valor = datos[clave];

    if (valor === null) {
      datosSeguros[clave] = null;
    } else if (typeof valor === 'string') {
      datosSeguros[clave] = _loggerSanitizarTexto(valor);
    } else if (typeof valor === 'boolean') {
      datosSeguros[clave] = valor;
    } else if (typeof valor === 'number' && Number.isFinite(valor)) {
      datosSeguros[clave] = valor;
    }
  });

  return Object.keys(datosSeguros).length > 0 ? datosSeguros : undefined;
}

/**
 * Sanitiza texto y redacta patrones sensibles.
 *
 * @param {*} texto Texto recibido.
 * @return {string} Texto sanitizado y limitado.
 * @private
 */
function _loggerSanitizarTexto(texto) {
  let textoSeguro = String(texto);

  textoSeguro = textoSeguro
    .replace(
      /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,
      'Bearer [REDACTADO]'
    )
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      '[REDACTADO]'
    )
    .replace(
      /\b(?:OPENAI_API_KEY|apiKey|token|authorization|cookie|credentials?|credenciales|password|contrase(?:n|ñ)a|secrets?|secretos?)\s*[:=]\s*[^\s,;]+/gi,
      '[REDACTADO]'
    )
    .replace(
      /https?:\/\/(?:drive|docs)\.google\.com\/[^\s]+/gi,
      '[REDACTADO]'
    )
    .replace(/\b[A-Za-z0-9_-]{20,}\b/g, '[REDACTADO]');

  return textoSeguro.slice(0, LOGGER_LIMITE_TEXTO);
}

/**
 * Determina si una clave puede contener datos prohibidos.
 *
 * @param {*} clave Clave recibida.
 * @return {boolean} true si la clave debe omitirse.
 * @private
 */
function _loggerEsClaveProhibida(clave) {
  const claveNormalizada = String(clave)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

  return LOGGER_FRAGMENTOS_PROHIBIDOS.some(function (fragmento) {
    return claveNormalizada.indexOf(fragmento) !== -1;
  });
}

/**
 * Convierte un error o valor desconocido a una representación segura.
 *
 * @param {*} error Error o valor recibido.
 * @return {{nombre: string, mensaje: string}} Error seguro.
 * @private
 */
function _loggerSanitizarError(error) {
  let nombreSeguro = 'Error';
  let mensajeSeguro = 'Error no disponible.';

  if (typeof error === 'string') {
    mensajeSeguro = _loggerSanitizarTexto(error);
  } else if (error !== null && typeof error === 'object') {
    if (_loggerEsCadenaNoVacia(error.name)) {
      nombreSeguro = _loggerSanitizarTexto(error.name);
    }

    if (_loggerEsCadenaNoVacia(error.message)) {
      mensajeSeguro = _loggerSanitizarTexto(error.message);
    }
  }

  return {
    nombre: nombreSeguro,
    mensaje: mensajeSeguro
  };
}

/**
 * Escribe un registro mediante el único destino autorizado.
 *
 * @param {Object} registro Registro sanitizado.
 * @return {boolean} true cuando Logger.log se ejecuta correctamente.
 * @private
 */
function _loggerEscribir(registro) {
  try {
    // Se escribe el objeto sanitizado directamente para conservar su estructura
    // en los registros de ejecución de Apps Script.
    Logger.log(registro);
    return true;
  } catch (errorEscritura) {
    return false;
  }
}
