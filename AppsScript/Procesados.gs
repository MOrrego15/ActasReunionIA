/**
 * Módulo: Procesados
 *
 * Responsabilidad principal:
 * Mantener el estado persistente de procesamiento de cada documento fuente y
 * garantizar su reclamación idempotente mediante una hoja de cálculo.
 *
 * Responsabilidades excluidas:
 * - No selecciona ni enumera documentos.
 * - No genera correlativos, documentos ni entregables.
 * - No invoca OpenAI, Gemini ni otros módulos funcionales.
 * - No crea ni repara el repositorio persistente.
 * - No registra contenido sensible.
 *
 * Dependencias previstas:
 * - SpreadsheetApp y LockService.
 * - Funciones públicas aprobadas de Logger.gs y Utils.gs.
 */

const PROCESADOS_NOMBRE_HOJA = 'Procesados';
const PROCESADOS_VERSION_ESQUEMA = 1;
const PROCESADOS_TIEMPO_ESPERA_BLOQUEO_MS = 10000;

const PROCESADOS_COLUMNAS = Object.freeze([
  'versionEsquema',
  'idDocumentoFuente',
  'estado',
  'correlativo',
  'idEjecucion',
  'fechaInicio',
  'fechaActualizacion',
  'idDocumentoGoogle',
  'idArchivoDocx',
  'codigoError'
]);

const PROCESADOS_ESTADOS = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  PROCESADO: 'PROCESADO',
  ERROR: 'ERROR'
});

const PROCESADOS_CODIGOS_ERROR = Object.freeze({
  PARAMETRO_INVALIDO: 'PROCESADOS_PARAMETRO_INVALIDO',
  BLOQUEO_NO_DISPONIBLE: 'PROCESADOS_BLOQUEO_NO_DISPONIBLE',
  REPOSITORIO_NO_DISPONIBLE:
    'PROCESADOS_REPOSITORIO_NO_DISPONIBLE',
  ESQUEMA_INVALIDO: 'PROCESADOS_ESQUEMA_INVALIDO',
  REGISTRO_NO_ENCONTRADO: 'PROCESADOS_REGISTRO_NO_ENCONTRADO',
  DOCUMENTO_EN_PROCESO: 'PROCESADOS_DOCUMENTO_EN_PROCESO',
  DOCUMENTO_YA_PROCESADO: 'PROCESADOS_DOCUMENTO_YA_PROCESADO',
  CORRELATIVO_YA_UTILIZADO: 'PROCESADOS_CORRELATIVO_YA_UTILIZADO',
  ESTADO_INVALIDO: 'PROCESADOS_ESTADO_INVALIDO',
  EJECUCION_NO_COINCIDE: 'PROCESADOS_EJECUCION_NO_COINCIDE',
  REGISTRO_DUPLICADO: 'PROCESADOS_REGISTRO_DUPLICADO',
  REGISTRO_CORRUPTO: 'PROCESADOS_REGISTRO_CORRUPTO',
  PERSISTENCIA_ERROR: 'PROCESADOS_PERSISTENCIA_ERROR',
  ERROR: 'PROCESADOS_ERROR'
});

const PROCESADOS_MENSAJES_ERROR = Object.freeze({
  PARAMETRO_INVALIDO:
    'Los parámetros de la operación no son válidos.',
  BLOQUEO_NO_DISPONIBLE:
    'No fue posible obtener el bloqueo para actualizar el procesamiento.',
  REPOSITORIO_NO_DISPONIBLE:
    'El repositorio de procesados no está disponible.',
  ESQUEMA_INVALIDO:
    'El esquema del repositorio de procesados no es válido.',
  REGISTRO_NO_ENCONTRADO:
    'No existe un registro de procesamiento para el documento.',
  DOCUMENTO_EN_PROCESO:
    'El documento ya se encuentra en proceso.',
  DOCUMENTO_YA_PROCESADO:
    'El documento ya fue procesado.',
  CORRELATIVO_YA_UTILIZADO:
    'El número de secuencia ya fue utilizado por otra acta.',
  ESTADO_INVALIDO:
    'La transición de estado solicitada no es válida.',
  EJECUCION_NO_COINCIDE:
    'La ejecución no coincide con el registro de procesamiento.',
  REGISTRO_DUPLICADO:
    'Existen registros duplicados para el documento.',
  REGISTRO_CORRUPTO:
    'El registro persistido no cumple el esquema aprobado.',
  PERSISTENCIA_ERROR:
    'No fue posible persistir el estado de procesamiento.',
  ERROR:
    'No fue posible completar la operación de procesamiento.'
});

const PROCESADOS_CAUSAS_REGISTRO = Object.freeze({
  PROCESADOS_PARAMETRO_INVALIDO: 'parametro_invalido',
  PROCESADOS_BLOQUEO_NO_DISPONIBLE: 'sin_bloqueo',
  PROCESADOS_REPOSITORIO_NO_DISPONIBLE: 'repositorio',
  PROCESADOS_ESQUEMA_INVALIDO: 'esquema',
  PROCESADOS_REGISTRO_NO_ENCONTRADO: 'sin_registro',
  PROCESADOS_DOCUMENTO_EN_PROCESO: 'en_proceso',
  PROCESADOS_DOCUMENTO_YA_PROCESADO: 'ya_procesado',
  PROCESADOS_CORRELATIVO_YA_UTILIZADO: 'correlativo_utilizado',
  PROCESADOS_ESTADO_INVALIDO: 'estado',
  PROCESADOS_EJECUCION_NO_COINCIDE: 'ejecucion',
  PROCESADOS_REGISTRO_DUPLICADO: 'duplicado',
  PROCESADOS_REGISTRO_CORRUPTO: 'registro_corrupto',
  PROCESADOS_PERSISTENCIA_ERROR: 'persistencia',
  PROCESADOS_ERROR: 'error_interno'
});

/**
 * @typedef {Object} ContextoProcesados
 * @property {string=} idEjecucion Identificador técnico opcional.
 */

/**
 * @typedef {Object} DatosInicioProcesamiento
 * @property {string} idDocumentoFuente Identificador estable de la fuente.
 * @property {number} correlativo Correlativo previamente reservado.
 */

/**
 * @typedef {Object} DatosFinalizacionProcesamiento
 * @property {string} idDocumentoFuente Identificador estable de la fuente.
 * @property {number} correlativo Correlativo previamente reservado.
 * @property {string} idDocumentoGoogle Identificador del acta en Google Docs.
 * @property {string} idArchivoDocx Identificador del entregable verificado.
 */

