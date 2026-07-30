/**
 * Módulo: Correlativo
 *
 * Responsabilidad principal:
 * Reservar y persistir de forma concurrente la numeración secuencial de las
 * actas.
 *
 * Responsabilidades excluidas:
 * - No genera nombres de archivos.
 * - No genera documentos.
 * - No controla el estado de documentos procesados.
 * - No reutiliza correlativos ni recupera huecos.
 * - No coordina el flujo general.
 *
 * Dependencias previstas:
 * - PropertiesService y LockService.
 * - Funciones públicas aprobadas de Logger.gs y Utils.gs.
 */

const CORRELATIVO_CLAVE_PERSISTENCIA = 'ACTAS_ULTIMO_CORRELATIVO';
const CORRELATIVO_TIEMPO_ESPERA_BLOQUEO_MS = 10000;

const CORRELATIVO_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'CORRELATIVO_PARAMETRO_INVALIDO',
  BLOQUEO_NO_DISPONIBLE: 'CORRELATIVO_BLOQUEO_NO_DISPONIBLE',
  VALOR_PERSISTIDO_INVALIDO:
    'CORRELATIVO_VALOR_PERSISTIDO_INVALIDO',
  LIMITE_EXCEDIDO: 'CORRELATIVO_LIMITE_EXCEDIDO',
  PERSISTENCIA_ERROR: 'CORRELATIVO_PERSISTENCIA_ERROR',
  ERROR: 'CORRELATIVO_ERROR'
});

const CORRELATIVO_MENSAJES_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'El contexto de la reserva no es válido.',
  BLOQUEO_NO_DISPONIBLE:
    'No fue posible obtener el bloqueo para reservar el correlativo.',
  VALOR_PERSISTIDO_INVALIDO:
    'El valor persistido del correlativo no es válido.',
  LIMITE_EXCEDIDO:
    'El correlativo alcanzó el límite numérico seguro.',
  PERSISTENCIA_ERROR:
    'No fue posible persistir el correlativo.',
  ERROR: 'No fue posible reservar el correlativo.'
});

const CORRELATIVO_CAUSAS_REGISTRO = Object.freeze({
  CORRELATIVO_PARAMETRO_INVALIDO: 'contexto_invalido',
  CORRELATIVO_BLOQUEO_NO_DISPONIBLE: 'sin_bloqueo',
  CORRELATIVO_VALOR_PERSISTIDO_INVALIDO: 'valor_invalido',
  CORRELATIVO_LIMITE_EXCEDIDO: 'limite_excedido',
  CORRELATIVO_PERSISTENCIA_ERROR: 'persistencia',
  CORRELATIVO_ERROR: 'error_interno'
});

/**
 * @typedef {Object} ContextoCorrelativo
 * @property {string=} idEjecucion Identificador técnico opcional de ejecución.
 */

/**
 * @typedef {Object} DatosCorrelativo
 * @property {number} correlativo Entero positivo reservado y persistido.
 */

/**
 * @typedef {Object} ErrorCorrelativoControlado
 * @property {string} codigo Código técnico con prefijo CORRELATIVO_.
 * @property {string} mensaje Mensaje controlado sin información interna.
 */

/**
 * @typedef {Object} ResultadoCorrelativo
 * @property {boolean} exito Indica si la reserva finalizó correctamente.
 * @property {DatosCorrelativo|null} datos Datos reservados o null ante error.
 * @property {ErrorCorrelativoControlado|null} error Error controlado o null
 *     ante éxito.
 */

/**
 * Reserva y persiste el siguiente correlativo disponible para un acta.
 *
 * La lectura, validación, conversión, actualización y comprobación de la
 * propiedad ocurren dentro de un bloqueo global del script. La reserva es
 * definitiva una vez persistida y verificada. La función no reutiliza números,
 * no modifica el contexto recibido y no propaga excepciones.
 *
 * @param {ContextoCorrelativo=} contexto Contexto técnico opcional. Cuando se
 *     proporciona, solo puede contener un idEjecucion no vacío.
 * @returns {ResultadoCorrelativo} Resultado estructurado de la reserva.
 */
