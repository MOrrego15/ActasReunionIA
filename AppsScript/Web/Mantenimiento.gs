/** Web maintenance page for the act sequence number. */

const MANTENIMIENTO_CLAVE_CORREOS = 'MANTENIMIENTO_CORREOS_AUTORIZADOS';
const MANTENIMIENTO_TITULO = 'Mantenimiento del correlativo de actas';
const MANTENIMIENTO_LIMITE_CORRELATIVO = 999999;

/**
 * Serves the maintenance web page only to authorized Google accounts.
 *
 * @returns {GoogleAppsScript.HTML.HtmlOutput} Authorized or denied page.
 */
function doGet() {
  if (!_mantenimientoEsUsuarioAutorizado()) {
    return HtmlService.createHtmlOutput(
      '<h1>Acceso no autorizado</h1>' +
      '<p>Tu cuenta no está autorizada para usar esta página.</p>'
    ).setTitle('Acceso no autorizado');
  }
  return HtmlService.createTemplateFromFile('Web/PaginaMantenimiento')
    .evaluate()
    .setTitle(MANTENIMIENTO_TITULO);
}

/**
 * Returns the last reserved sequence and the next available value.
 *
 * @returns {Object} Structured maintenance response.
 */
function obtenerEstadoMantenimiento() {
  if (!_mantenimientoEsUsuarioAutorizado()) {
    return _mantenimientoResultadoError(
      'MANTENIMIENTO_NO_AUTORIZADO',
      'La cuenta activa no está autorizada.'
    );
  }
  try {
    const propiedades = PropertiesService.getScriptProperties();
    const persistido = propiedades.getProperty(CORRELATIVO_CLAVE_PERSISTENCIA);
    const validacion = _correlativoValidarValorPersistido(persistido);
    if (!validacion.valido) {
      return _mantenimientoResultadoError(
        'MANTENIMIENTO_CORRELATIVO_INVALIDO',
        'El correlativo almacenado no es válido.'
      );
    }
    return {
      exito: true,
      datos: {
        ultimoCorrelativo: validacion.valor,
        siguienteCorrelativo:
          validacion.valor < MANTENIMIENTO_LIMITE_CORRELATIVO
            ? validacion.valor + 1
            : null
      },
      error: null
    };
  } catch (errorLectura) {
    return _mantenimientoResultadoError(
      'MANTENIMIENTO_LECTURA_ERROR',
      'No fue posible leer el correlativo.'
    );
  }
}

/**
 * Replaces the last reserved sequence using the same script lock as runtime.
 *
 * @param {number} nuevoCorrelativo Last sequence that must be considered used.
 * @returns {Object} Structured maintenance response.
 */
function actualizarCorrelativoMantenimiento(nuevoCorrelativo) {
  if (!_mantenimientoEsUsuarioAutorizado()) {
    return _mantenimientoResultadoError(
      'MANTENIMIENTO_NO_AUTORIZADO',
      'La cuenta activa no está autorizada.'
    );
  }
  if (!Number.isSafeInteger(nuevoCorrelativo) || nuevoCorrelativo < 0 ||
    nuevoCorrelativo > MANTENIMIENTO_LIMITE_CORRELATIVO) {
    return _mantenimientoResultadoError(
      'MANTENIMIENTO_VALOR_INVALIDO',
      'Ingresa un número entero entre 0 y 999999.'
    );
  }

  const bloqueo = LockService.getScriptLock();
  let adquirido = false;
  try {
    adquirido = bloqueo.tryLock(CORRELATIVO_TIEMPO_ESPERA_BLOQUEO_MS);
    if (!adquirido) {
      return _mantenimientoResultadoError(
        'MANTENIMIENTO_BLOQUEO_NO_DISPONIBLE',
        'Existe otra ejecución activa. Intenta nuevamente.'
      );
    }
    const propiedades = PropertiesService.getScriptProperties();
    const valorAnterior = propiedades.getProperty(
      CORRELATIVO_CLAVE_PERSISTENCIA
    );
    propiedades.setProperty(
      CORRELATIVO_CLAVE_PERSISTENCIA,
      String(nuevoCorrelativo)
    );
    if (propiedades.getProperty(CORRELATIVO_CLAVE_PERSISTENCIA) !==
      String(nuevoCorrelativo)) {
      throw new Error('persistencia');
    }
    _mantenimientoRegistrarCambio(valorAnterior, nuevoCorrelativo);
    return {
      exito: true,
      datos: {
        ultimoCorrelativo: nuevoCorrelativo,
        siguienteCorrelativo:
          nuevoCorrelativo < MANTENIMIENTO_LIMITE_CORRELATIVO
            ? nuevoCorrelativo + 1
            : null
      },
      error: null
    };
  } catch (errorEscritura) {
    return _mantenimientoResultadoError(
      'MANTENIMIENTO_ESCRITURA_ERROR',
      'No fue posible actualizar el correlativo.'
    );
  } finally {
    if (adquirido) bloqueo.releaseLock();
  }
}

function _mantenimientoEsUsuarioAutorizado() {
  try {
    const correo = Session.getActiveUser().getEmail().trim().toLowerCase();
    if (correo.length === 0) return false;
    const configurados = PropertiesService.getScriptProperties()
      .getProperty(MANTENIMIENTO_CLAVE_CORREOS);
    if (typeof configurados !== 'string') return false;
    return configurados.split(/[;,\n\r]+/).some(function (elemento) {
      return elemento.trim().toLowerCase() === correo;
    });
  } catch (errorAutorizacion) {
    return false;
  }
}

function _mantenimientoRegistrarCambio(valorAnterior, nuevoCorrelativo) {
  try {
    registrarInfo(
      'Mantenimiento',
      'actualizarCorrelativoMantenimiento',
      'El correlativo fue actualizado manualmente.',
      {
        datos: {
          anterior: valorAnterior === null ? 0 : Number(valorAnterior),
          nuevo: nuevoCorrelativo,
          resultado: 'correcto'
        }
      }
    );
  } catch (errorRegistro) {
    // Logging failure does not revert a verified update.
  }
}

function _mantenimientoResultadoError(codigo, mensaje) {
  return {
    exito: false,
    datos: null,
    error: { codigo: codigo, mensaje: mensaje }
  };
}