/**
 * @typedef {Object} DatosErrorProcesamiento
 * @property {string} idDocumentoFuente Identificador estable de la fuente.
 * @property {number} correlativo Correlativo previamente reservado.
 * @property {string} codigoError Código técnico controlado.
 * @property {string=} idDocumentoGoogle Identificador parcial opcional.
 * @property {string=} idArchivoDocx Identificador parcial opcional.
 */

/**
 * @typedef {Object} DatosEstadoProcesamiento
 * @property {string} estado Estado vigente o derivado.
 * @property {number|null} correlativo Correlativo asociado o null.
 */

/**
 * @typedef {Object} ErrorProcesadosControlado
 * @property {string} codigo Código técnico con prefijo PROCESADOS_.
 * @property {string} mensaje Mensaje público controlado.
 */

/**
 * @typedef {Object} ResultadoProcesados
 * @property {boolean} exito Indica si la operación finalizó correctamente.
 * @property {DatosEstadoProcesamiento|null} datos Estado resultante o null.
 * @property {ErrorProcesadosControlado|null} error Error controlado o null.
 */

/**
 * Consulta el estado vigente de un documento fuente.
 *
 * La consulta es informativa: una reclamación posterior vuelve a comprobar el
 * estado bajo bloqueo. No modifica argumentos, no devuelve IDs ni objetos
 * nativos de Sheets y no propaga excepciones.
 *
 * @param {string} repositorioProcesadosId ID de la hoja de cálculo dedicada.
 * @param {string} idDocumentoFuente ID estable del documento fuente.
 * @param {ContextoProcesados=} contexto Contexto técnico opcional.
 * @returns {ResultadoProcesados} Estado vigente o error controlado.
 */
function consultarEstadoProcesamiento(
  repositorioProcesadosId,
  idDocumentoFuente,
  contexto
) {
  const operacion = 'consultarEstadoProcesamiento';

  if (
    !_procesadosValidarIdentificador(repositorioProcesadosId) ||
    !_procesadosValidarIdentificador(idDocumentoFuente) ||
    !_procesadosValidarContexto(contexto, false)
  ) {
    const resultadoInvalido = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );

    _procesadosRegistrarResultado(operacion, resultadoInvalido, undefined);
    return resultadoInvalido;
  }

  const contextoRegistro = _procesadosObtenerContextoRegistro(contexto);
  let resultado;

  try {
    const acceso = _procesadosPrepararRepositorio(
      repositorioProcesadosId
    );

    if (!acceso.exito) {
      resultado = _procesadosConstruirResultadoError(
        acceso.codigo,
        acceso.mensaje
      );
    } else {
      const consulta = _procesadosBuscarRegistro(
        acceso.hoja,
        idDocumentoFuente
      );

      resultado = consulta.exito
        ? consulta.registro === null
          ? _procesadosConstruirResultadoExitoso(
              PROCESADOS_ESTADOS.PENDIENTE,
              null
            )
          : _procesadosConstruirResultadoExitoso(
              consulta.registro.estado,
              consulta.registro.correlativo
            )
        : _procesadosConstruirResultadoError(
            consulta.codigo,
            consulta.mensaje
          );
    }
  } catch (errorInterno) {
    resultado = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ERROR,
      PROCESADOS_MENSAJES_ERROR.ERROR
    );
  }

  _procesadosRegistrarResultado(operacion, resultado, contextoRegistro);
  return resultado;
}

/**
 * Checks whether a source ID and sequence number are both unused.
 *
 * @param {string} repositorioProcesadosId Tracking spreadsheet ID.
 * @param {string} idDocumentoFuente Selected source document ID.
 * @param {number} correlativo Proposed act sequence number.
 * @param {ContextoProcesados=} contexto Optional technical context.
 * @returns {ResultadoProcesados} Availability or controlled duplicate error.
 */
function consultarDisponibilidadGeneracion(
  repositorioProcesadosId,
  idDocumentoFuente,
  correlativo,
  contexto
) {
  const operacion = 'consultarDisponibilidadGeneracion';
  if (
    !_procesadosValidarIdentificador(repositorioProcesadosId) ||
    !_procesadosValidarIdentificador(idDocumentoFuente) ||
    !_procesadosValidarCorrelativo(correlativo) ||
    !_procesadosValidarContexto(contexto, false)
  ) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );
  }

  let resultado;
  try {
    const acceso = _procesadosPrepararRepositorio(repositorioProcesadosId);
    resultado = acceso.exito
      ? _procesadosComprobarDisponibilidad(
          acceso.hoja, idDocumentoFuente, correlativo
        )
      : _procesadosConstruirResultadoError(acceso.codigo, acceso.mensaje);
  } catch (errorInterno) {
    resultado = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ERROR,
      PROCESADOS_MENSAJES_ERROR.ERROR
    );
  }
  _procesadosRegistrarResultado(
    operacion, resultado, _procesadosObtenerContextoRegistro(contexto)
  );
  return resultado;
}

/** Returns the first unused sequence at or above the configured candidate. */
function proponerCorrelativoGeneracion(
  repositorioProcesadosId,
  idDocumentoFuente,
  correlativoInicial,
  contexto
) {
  if (!_procesadosValidarIdentificador(repositorioProcesadosId) ||
    !_procesadosValidarIdentificador(idDocumentoFuente) ||
    !_procesadosValidarCorrelativo(correlativoInicial) ||
    !_procesadosValidarContexto(contexto, false)) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );
  }
  try {
    const acceso = _procesadosPrepararRepositorio(repositorioProcesadosId);
    if (!acceso.exito) {
      return _procesadosConstruirResultadoError(acceso.codigo, acceso.mensaje);
    }
    const fuente = _procesadosBuscarRegistro(acceso.hoja, idDocumentoFuente);
    if (!fuente.exito) {
      return _procesadosConstruirResultadoError(fuente.codigo, fuente.mensaje);
    }
    if (fuente.registro !== null) {
      return _procesadosConstruirResultadoError(
        PROCESADOS_CODIGOS_ERROR.DOCUMENTO_YA_PROCESADO,
        'La reunión seleccionada ya generó el acta correspondiente.'
      );
    }
    const listado = _procesadosListarCorrelativos(acceso.hoja);
    if (!listado.exito) {
      return _procesadosConstruirResultadoError(
        listado.codigo, listado.mensaje
      );
    }
    let candidato = correlativoInicial;
    while (candidato <= 999999 && listado.correlativos[candidato] === true) {
      candidato += 1;
    }
    return candidato <= 999999
      ? _procesadosConstruirResultadoExitoso(
          PROCESADOS_ESTADOS.PENDIENTE, candidato
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.CORRELATIVO_YA_UTILIZADO,
          'No existe un número de secuencia disponible.'
        );
  } catch (errorInterno) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ERROR,
      PROCESADOS_MENSAJES_ERROR.ERROR
    );
  }
}