function reservarSiguienteCorrelativo(contexto) {
  if (!_correlativoValidarContexto(contexto)) {
    const resultadoInvalido = _correlativoConstruirResultadoError(
      CORRELATIVO_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      CORRELATIVO_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );

    _correlativoRegistrarResultado(resultadoInvalido, undefined);
    return resultadoInvalido;
  }

  const contextoRegistro =
    contexto !== undefined &&
    Object.prototype.hasOwnProperty.call(contexto, 'idEjecucion')
      ? { idEjecucion: contexto.idEjecucion }
      : undefined;
  let bloqueo;
  let bloqueoAdquirido = false;
  let resultado;

  try {
    bloqueo = LockService.getScriptLock();
    bloqueoAdquirido = bloqueo.tryLock(
      CORRELATIVO_TIEMPO_ESPERA_BLOQUEO_MS
    );

    if (!bloqueoAdquirido) {
      resultado = _correlativoConstruirResultadoError(
        CORRELATIVO_CODIGOS_ERROR.BLOQUEO_NO_DISPONIBLE,
        CORRELATIVO_MENSAJES_ERROR.BLOQUEO_NO_DISPONIBLE
      );
    } else {
      let propiedades;
      let valorPersistido;

      try {
        propiedades = PropertiesService.getScriptProperties();
        valorPersistido =
          _correlativoObtenerValorPersistido(propiedades);
      } catch (errorLectura) {
        resultado = _correlativoConstruirResultadoError(
          CORRELATIVO_CODIGOS_ERROR.PERSISTENCIA_ERROR,
          CORRELATIVO_MENSAJES_ERROR.PERSISTENCIA_ERROR
        );
      }

      if (resultado === undefined) {
        const validacion =
          _correlativoValidarValorPersistido(valorPersistido);

        if (!validacion.valido) {
          resultado = _correlativoConstruirResultadoError(
            CORRELATIVO_CODIGOS_ERROR.VALOR_PERSISTIDO_INVALIDO,
            CORRELATIVO_MENSAJES_ERROR.VALOR_PERSISTIDO_INVALIDO
          );
        } else {
          const siguienteCorrelativo =
            _correlativoCalcularSiguiente(validacion.valor);

          if (siguienteCorrelativo === null) {
            resultado = _correlativoConstruirResultadoError(
              CORRELATIVO_CODIGOS_ERROR.LIMITE_EXCEDIDO,
              CORRELATIVO_MENSAJES_ERROR.LIMITE_EXCEDIDO
            );
          } else {
            try {
              const persistenciaConfirmada =
                _correlativoPersistirValor(
                  propiedades,
                  siguienteCorrelativo
                );

              resultado = persistenciaConfirmada
                ? _correlativoConstruirResultadoExitoso(
                    siguienteCorrelativo
                  )
                : _correlativoConstruirResultadoError(
                    CORRELATIVO_CODIGOS_ERROR.PERSISTENCIA_ERROR,
                    CORRELATIVO_MENSAJES_ERROR.PERSISTENCIA_ERROR
                  );
            } catch (errorEscritura) {
              resultado = _correlativoConstruirResultadoError(
                CORRELATIVO_CODIGOS_ERROR.PERSISTENCIA_ERROR,
                CORRELATIVO_MENSAJES_ERROR.PERSISTENCIA_ERROR
              );
            }
          }
        }
      }
    }
  } catch (errorInterno) {
    resultado = _correlativoConstruirResultadoError(
      CORRELATIVO_CODIGOS_ERROR.ERROR,
      CORRELATIVO_MENSAJES_ERROR.ERROR
    );
  } finally {
    if (bloqueoAdquirido) {
      try {
        bloqueo.releaseLock();
      } catch (errorLiberacion) {
        // La reserva ya determinada no se sustituye por un fallo de liberación.
      }
    }
  }

  if (resultado === undefined) {
    resultado = _correlativoConstruirResultadoError(
      CORRELATIVO_CODIGOS_ERROR.ERROR,
      CORRELATIVO_MENSAJES_ERROR.ERROR
    );
  }

  _correlativoRegistrarResultado(resultado, contextoRegistro);
  return resultado;
}

/**
 * Valida el contexto opcional sin modificarlo ni convertir sus propiedades.
 *
 * @param {ContextoCorrelativo|undefined} contexto Contexto recibido.
 * @returns {boolean} true si el contexto cumple el contrato.
 */
function _correlativoValidarContexto(contexto) {
  if (contexto === undefined) {
    return true;
  }

  if (!esObjetoPlano(contexto)) {
    return false;
  }

  const claves = Object.keys(contexto);

  if (
    claves.length > 1 ||
    (claves.length === 1 && claves[0] !== 'idEjecucion')
  ) {
    return false;
  }

  return (
    claves.length === 0 ||
    esCadenaNoVacia(contexto.idEjecucion)
  );
}

/**
 * Lee el último correlativo reservado desde el almacén recibido.
 *
 * @param {GoogleAppsScript.Properties.Properties} propiedades Almacén interno
 *     de propiedades del script.
 * @returns {string|null} Representación persistida o ausencia explícita.
 */
function _correlativoObtenerValorPersistido(propiedades) {
  return propiedades.getProperty(CORRELATIVO_CLAVE_PERSISTENCIA);
}

/**
 * Valida la representación decimal canónica del último correlativo.
 *
 * La ausencia representa el estado inicial conceptual cero. Solo después de
 * validar completamente la cadena se realiza una conversión numérica explícita.
 *
 * @param {string|null} valorPersistido Valor obtenido del almacén.
 * @returns {{valido: boolean, valor: (number|null)}} Resultado interno.
 */
