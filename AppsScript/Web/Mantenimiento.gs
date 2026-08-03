/** Web maintenance page for the act sequence number. */

const MANTENIMIENTO_CLAVE_CORREOS = 'MANTENIMIENTO_CORREOS_AUTORIZADOS';
const MANTENIMIENTO_TITULO = 'Mantenimiento del correlativo de actas';
const MANTENIMIENTO_LIMITE_CORRELATIVO = 999999;
const MANTENIMIENTO_MIME_GOOGLE_DOCS =
  'application/vnd.google-apps.document';
const MANTENIMIENTO_LIMITE_NOTAS = 10;

/**
 * Serves the maintenance web page only to authorized Google accounts.
 *
 * @returns {GoogleAppsScript.HTML.HtmlOutput} Authorized or denied page.
 */
function doGet(evento) {
  if (!_mantenimientoEsUsuarioAutorizado()) {
    return HtmlService.createHtmlOutput(
      '<h1>Acceso no autorizado</h1>' +
      '<p>Tu cuenta no está autorizada para usar esta página.</p>'
    ).setTitle('Acceso no autorizado');
  }
  const vistaNotas = evento && evento.parameter &&
    evento.parameter.vista === 'notas';
  const plantilla = HtmlService.createTemplateFromFile(
    vistaNotas ? 'Web/NotasGemini' : 'Web/PaginaMantenimiento'
  );
  plantilla.urlAplicacion = ScriptApp.getService().getUrl();
  return plantilla.evaluate()
    .setTitle(
      vistaNotas ? 'Notas de Reuniones por Meet' : MANTENIMIENTO_TITULO
    );
}

/**
 * Returns up to ten newest Google Docs found in the configured notes folder.
 * Processing state is intentionally not consulted.
 *
 * @returns {Object} Structured notes response.
 */
function obtenerNotasGeminiDisponibles() {
  if (!_mantenimientoEsUsuarioAutorizado()) {
    return _mantenimientoResultadoError(
      'MANTENIMIENTO_NO_AUTORIZADO',
      'La cuenta activa no está autorizada.'
    );
  }
  try {
    const carpetaId = PropertiesService.getScriptProperties()
      .getProperty('CARPETA_NOTAS_GEMINI_ID');
    if (typeof carpetaId !== 'string' || carpetaId.trim().length === 0) {
      return _mantenimientoResultadoError(
        'MANTENIMIENTO_CARPETA_NOTAS_INVALIDA',
        'La carpeta de notas no está configurada.'
      );
    }
    const archivos = DriveApp.getFolderById(carpetaId.trim()).getFiles();
    const notas = [];
    while (archivos.hasNext()) {
      const archivo = archivos.next();
      if (archivo.isTrashed() ||
        archivo.getMimeType() !== MANTENIMIENTO_MIME_GOOGLE_DOCS) {
        continue;
      }
      const fecha = archivo.getDateCreated();
      const fechaIso = _mantenimientoConvertirFechaIso(fecha);
      const id = archivo.getId();
      const nombre = archivo.getName();
      if (fechaIso === null || typeof id !== 'string' || id.length === 0 ||
        typeof nombre !== 'string' || nombre.length === 0) {
        continue;
      }
      notas.push({ id: id, nombre: nombre, fechaCreacion: fechaIso });
    }
    notas.sort(function (primera, segunda) {
      const diferencia = new Date(segunda.fechaCreacion) -
        new Date(primera.fechaCreacion);
      if (diferencia !== 0) return diferencia;
      const nombre = primera.nombre.localeCompare(segunda.nombre);
      return nombre !== 0 ? nombre : primera.id.localeCompare(segunda.id);
    });
    return {
      exito: true,
      datos: {
        notas: notas.slice(0, MANTENIMIENTO_LIMITE_NOTAS),
        cantidad: Math.min(notas.length, MANTENIMIENTO_LIMITE_NOTAS)
      },
      error: null
    };
  } catch (errorListado) {
    return _mantenimientoResultadoError(
      'MANTENIMIENTO_LISTADO_NOTAS_ERROR',
      'No fue posible obtener las notas de Gemini.'
    );
  }
}

function _mantenimientoConvertirFechaIso(fecha) {
  try {
    const valor = fecha.toISOString();
    return isNaN(new Date(valor).getTime()) ? null : valor;
  } catch (errorFecha) {
    return null;
  }
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