function proponerCorrelativoDisponible(
  repositorioProcesadosId,
  correlativoInicial,
  contexto
) {
  if (!_procesadosValidarIdentificador(repositorioProcesadosId) ||
    !_procesadosValidarCorrelativo(correlativoInicial) ||
    !_procesadosValidarContexto(contexto, false)) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );
  }
  try {
    const acceso = _procesadosPrepararRepositorio(repositorioProcesadosId);
    if (!acceso.exito) {
      return _procesadosConstruirResultadoError(acceso.codigo, acceso.mensaje);
    }
    const listado = _procesadosListarCorrelativos(acceso.hoja);
    if (!listado.exito) {
      return _procesadosConstruirResultadoError(
        listado.codigo, listado.mensaje
      );
    }
    let candidato = correlativoInicial;
    while (candidato <= 999999 && listado.correlativos[candidato] === true) {
      candidato += 1;
    }
    return candidato <= 999999
      ? _procesadosConstruirResultadoExitoso(
          PROCESADOS_ESTADOS.PENDIENTE, candidato
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.CORRELATIVO_YA_UTILIZADO,
          'No existe un número de secuencia disponible.'
        );
  } catch (errorInterno) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ERROR,
      PROCESADOS_MENSAJES_ERROR.ERROR
    );
  }
}

/** Atomically claims one source and sequence for an execution. */
function registrarInicioProcesamiento(
  repositorioProcesadosId,
  datosInicioProcesamiento,
  contexto
) {
  const operacion = 'registrarInicioProcesamiento';

  if (
    !_procesadosValidarIdentificador(repositorioProcesadosId) ||
    !_procesadosValidarDatosInicio(datosInicioProcesamiento) ||
    !_procesadosValidarContexto(contexto, true)
  ) {
    const resultadoInvalido = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );

    _procesadosRegistrarResultado(operacion, resultadoInvalido, undefined);
    return resultadoInvalido;
  }

  return _procesadosEjecutarMutacion(
    operacion,
    contexto,
    function () {
      return _procesadosRegistrarInicioInterno(
        repositorioProcesadosId,
        datosInicioProcesamiento,
        contexto.idEjecucion
      );
    }
  );
}

/**
 * Marca como procesado un documento cuyo archivo DOCX ya fue verificado.
 *
 * La transición válida es EN_PROCESO a PROCESADO. Una repetición exacta sobre
 * PROCESADO es idempotente. La función no verifica directamente los artefactos
 * y no propaga excepciones.
 *
 * @param {string} repositorioProcesadosId ID de la hoja de cálculo dedicada.
 * @param {DatosFinalizacionProcesamiento} datosFinalizacionProcesamiento
 *     Datos finales previamente verificados.
 * @param {ContextoProcesados} contexto Contexto con idEjecucion obligatorio.
 * @returns {ResultadoProcesados} Estado resultante o error controlado.
 */
function marcarProcesamientoCompletado(
  repositorioProcesadosId,
  datosFinalizacionProcesamiento,
  contexto
) {
  const operacion = 'marcarProcesamientoCompletado';

  if (
    !_procesadosValidarIdentificador(repositorioProcesadosId) ||
    !_procesadosValidarDatosFinalizacion(
      datosFinalizacionProcesamiento
    ) ||
    !_procesadosValidarContexto(contexto, true)
  ) {
    const resultadoInvalido = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );

    _procesadosRegistrarResultado(operacion, resultadoInvalido, undefined);
    return resultadoInvalido;
  }

  return _procesadosEjecutarMutacion(
    operacion,
    contexto,
    function () {
      return _procesadosCompletarInterno(
        repositorioProcesadosId,
        datosFinalizacionProcesamiento,
        contexto.idEjecucion
      );
    }
  );
}

/**
 * Registra el fallo controlado de un documento reclamado.
 *
 * La transición válida es EN_PROCESO a ERROR. Una repetición exacta sobre
 * ERROR es idempotente. Los IDs parciales son opcionales y nunca se registran
 * en Logger.
 *
 * @param {string} repositorioProcesadosId ID de la hoja de cálculo dedicada.
 * @param {DatosErrorProcesamiento} datosErrorProcesamiento Datos del fallo.
 * @param {ContextoProcesados} contexto Contexto con idEjecucion obligatorio.
 * @returns {ResultadoProcesados} Estado resultante o error controlado.
 */
function marcarProcesamientoConError(
  repositorioProcesadosId,
  datosErrorProcesamiento,
  contexto
) {
  const operacion = 'marcarProcesamientoConError';

  if (
    !_procesadosValidarIdentificador(repositorioProcesadosId) ||
    !_procesadosValidarDatosError(datosErrorProcesamiento) ||
    !_procesadosValidarContexto(contexto, true)
  ) {
    const resultadoInvalido = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.PARAMETRO_INVALIDO
    );

    _procesadosRegistrarResultado(operacion, resultadoInvalido, undefined);
    return resultadoInvalido;
  }

  return _procesadosEjecutarMutacion(
    operacion,
    contexto,
    function () {
      return _procesadosMarcarErrorInterno(
        repositorioProcesadosId,
        datosErrorProcesamiento,
        contexto.idEjecucion
      );
    }
  );
}

/**
 * Valida un identificador técnico sin transformarlo.
 *
 * @param {string} valor Valor recibido.
 * @returns {boolean} true si es una cadena no vacía.
 */
function _procesadosValidarIdentificador(valor) {
  return esCadenaNoVacia(valor);
}

/**
 * Valida el contexto y sus únicas propiedades autorizadas.
 *
 * @param {ContextoProcesados|undefined} contexto Contexto recibido.
 * @param {boolean} obligatorio Indica si idEjecucion es obligatorio.
 * @returns {boolean} true si el contexto cumple el contrato.
 */