function _correlativoValidarValorPersistido(valorPersistido) {
  if (valorPersistido === null) {
    return { valido: true, valor: 0 };
  }

  if (
    typeof valorPersistido !== 'string' ||
    !/^(0|[1-9][0-9]*)$/.test(valorPersistido)
  ) {
    return { valido: false, valor: null };
  }

  const valor = Number(valorPersistido);

  if (!Number.isSafeInteger(valor) || valor < 0) {
    return { valido: false, valor: null };
  }

  return { valido: true, valor: valor };
}

/**
 * Calcula el siguiente correlativo sin superar el límite numérico seguro.
 *
 * @param {number} ultimoCorrelativo Último número validado.
 * @returns {number|null} Siguiente número o null si se alcanzó el límite.
 */
function _correlativoCalcularSiguiente(ultimoCorrelativo) {
  if (ultimoCorrelativo === Number.MAX_SAFE_INTEGER) {
    return null;
  }

  return ultimoCorrelativo + 1;
}

/**
 * Persiste y relee el correlativo para verificar la escritura.
 *
 * @param {GoogleAppsScript.Properties.Properties} propiedades Almacén interno.
 * @param {number} correlativo Correlativo seguro que se persistirá.
 * @returns {boolean} true si el valor releído coincide exactamente.
 */
function _correlativoPersistirValor(propiedades, correlativo) {
  const representacion = String(correlativo);

  propiedades.setProperty(
    CORRELATIVO_CLAVE_PERSISTENCIA,
    representacion
  );

  return (
    propiedades.getProperty(CORRELATIVO_CLAVE_PERSISTENCIA) ===
    representacion
  );
}

/**
 * Construye un resultado exitoso de reserva.
 *
 * @param {number} correlativo Correlativo reservado y verificado.
 * @returns {ResultadoCorrelativo} Resultado exitoso.
 */
function _correlativoConstruirResultadoExitoso(correlativo) {
  return {
    exito: true,
    datos: {
      correlativo: correlativo
    },
    error: null
  };
}

/**
 * Construye un resultado fallido con información controlada.
 *
 * @param {string} codigo Código técnico aprobado.
 * @param {string} mensaje Mensaje público controlado.
 * @returns {ResultadoCorrelativo} Resultado fallido.
 */
function _correlativoConstruirResultadoError(codigo, mensaje) {
  return {
    exito: false,
    datos: null,
    error: {
      codigo: codigo,
      mensaje: mensaje
    }
  };
}

/**
 * Registra el resultado después de finalizar la sección crítica.
 *
 * Absorbe cualquier fallo del sistema de registro para conservar el resultado
 * funcional y evitar una segunda reserva.
 *
 * @param {ResultadoCorrelativo} resultado Resultado funcional determinado.
 * @param {ContextoCorrelativo|undefined} contexto Contexto seguro.
 * @returns {void}
 */
function _correlativoRegistrarResultado(resultado, contexto) {
  try {
    const idEjecucion =
      contexto === undefined ? undefined : contexto.idEjecucion;

    if (resultado.exito) {
      const contextoExito = {
        datos: {
          resultado: 'reservado',
          correlativo: resultado.datos.correlativo
        }
      };

      if (idEjecucion !== undefined) {
        contextoExito.idEjecucion = idEjecucion;
      }

      registrarInfo(
        'Correlativo',
        'reservarSiguienteCorrelativo',
        'El correlativo fue reservado correctamente.',
        contextoExito
      );
      return;
    }

    const esAdvertencia =
      resultado.error.codigo ===
        CORRELATIVO_CODIGOS_ERROR.PARAMETRO_INVALIDO ||
      resultado.error.codigo ===
        CORRELATIVO_CODIGOS_ERROR.BLOQUEO_NO_DISPONIBLE;
    const contextoError = {
      datos: {
        causa:
          CORRELATIVO_CAUSAS_REGISTRO[resultado.error.codigo] ||
          'error_interno'
      }
    };

    if (
      resultado.error.codigo ===
      CORRELATIVO_CODIGOS_ERROR.BLOQUEO_NO_DISPONIBLE
    ) {
      contextoError.datos.bloqueoObtenido = false;
    }

    if (idEjecucion !== undefined) {
      contextoError.idEjecucion = idEjecucion;
    }

    if (esAdvertencia) {
      registrarAdvertencia(
        'Correlativo',
        'reservarSiguienteCorrelativo',
        resultado.error.mensaje,
        contextoError
      );
    } else {
      registrarError(
        'Correlativo',
        'reservarSiguienteCorrelativo',
        resultado.error.mensaje,
        contextoError
      );
    }
  } catch (errorRegistro) {
    // Un fallo de auditoría no modifica ni repite la reserva.
  }
}
