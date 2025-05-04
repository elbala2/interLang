// Importar versión desde package.json
import { version as VERSION } from '../package.json';
import { MODES } from './constants/Modes';
import { JSON_EXTENSION, VALID_FILE_EXTENSIONS } from './constants/FileExtensions';
import { GetLiterals, InterLangOptions, LangExtension } from './types';
import LanguageFile from './utils/LanguageFile';
import { get } from './utils/Object';

/**
 * InterLang - Biblioteca TypeScript sin dependencias usando clases ES6
 * @version VERSION desde package.json
 */

/**
 * Clase principal de InterLang
 */
class InterLang {
  public version: string;
  public options: InterLangOptions;
  public file: LanguageFile | null;

  /**
   * Constructor de la clase principal
   * @param options - Opciones de configuración
   */
  constructor(options: InterLangOptions = {}) {
    this.version = VERSION;
    this.file = null;

    this.options = {
      mode: MODES.PROD,
      language: 'en',
      defaultLanguage: 'en',
      langExtension: JSON_EXTENSION,
      dictionaryPath: './i18n',
      baseLiteralsPath: 'utils',
      ...options
    };
  
    if (
      options.langExtension
      && !VALID_FILE_EXTENSIONS.some((ext: LangExtension) => ext === options.langExtension)
    ) {
      throw new Error(
        `La extensión de archivo ${options.langExtension} no es válida. `
        + `Las extensiones válidas son: ${VALID_FILE_EXTENSIONS.join(', ')}`
      );
    }

    this.initialize(this.options.language || this.options.defaultLanguage || 'en');
  }

  /**
   * Inicializa la biblioteca
   * @param lang - Lenguaje a inicializar
   * @returns Instancia para encadenamiento
   */
  public initialize(lang: string): InterLang {
    const {
      language = 'en',
      mode = MODES.PROD,
    } = this.options;

    const newLang = lang || language;

    if (mode === MODES.DEBUG) console.log('Lenguaje inicializado:', newLang);

    this.options.language = newLang;
    this.file = new LanguageFile(newLang, this.options);

    return this;
  }

  private getLiterals(getLiterals: GetLiterals): Object {
    const baseLiterals = this.file?.getFileContent();

    if (typeof getLiterals === 'string') return get(baseLiterals, getLiterals) ?? {};

    if (typeof getLiterals === 'object') {
      if (Array.isArray(getLiterals)) {

        return getLiterals.reduce((acc: Object, curr: string) => ({
            ...acc,
            ...get(baseLiterals, curr) ?? {},
        }), {});

      } else {

        return Object.entries(getLiterals).reduce((
          acc: Object,
          [key, value]: [string, string],
        ) => ({
            ...acc,
            [key]: get(baseLiterals, value) ?? {},
        }), {});

      }
    }

    if (typeof getLiterals === 'function') return getLiterals(baseLiterals);

    return baseLiterals ?? {};
  }

  public createGetLiterals(getLiterals: GetLiterals): Object {
    const {
      mode = MODES.PROD,
      baseLiteralsPath = 'utils',
    } = this.options;

    const literals = {
      ...this.getLiterals(getLiterals),
      ...this.getLiterals(baseLiteralsPath),
    };

    const getLiteral = (obj: Object, key: string) => {
      const literal = get(obj, key);
      if (mode === MODES.DEBUG && !literal) console.warn(`Literal no encontrado: ${key}`);
      return literal;
    }

    return new Proxy(literals, {
      get: (target, prop) => getLiteral(target, String(prop)),
      apply: (target, thisArg, argumentsList) => getLiteral(target, String(argumentsList[0])),
    });
  }

}

// Exportación
export default InterLang;
export { InterLang, InterLangOptions };