function _procesadosValidarContexto(contexto, obligatorio) {
  if (contexto === undefined) {
    return !obligatorio;
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

  if (claves.length === 0) {
    return !obligatorio;
  }

  return esCadenaNoVacia(contexto.idEjecucion);
}

/**
 * Conserva únicamente el identificador de ejecución ya validado.
 *
 * @param {ContextoProcesados|undefined} contexto Contexto validado.
 * @returns {ContextoProcesados|undefined} Copia segura para Logger.
 */
function _procesadosObtenerContextoRegistro(contexto) {
  return contexto !== undefined &&
    Object.prototype.hasOwnProperty.call(contexto, 'idEjecucion')
    ? { idEjecucion: contexto.idEjecucion }
    : undefined;
}

/**
 * Valida que un objeto contenga exactamente las propiedades autorizadas.
 *
 * @param {Object} valor Objeto plano previamente comprobado.
 * @param {string[]} obligatorias Propiedades obligatorias.
 * @param {string[]} opcionales Propiedades opcionales.
 * @returns {boolean} true si las claves coinciden con el contrato.
 */
function _procesadosValidarClaves(valor, obligatorias, opcionales) {
  const claves = Object.keys(valor);
  const permitidas = obligatorias.concat(opcionales);

  if (
    obligatorias.some(function (clave) {
      return !Object.prototype.hasOwnProperty.call(valor, clave);
    })
  ) {
    return false;
  }

  return claves.every(function (clave) {
    return permitidas.includes(clave);
  });
}

/**
 * Valida un correlativo entero, positivo y seguro.
 *
 * @param {number} correlativo Valor recibido.
 * @returns {boolean} true si cumple el contrato.
 */
function _procesadosValidarCorrelativo(correlativo) {
  return (
    esNumeroFinito(correlativo) &&
    Number.isSafeInteger(correlativo) &&
    correlativo > 0
  );
}

/**
 * Valida los datos autorizados para reclamar una fuente.
 *
 * @param {DatosInicioProcesamiento} datos Datos recibidos.
 * @returns {boolean} true si cumplen el contrato.
 */
function _procesadosValidarDatosInicio(datos) {
  return (
    esObjetoPlano(datos) &&
    _procesadosValidarClaves(
      datos,
      ['idDocumentoFuente', 'correlativo'],
      []
    ) &&
    _procesadosValidarIdentificador(datos.idDocumentoFuente) &&
    _procesadosValidarCorrelativo(datos.correlativo)
  );
}

/**
 * Valida los datos autorizados para completar una fuente.
 *
 * @param {DatosFinalizacionProcesamiento} datos Datos recibidos.
 * @returns {boolean} true si cumplen el contrato.
 */
function _procesadosValidarDatosFinalizacion(datos) {
  return (
    esObjetoPlano(datos) &&
    _procesadosValidarClaves(
      datos,
      [
        'idDocumentoFuente',
        'correlativo',
        'idDocumentoGoogle',
        'idArchivoDocx'
      ],
      []
    ) &&
    _procesadosValidarIdentificador(datos.idDocumentoFuente) &&
    _procesadosValidarCorrelativo(datos.correlativo) &&
    _procesadosValidarIdentificador(datos.idDocumentoGoogle) &&
    _procesadosValidarIdentificador(datos.idArchivoDocx)
  );
}

/**
 * Valida los datos autorizados para registrar un error.
 *
 * @param {DatosErrorProcesamiento} datos Datos recibidos.
 * @returns {boolean} true si cumplen el contrato.
 */
function _procesadosValidarDatosError(datos) {
  if (
    !esObjetoPlano(datos) ||
    !_procesadosValidarClaves(
      datos,
      ['idDocumentoFuente', 'correlativo', 'codigoError'],
      ['idDocumentoGoogle', 'idArchivoDocx']
    ) ||
    !_procesadosValidarIdentificador(datos.idDocumentoFuente) ||
    !_procesadosValidarCorrelativo(datos.correlativo) ||
    !esCadenaNoVacia(datos.codigoError)
  ) {
    return false;
  }

  return (
    (!Object.prototype.hasOwnProperty.call(datos, 'idDocumentoGoogle') ||
      _procesadosValidarIdentificador(datos.idDocumentoGoogle)) &&
    (!Object.prototype.hasOwnProperty.call(datos, 'idArchivoDocx') ||
      _procesadosValidarIdentificador(datos.idArchivoDocx))
  );
}

/**
 * Abre la hoja existente y valida el esquema aprobado.
 *
 * @param {string} repositorioProcesadosId ID validado del Spreadsheet.
 * @returns {Object} Resultado interno con Sheet o error controlado.
 */
function _procesadosPrepararRepositorio(repositorioProcesadosId) {
  let hoja;

  try {
    const repositorio = SpreadsheetApp.openById(
      repositorioProcesadosId
    );
    hoja = repositorio.getSheetByName(PROCESADOS_NOMBRE_HOJA);

    if (hoja === null) {
      return {
        exito: false,
        hoja: null,
        codigo:
          PROCESADOS_CODIGOS_ERROR.REPOSITORIO_NO_DISPONIBLE,
        mensaje:
          PROCESADOS_MENSAJES_ERROR.REPOSITORIO_NO_DISPONIBLE
      };
    }
  } catch (errorRepositorio) {
    return {
      exito: false,
      hoja: null,
      codigo: PROCESADOS_CODIGOS_ERROR.REPOSITORIO_NO_DISPONIBLE,
      mensaje: PROCESADOS_MENSAJES_ERROR.REPOSITORIO_NO_DISPONIBLE
    };
  }

  try {
    if (!_procesadosValidarEsquema(hoja)) {
      return {
        exito: false,
        hoja: null,
        codigo: PROCESADOS_CODIGOS_ERROR.ESQUEMA_INVALIDO,
        mensaje: PROCESADOS_MENSAJES_ERROR.ESQUEMA_INVALIDO
      };
    }
  } catch (errorEsquema) {
    return {
      exito: false,
      hoja: null,
      codigo: PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      mensaje: PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
    };
  }

  return {
    exito: true,
    hoja: hoja,
    codigo: null,
    mensaje: null
  };
}

/**
 * Verifica cantidad, orden y nombres exactos de las columnas.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} hoja Hoja interna.
 * @returns {boolean} true si el esquema coincide exactamente.
 */
function _procesadosValidarEsquema(hoja) {
  if (
    hoja.getLastRow() < 1 ||
    hoja.getLastColumn() !== PROCESADOS_COLUMNAS.length
  ) {
    return false;
  }

  const encabezados = hoja
    .getRange(1, 1, 1, PROCESADOS_COLUMNAS.length)
    .getValues()[0];

  return PROCESADOS_COLUMNAS.every(function (columna, indice) {
    return encabezados[indice] === columna;
  });
}

/**
 * Busca todas las coincidencias exactas y valida la fila encontrada.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} hoja Hoja validada.
 * @param {string} idDocumentoFuente ID exacto de la fuente.
 * @returns {Object} Consulta interna controlada.
 */
function _procesadosBuscarRegistro(hoja, idDocumentoFuente) {
  let filas;

  try {
    const ultimaFila = hoja.getLastRow();

    filas =
      ultimaFila <= 1
        ? []
        : hoja
            .getRange(
              2,
              1,
              ultimaFila - 1,
              PROCESADOS_COLUMNAS.length
            )
            .getValues();
  } catch (errorLectura) {
    return {
      exito: false,
      registro: null,
      numeroFila: null,
      codigo: PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      mensaje: PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
    };
  }

  const coincidencias = [];

  filas.forEach(function (fila, indice) {
    if (fila[1] === idDocumentoFuente) {
      coincidencias.push({
        fila: fila,
        numeroFila: indice + 2
      });
    }
  });

  if (coincidencias.length > 1) {
    return {
      exito: false,
      registro: null,
      numeroFila: null,
      codigo: PROCESADOS_CODIGOS_ERROR.REGISTRO_DUPLICADO,
      mensaje: PROCESADOS_MENSAJES_ERROR.REGISTRO_DUPLICADO
    };
  }

  if (coincidencias.length === 0) {
    return {
      exito: true,
      registro: null,
      numeroFila: null,
      codigo: null,
      mensaje: null
    };
  }

  const registro = _procesadosConstruirRegistroDesdeFila(
    coincidencias[0].fila
  );

  if (!_procesadosValidarRegistro(registro)) {
    return {
      exito: false,
      registro: null,
      numeroFila: null,
      codigo: PROCESADOS_CODIGOS_ERROR.REGISTRO_CORRUPTO,
      mensaje: PROCESADOS_MENSAJES_ERROR.REGISTRO_CORRUPTO
    };
  }

  return {
    exito: true,
    registro: registro,
    numeroFila: coincidencias[0].numeroFila,
    codigo: null,
    mensaje: null
  };
}

function _procesadosBuscarRegistroPorCorrelativo(hoja, correlativo) {
  let filas;
  try {
    const ultimaFila = hoja.getLastRow();
    filas = ultimaFila <= 1
      ? []
      : hoja.getRange(
          2, 1, ultimaFila - 1, PROCESADOS_COLUMNAS.length
        ).getValues();
  } catch (errorLectura) {
    return {
      exito: false, registro: null,
      codigo: PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      mensaje: PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
    };
  }
  const coincidencias = filas.filter(function (fila) {
    return fila[3] === correlativo;
  });
  if (coincidencias.length > 1) {
    return {
      exito: false, registro: null,
      codigo: PROCESADOS_CODIGOS_ERROR.REGISTRO_DUPLICADO,
      mensaje: PROCESADOS_MENSAJES_ERROR.REGISTRO_DUPLICADO
    };
  }
  if (coincidencias.length === 0) {
    return { exito: true, registro: null, codigo: null, mensaje: null };
  }
  const registro = _procesadosConstruirRegistroDesdeFila(coincidencias[0]);
  return _procesadosValidarRegistro(registro)
    ? { exito: true, registro: registro, codigo: null, mensaje: null }
    : {
        exito: false, registro: null,
        codigo: PROCESADOS_CODIGOS_ERROR.REGISTRO_CORRUPTO,
        mensaje: PROCESADOS_MENSAJES_ERROR.REGISTRO_CORRUPTO
      };
}

function _procesadosListarCorrelativos(hoja) {
  try {
    const ultimaFila = hoja.getLastRow();
    const filas = ultimaFila <= 1
      ? []
      : hoja.getRange(
          2, 1, ultimaFila - 1, PROCESADOS_COLUMNAS.length
        ).getValues();
    const correlativos = {};
    for (let indice = 0; indice < filas.length; indice += 1) {
      const registro = _procesadosConstruirRegistroDesdeFila(filas[indice]);
      if (!_procesadosValidarRegistro(registro) ||
        correlativos[registro.correlativo] === true) {
        return {
          exito: false, correlativos: null,
          codigo: PROCESADOS_CODIGOS_ERROR.REGISTRO_CORRUPTO,
          mensaje: PROCESADOS_MENSAJES_ERROR.REGISTRO_CORRUPTO
        };
      }
      correlativos[registro.correlativo] = true;
    }
    return {
      exito: true, correlativos: correlativos,
      codigo: null, mensaje: null
    };
  } catch (errorLectura) {
    return {
      exito: false, correlativos: null,
      codigo: PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      mensaje: PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
    };
  }
}

function _procesadosComprobarDisponibilidad(
  hoja,
  idDocumentoFuente,
  correlativo
) {
  const fuente = _procesadosBuscarRegistro(hoja, idDocumentoFuente);
  if (!fuente.exito) {
    return _procesadosConstruirResultadoError(fuente.codigo, fuente.mensaje);
  }
  if (fuente.registro !== null) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.DOCUMENTO_YA_PROCESADO,
      'La reunión seleccionada ya generó el acta correspondiente.'
    );
  }
  const secuencia = _procesadosBuscarRegistroPorCorrelativo(
    hoja, correlativo
  );
  if (!secuencia.exito) {
    return _procesadosConstruirResultadoError(
      secuencia.codigo, secuencia.mensaje
    );
  }
  return secuencia.registro === null
    ? _procesadosConstruirResultadoExitoso(
        PROCESADOS_ESTADOS.PENDIENTE, null
      )
    : _procesadosConstruirResultadoError(
        PROCESADOS_CODIGOS_ERROR.CORRELATIVO_YA_UTILIZADO,
        PROCESADOS_MENSAJES_ERROR.CORRELATIVO_YA_UTILIZADO
      );
}

