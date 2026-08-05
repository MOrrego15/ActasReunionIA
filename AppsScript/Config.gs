/**
 * Módulo: Config
 *
 * Responsabilidad principal:
 * Centralizar la lectura y validación de la configuración del proceso desde
 * las propiedades del proyecto de Google Apps Script.
 *
 * Responsabilidades excluidas:
 * - No incrusta, persiste, registra, serializa ni muestra secretos.
 * - No contiene valores operativos incrustados.
 * - No ejecuta reglas de negocio ni coordina el flujo.
 *
 * Dependencias previstas:
 * - Servicio de propiedades de Google Apps Script.
 * - Logger, cuando se defina un contrato que garantice registros sanitizados.
 * - Utils, cuando existan validaciones técnicas realmente compartidas.
 */

/**
 * Obtiene la configuración validada para consumo interno de los módulos.
 *
 * La clave de OpenAI se mantiene exclusivamente en memoria durante la
 * ejecución. Queda prohibido registrar, serializar o incorporar el objeto
 * devuelto en respuestas, diagnósticos o auditorías.
 *
 * @return {Object} Configuración interna validada.
 * @throws {Error} Si una propiedad obligatoria falta o alguna propiedad
 *     presente no cumple las reglas de validación.
 */
function obtenerConfiguracion() {
  const propiedadesScript =
    PropertiesService.getScriptProperties().getProperties();
  return _configConstruir(propiedadesScript);
}

/**
 * Construye y valida el objeto interno de configuración.
 *
 * @param {Object<string, string>} propiedadesScript Propiedades del proyecto.
 * @return {Object} Configuración interna validada.
 * @throws {Error} Si se detectan propiedades faltantes o inválidas.
 * @private
 */
function _configConstruir(propiedadesScript) {
  const propiedadesInvalidas = [];

  const identificadorCarpetaNotas = _configLeerObligatoria(
    propiedadesScript,
    'CARPETA_NOTAS_GEMINI_ID',
    propiedadesInvalidas,
    false
  );
  const identificadorPlantilla = _configLeerObligatoria(
    propiedadesScript,
    'PLANTILLA_ACTA_ID',
    propiedadesInvalidas,
    false
  );
  const identificadorCarpetaOtros = _configLeerObligatoria(
    propiedadesScript,
    'CARPETA_OTRO',
    propiedadesInvalidas,
    false
  );
  const identificadorCarpetaRaizActas = _configLeerObligatoria(
    propiedadesScript,
    'CARPETA_RAIZ_ACTAS_ID',
    propiedadesInvalidas,
    false
  );
  const identificadorRepositorioProcesados = _configLeerObligatoria(
    propiedadesScript,
    'REPOSITORIO_PROCESADOS_ID',
    propiedadesInvalidas,
    false
  );
  const claveApiGemini = _configLeerOpcionalNoVacia(
    propiedadesScript,
    'GEMINI_API_KEY',
    propiedadesInvalidas
  );
  const modeloGemini = _configLeerOpcionalNoVacia(
    propiedadesScript,
    'GEMINI_MODELO',
    propiedadesInvalidas
  ) || 'gemini-2.0-flash';
  const claveApiOpenAI = _configLeerOpcionalNoVacia(
    propiedadesScript,
    'OPENAI_API_KEY',
    propiedadesInvalidas
  );
  const versionPrompt = _configLeerObligatoria(
    propiedadesScript,
    'PROMPT_VERSION',
    propiedadesInvalidas,
    false
  );
  const modeloOpenAI = _configLeerOpcionalNoVacia(
    propiedadesScript,
    'OPENAI_MODELO',
    propiedadesInvalidas
  );

  if (!esCadenaNoVacia(claveApiGemini) && !esCadenaNoVacia(claveApiOpenAI)) {
    propiedadesInvalidas.push('GEMINI_API_KEY');
  }

  _configAsegurarValidez(propiedadesInvalidas);

  return Object.freeze({
    gemini: Object.freeze({
      carpetaNotasId: identificadorCarpetaNotas
    }),
    plantilla: Object.freeze({
      documentoId: identificadorPlantilla
    }),
    recursos: Object.freeze({
      carpetaOtrosId: identificadorCarpetaOtros
    }),
    actas: Object.freeze({
      carpetaRaizId: identificadorCarpetaRaizActas
    }),
    procesados: Object.freeze({
      repositorioId: identificadorRepositorioProcesados
    }),
    geminiIA: Object.freeze({
      apiKey: claveApiGemini || claveApiOpenAI,
      modelo: modeloGemini
    }),
    openAI: Object.freeze({
      apiKey: claveApiOpenAI,
      modelo: modeloOpenAI
    }),
    prompt: Object.freeze({
      version: versionPrompt
    })
  });
}

/**
 * Lee una propiedad obligatoria y registra únicamente su nombre si es
 * inválida.
 *
 * @param {Object<string, string>} propiedadesScript Propiedades del proyecto.
 * @param {string} nombre Nombre de la propiedad.
 * @param {string[]} propiedadesInvalidas Nombres de propiedades inválidas.
 * @param {boolean} preservarValorOriginal Indica si debe evitarse normalizar
 *     el valor.
 * @return {string|undefined} Valor leído o ausencia explícita.
 * @private
 */
function _configLeerObligatoria(
  propiedadesScript,
  nombre,
  propiedadesInvalidas,
  preservarValorOriginal
) {
  const valor = propiedadesScript[nombre];

  if (typeof valor !== 'string' || valor.trim().length === 0) {
    propiedadesInvalidas.push(nombre);
    return undefined;
  }

  return preservarValorOriginal ? valor : valor.trim();
}

/**
 * Lee una propiedad opcional que, cuando existe, debe ser una cadena no vacía.
 *
 * @param {Object<string, string>} propiedadesScript Propiedades del proyecto.
 * @param {string} nombre Nombre de la propiedad.
 * @param {string[]} propiedadesInvalidas Nombres de propiedades inválidas.
 * @return {string|undefined} Valor normalizado o ausencia explícita.
 * @private
 */
function _configLeerOpcionalNoVacia(
  propiedadesScript,
  nombre,
  propiedadesInvalidas
) {
  if (!Object.prototype.hasOwnProperty.call(propiedadesScript, nombre)) {
    return undefined;
  }

  const valor = propiedadesScript[nombre];

  if (typeof valor !== 'string' || valor.trim().length === 0) {
    propiedadesInvalidas.push(nombre);
    return undefined;
  }

  return valor.trim();
}

/**
 * Interrumpe la carga cuando existen propiedades inválidas.
 *
 * El mensaje contiene exclusivamente nombres de propiedades; nunca incorpora
 * sus valores.
 *
 * @param {string[]} propiedadesInvalidas Nombres de propiedades inválidas.
 * @throws {Error} Si existe al menos una incidencia.
 * @private
 */
function _configAsegurarValidez(propiedadesInvalidas) {
  if (propiedadesInvalidas.length === 0) {
    return;
  }

  // Pendiente: migrar al sistema común de excepciones en una fase posterior.
  throw new Error(
    'Configuración inválida en Script Properties: ' +
      propiedadesInvalidas.join(', ')
  );
}