/**
 * Convierte una fila de diez columnas a un registro interno.
 *
 * @param {Array} fila Valores persistidos.
 * @returns {Object} Registro interno.
 */
function _procesadosConstruirRegistroDesdeFila(fila) {
  return {
    versionEsquema: fila[0],
    idDocumentoFuente: fila[1],
    estado: fila[2],
    correlativo: fila[3],
    idEjecucion: fila[4],
    fechaInicio: fila[5],
    fechaActualizacion: fila[6],
    idDocumentoGoogle: fila[7],
    idArchivoDocx: fila[8],
    codigoError: fila[9]
  };
}

/**
 * Valida un registro persistido y sus invariantes por estado.
 *
 * @param {Object} registro Registro interno.
 * @returns {boolean} true si el registro cumple el esquema aprobado.
 */
function _procesadosValidarRegistro(registro) {
  if (
    registro.versionEsquema !== PROCESADOS_VERSION_ESQUEMA ||
    !_procesadosValidarIdentificador(registro.idDocumentoFuente) ||
    ![
      PROCESADOS_ESTADOS.EN_PROCESO,
      PROCESADOS_ESTADOS.PROCESADO,
      PROCESADOS_ESTADOS.ERROR
    ].includes(registro.estado) ||
    !_procesadosValidarCorrelativo(registro.correlativo) ||
    !esCadenaNoVacia(registro.idEjecucion) ||
    !esCadenaNoVacia(registro.fechaInicio) ||
    !esCadenaNoVacia(registro.fechaActualizacion) ||
    typeof registro.idDocumentoGoogle !== 'string' ||
    typeof registro.idArchivoDocx !== 'string' ||
    typeof registro.codigoError !== 'string'
  ) {
    return false;
  }

  if (registro.estado === PROCESADOS_ESTADOS.EN_PROCESO) {
    return registro.codigoError === '';
  }

  if (registro.estado === PROCESADOS_ESTADOS.PROCESADO) {
    return (
      esCadenaNoVacia(registro.idDocumentoGoogle) &&
      esCadenaNoVacia(registro.idArchivoDocx) &&
      registro.codigoError === ''
    );
  }

  return esCadenaNoVacia(registro.codigoError);
}

/**
 * Ejecuta una transición bajo ScriptLock y registra después de liberarlo.
 *
 * @param {string} operacion Nombre de la operación pública.
 * @param {ContextoProcesados} contexto Contexto validado.
 * @param {Function} accion Transición interna sin operaciones externas.
 * @returns {ResultadoProcesados} Resultado funcional de la transición.
 */
function _procesadosEjecutarMutacion(operacion, contexto, accion) {
  const contextoRegistro = _procesadosObtenerContextoRegistro(contexto);
  let bloqueo;
  let bloqueoAdquirido = false;
  let resultado;

  try {
    bloqueo = LockService.getScriptLock();
    bloqueoAdquirido = bloqueo.tryLock(
      PROCESADOS_TIEMPO_ESPERA_BLOQUEO_MS
    );

    resultado = bloqueoAdquirido
      ? accion()
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.BLOQUEO_NO_DISPONIBLE,
          PROCESADOS_MENSAJES_ERROR.BLOQUEO_NO_DISPONIBLE
        );
  } catch (errorInterno) {
    resultado = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ERROR,
      PROCESADOS_MENSAJES_ERROR.ERROR
    );
  } finally {
    if (bloqueoAdquirido) {
      try {
        bloqueo.releaseLock();
      } catch (errorLiberacion) {
        // El resultado ya determinado no se sustituye por este fallo.
      }
    }
  }

  if (resultado === undefined) {
    resultado = _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ERROR,
      PROCESADOS_MENSAJES_ERROR.ERROR
    );
  }

  _procesadosRegistrarResultado(operacion, resultado, contextoRegistro);
  return resultado;
}

/**
 * Implementa la reclamación autoritativa de una fuente.
 *
 * @param {string} repositorioProcesadosId ID validado del repositorio.
 * @param {DatosInicioProcesamiento} datos Datos validados.
 * @param {string} idEjecucion Ejecución propietaria.
 * @returns {ResultadoProcesados} Resultado de la reclamación.
 */
function _procesadosRegistrarInicioInterno(
  repositorioProcesadosId,
  datos,
  idEjecucion
) {
  const acceso = _procesadosPrepararRepositorio(
    repositorioProcesadosId
  );

  if (!acceso.exito) {
    return _procesadosConstruirResultadoError(
      acceso.codigo,
      acceso.mensaje
    );
  }

  const consulta = _procesadosBuscarRegistro(
    acceso.hoja,
    datos.idDocumentoFuente
  );

  if (!consulta.exito) {
    return _procesadosConstruirResultadoError(
      consulta.codigo,
      consulta.mensaje
    );
  }

  if (consulta.registro !== null) {
    if (consulta.registro.estado === PROCESADOS_ESTADOS.EN_PROCESO) {
      return consulta.registro.correlativo === datos.correlativo &&
        consulta.registro.idEjecucion === idEjecucion
        ? _procesadosConstruirResultadoExitoso(
            PROCESADOS_ESTADOS.EN_PROCESO,
            datos.correlativo
          )
        : consulta.registro.idEjecucion !== idEjecucion
          ? _procesadosConstruirResultadoError(
              PROCESADOS_CODIGOS_ERROR.DOCUMENTO_EN_PROCESO,
              PROCESADOS_MENSAJES_ERROR.DOCUMENTO_EN_PROCESO
            )
          : _procesadosConstruirResultadoError(
              PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
              PROCESADOS_MENSAJES_ERROR.ESTADO_INVALIDO
            );
    }

    return consulta.registro.estado === PROCESADOS_ESTADOS.PROCESADO
      ? _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.DOCUMENTO_YA_PROCESADO,
          PROCESADOS_MENSAJES_ERROR.DOCUMENTO_YA_PROCESADO
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
          PROCESADOS_MENSAJES_ERROR.ESTADO_INVALIDO
        );
  }

  const disponibilidad = _procesadosComprobarDisponibilidad(
    acceso.hoja,
    datos.idDocumentoFuente,
    datos.correlativo
  );
  if (!disponibilidad.exito) {
    return disponibilidad;
  }

  const fecha = new Date().toISOString();
  const registro = {
    versionEsquema: PROCESADOS_VERSION_ESQUEMA,
    idDocumentoFuente: datos.idDocumentoFuente,
    estado: PROCESADOS_ESTADOS.EN_PROCESO,
    correlativo: datos.correlativo,
    idEjecucion: idEjecucion,
    fechaInicio: fecha,
    fechaActualizacion: fecha,
    idDocumentoGoogle: '',
    idArchivoDocx: '',
    codigoError: ''
  };

  try {
    const numeroFila = acceso.hoja.getLastRow() + 1;

    return _procesadosEscribirYVerificar(
      acceso.hoja,
      numeroFila,
      registro
    )
      ? _procesadosConstruirResultadoExitoso(
          PROCESADOS_ESTADOS.EN_PROCESO,
          datos.correlativo
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
          PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
        );
  } catch (errorPersistencia) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
    );
  }
}

/**
 * Implementa la transición autoritativa a PROCESADO.
 *
 * @param {string} repositorioProcesadosId ID validado del repositorio.
 * @param {DatosFinalizacionProcesamiento} datos Datos validados.
 * @param {string} idEjecucion Ejecución propietaria.
 * @returns {ResultadoProcesados} Resultado de la transición.
 */
function _procesadosCompletarInterno(
  repositorioProcesadosId,
  datos,
  idEjecucion
) {
  const acceso = _procesadosPrepararRepositorio(
    repositorioProcesadosId
  );

  if (!acceso.exito) {
    return _procesadosConstruirResultadoError(
      acceso.codigo,
      acceso.mensaje
    );
  }

  const consulta = _procesadosBuscarRegistro(
    acceso.hoja,
    datos.idDocumentoFuente
  );

  if (!consulta.exito) {
    return _procesadosConstruirResultadoError(
      consulta.codigo,
      consulta.mensaje
    );
  }

  if (consulta.registro === null) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.REGISTRO_NO_ENCONTRADO,
      PROCESADOS_MENSAJES_ERROR.REGISTRO_NO_ENCONTRADO
    );
  }

  const registroActual = consulta.registro;

  if (registroActual.idEjecucion !== idEjecucion) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.EJECUCION_NO_COINCIDE,
      PROCESADOS_MENSAJES_ERROR.EJECUCION_NO_COINCIDE
    );
  }

  if (registroActual.correlativo !== datos.correlativo) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.ESTADO_INVALIDO
    );
  }

  if (registroActual.estado === PROCESADOS_ESTADOS.PROCESADO) {
    return registroActual.idDocumentoGoogle === datos.idDocumentoGoogle &&
      registroActual.idArchivoDocx === datos.idArchivoDocx &&
      registroActual.codigoError === ''
      ? _procesadosConstruirResultadoExitoso(
          PROCESADOS_ESTADOS.PROCESADO,
          datos.correlativo
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
          PROCESADOS_MENSAJES_ERROR.ESTADO_INVALIDO
        );
  }

  if (registroActual.estado !== PROCESADOS_ESTADOS.EN_PROCESO) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.ESTADO_INVALIDO
    );
  }

  const registroActualizado = {
    versionEsquema: registroActual.versionEsquema,
    idDocumentoFuente: registroActual.idDocumentoFuente,
    estado: PROCESADOS_ESTADOS.PROCESADO,
    correlativo: registroActual.correlativo,
    idEjecucion: registroActual.idEjecucion,
    fechaInicio: registroActual.fechaInicio,
    fechaActualizacion: new Date().toISOString(),
    idDocumentoGoogle: datos.idDocumentoGoogle,
    idArchivoDocx: datos.idArchivoDocx,
    codigoError: ''
  };

  try {
    return _procesadosEscribirYVerificar(
      acceso.hoja,
      consulta.numeroFila,
      registroActualizado
    )
      ? _procesadosConstruirResultadoExitoso(
          PROCESADOS_ESTADOS.PROCESADO,
          datos.correlativo
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
          PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
        );
  } catch (errorPersistencia) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
    );
  }
}

/**
 * Implementa la transición autoritativa a ERROR.
 *
 * @param {string} repositorioProcesadosId ID validado del repositorio.
 * @param {DatosErrorProcesamiento} datos Datos validados.
 * @param {string} idEjecucion Ejecución propietaria.
 * @returns {ResultadoProcesados} Resultado de la transición.
 */
function _procesadosMarcarErrorInterno(
  repositorioProcesadosId,
  datos,
  idEjecucion
) {
  const acceso = _procesadosPrepararRepositorio(
    repositorioProcesadosId
  );

  if (!acceso.exito) {
    return _procesadosConstruirResultadoError(
      acceso.codigo,
      acceso.mensaje
    );
  }

  const consulta = _procesadosBuscarRegistro(
    acceso.hoja,
    datos.idDocumentoFuente
  );

  if (!consulta.exito) {
    return _procesadosConstruirResultadoError(
      consulta.codigo,
      consulta.mensaje
    );
  }

  if (consulta.registro === null) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.REGISTRO_NO_ENCONTRADO,
      PROCESADOS_MENSAJES_ERROR.REGISTRO_NO_ENCONTRADO
    );
  }

  const registroActual = consulta.registro;
  const idDocumentoGoogle =
    Object.prototype.hasOwnProperty.call(datos, 'idDocumentoGoogle')
      ? datos.idDocumentoGoogle
      : '';
  const idArchivoDocx =
    Object.prototype.hasOwnProperty.call(datos, 'idArchivoDocx')
      ? datos.idArchivoDocx
      : '';

  if (registroActual.idEjecucion !== idEjecucion) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.EJECUCION_NO_COINCIDE,
      PROCESADOS_MENSAJES_ERROR.EJECUCION_NO_COINCIDE
    );
  }

  if (registroActual.correlativo !== datos.correlativo) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
      PROCESADOS_MENSAJES_ERROR.ESTADO_INVALIDO
    );
  }

  if (registroActual.estado === PROCESADOS_ESTADOS.ERROR) {
    return registroActual.codigoError === datos.codigoError &&
      registroActual.idDocumentoGoogle === idDocumentoGoogle &&
      registroActual.idArchivoDocx === idArchivoDocx
      ? _procesadosConstruirResultadoExitoso(
          PROCESADOS_ESTADOS.ERROR,
          datos.correlativo
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
          PROCESADOS_MENSAJES_ERROR.ESTADO_INVALIDO
        );
  }

  if (registroActual.estado === PROCESADOS_ESTADOS.PROCESADO) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.DOCUMENTO_YA_PROCESADO,
      PROCESADOS_MENSAJES_ERROR.DOCUMENTO_YA_PROCESADO
    );
  }

  const registroActualizado = {
    versionEsquema: registroActual.versionEsquema,
    idDocumentoFuente: registroActual.idDocumentoFuente,
    estado: PROCESADOS_ESTADOS.ERROR,
    correlativo: registroActual.correlativo,
    idEjecucion: registroActual.idEjecucion,
    fechaInicio: registroActual.fechaInicio,
    fechaActualizacion: new Date().toISOString(),
    idDocumentoGoogle: idDocumentoGoogle,
    idArchivoDocx: idArchivoDocx,
    codigoError: datos.codigoError
  };

  try {
    return _procesadosEscribirYVerificar(
      acceso.hoja,
      consulta.numeroFila,
      registroActualizado
    )
      ? _procesadosConstruirResultadoExitoso(
          PROCESADOS_ESTADOS.ERROR,
          datos.correlativo
        )
      : _procesadosConstruirResultadoError(
          PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
          PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
        );
  } catch (errorPersistencia) {
    return _procesadosConstruirResultadoError(
      PROCESADOS_CODIGOS_ERROR.PERSISTENCIA_ERROR,
      PROCESADOS_MENSAJES_ERROR.PERSISTENCIA_ERROR
    );
  }
}

/**
 * Escribe una fila completa, la relee y verifica todos sus campos.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} hoja Hoja validada.
 * @param {number} numeroFila Número de fila que se escribirá.
 * @param {Object} registro Registro interno validado.
 * @returns {boolean} true si la relectura coincide y sigue siendo válida.
 */
function _procesadosEscribirYVerificar(hoja, numeroFila, registro) {
  const valoresEsperados = _procesadosConvertirRegistroAFila(registro);
  const rango = hoja.getRange(
    numeroFila,
    1,
    1,
    PROCESADOS_COLUMNAS.length
  );

  rango.setValues([valoresEsperados]);

  const valoresReleidos = hoja
    .getRange(
      numeroFila,
      1,
      1,
      PROCESADOS_COLUMNAS.length
    )
    .getValues()[0];
  const registroReleido =
    _procesadosConstruirRegistroDesdeFila(valoresReleidos);

  return (
    _procesadosValidarRegistro(registroReleido) &&
    valoresEsperados.every(function (valor, indice) {
      return valoresReleidos[indice] === valor;
    })
  );
}

/**
 * Convierte un registro interno al orden exacto de columnas.
 *
 * @param {Object} registro Registro interno.
 * @returns {Array} Diez valores listos para setValues.
 */
function _procesadosConvertirRegistroAFila(registro) {
  return [
    registro.versionEsquema,
    registro.idDocumentoFuente,
    registro.estado,
    registro.correlativo,
    registro.idEjecucion,
    registro.fechaInicio,
    registro.fechaActualizacion,
    registro.idDocumentoGoogle,
    registro.idArchivoDocx,
    registro.codigoError
  ];
}

/**
 * Construye un resultado exitoso con estado y correlativo.
 *
 * @param {string} estado Estado vigente o derivado.
 * @param {number|null} correlativo Correlativo asociado o null.
 * @returns {ResultadoProcesados} Resultado exitoso.
 */
function _procesadosConstruirResultadoExitoso(estado, correlativo) {
  return {
    exito: true,
    datos: {
      estado: estado,
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
 * @returns {ResultadoProcesados} Resultado fallido.
 */
function _procesadosConstruirResultadoError(codigo, mensaje) {
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
 * Registra un resultado técnico sin IDs ni objetos persistentes.
 *
 * @param {string} operacion Nombre de la operación pública.
 * @param {ResultadoProcesados} resultado Resultado funcional determinado.
 * @param {ContextoProcesados|undefined} contexto Contexto seguro.
 * @returns {void}
 */
function _procesadosRegistrarResultado(operacion, resultado, contexto) {
  try {
    const idEjecucion =
      contexto === undefined ? undefined : contexto.idEjecucion;
    let contextoLogger;

    if (resultado.exito) {
      contextoLogger = {
        datos: {
          resultado: 'correcto',
          estado: resultado.datos.estado
        }
      };

      if (resultado.datos.correlativo !== null) {
        contextoLogger.datos.correlativo =
          resultado.datos.correlativo;
      }

      if (idEjecucion !== undefined) {
        contextoLogger.idEjecucion = idEjecucion;
      }

      registrarInfo(
        'Procesados',
        operacion,
        'La operación de procesamiento finalizó correctamente.',
        contextoLogger
      );
      return;
    }

    contextoLogger = {
      datos: {
        causa:
          PROCESADOS_CAUSAS_REGISTRO[resultado.error.codigo] ||
          'error_interno'
      }
    };

    if (
      resultado.error.codigo ===
      PROCESADOS_CODIGOS_ERROR.BLOQUEO_NO_DISPONIBLE
    ) {
      contextoLogger.datos.bloqueoObtenido = false;
    }

    if (idEjecucion !== undefined) {
      contextoLogger.idEjecucion = idEjecucion;
    }

    if (_procesadosEsAdvertencia(resultado.error.codigo)) {
      registrarAdvertencia(
        'Procesados',
        operacion,
        resultado.error.mensaje,
        contextoLogger
      );
    } else {
      registrarError(
        'Procesados',
        operacion,
        resultado.error.mensaje,
        contextoLogger
      );
    }
  } catch (errorRegistro) {
    // Un fallo de Logger no modifica ni repite la transición persistida.
  }
}

/**
 * Determina si un código controlado debe registrarse como advertencia.
 *
 * @param {string} codigo Código de error aprobado.
 * @returns {boolean} true si corresponde a WARN.
 */
function _procesadosEsAdvertencia(codigo) {
  return [
    PROCESADOS_CODIGOS_ERROR.PARAMETRO_INVALIDO,
    PROCESADOS_CODIGOS_ERROR.BLOQUEO_NO_DISPONIBLE,
    PROCESADOS_CODIGOS_ERROR.REGISTRO_NO_ENCONTRADO,
    PROCESADOS_CODIGOS_ERROR.DOCUMENTO_EN_PROCESO,
    PROCESADOS_CODIGOS_ERROR.DOCUMENTO_YA_PROCESADO,
    PROCESADOS_CODIGOS_ERROR.ESTADO_INVALIDO,
    PROCESADOS_CODIGOS_ERROR.EJECUCION_NO_COINCIDE
  ].includes(codigo);
}
