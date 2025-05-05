"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterLang = void 0;
const Modes_1 = require("./constants/Modes");
const FileExtensions_1 = require("./constants/FileExtensions");
const LanguageFile_1 = __importDefault(require("./utils/LanguageFile"));
const Object_1 = require("./utils/Object");
/**
 * InterLang - Biblioteca TypeScript sin dependencias usando clases ES6
 * @version VERSION desde package.json
 */
/**
 * Clase principal de InterLang
 */
class InterLang {
    /**
     * Constructor de la clase principal
     * @param options - Opciones de configuración
     */
    constructor(options = {}) {
        this.file = null;
        this.unsetFile = null;
        this.options = {
            mode: Modes_1.MODES.PROD,
            language: 'en',
            defaultLanguage: 'en',
            langExtension: FileExtensions_1.JSON_EXTENSION,
            dictionaryPath: './i18n',
            baseLiteralsPath: 'utils',
            ...options
        };
        if (options.langExtension
            && !FileExtensions_1.VALID_FILE_EXTENSIONS.some((ext) => ext === options.langExtension)) {
            throw new Error(`La extensión de archivo ${options.langExtension} no es válida. `
                + `Las extensiones válidas son: ${FileExtensions_1.VALID_FILE_EXTENSIONS.join(', ')}`);
        }
        this.initialize(this.options.language || this.options.defaultLanguage || 'en');
    }
    /**
     * Inicializa la biblioteca
     * @param lang - Lenguaje a inicializar
     * @returns Instancia para encadenamiento
     */
    initialize(lang) {
        const { language = 'en', mode = Modes_1.MODES.PROD, } = this.options;
        const newLang = lang || language;
        if (mode === Modes_1.MODES.DEBUG)
            console.log('Lenguaje inicializado:', newLang);
        this.options.language = newLang;
        this.file = new LanguageFile_1.default(newLang, {
            ...this.options,
            dictionaryPath: `${this.options.dictionaryPath}/${newLang}`,
        });
        if ([Modes_1.MODES.DEV, Modes_1.MODES.DEBUG].includes(mode)) {
            this.unsetFile = new LanguageFile_1.default(`unset_${newLang}`, {
                ...this.options,
                dictionaryPath: `${this.options.dictionaryPath}/${newLang}`,
            });
            if (mode === Modes_1.MODES.DEBUG)
                console.log('Archivo de idioma no seteado creado:', this.unsetFile.filePath);
        }
        return this;
    }
    getLiterals(getLiterals) {
        const baseLiterals = this.file?.getFileContent();
        if (typeof getLiterals === 'string')
            return (0, Object_1.get)(baseLiterals, getLiterals) ?? {};
        if (typeof getLiterals === 'object') {
            if (Array.isArray(getLiterals)) {
                return getLiterals.reduce((acc, curr) => ({
                    ...acc,
                    ...(0, Object_1.get)(baseLiterals, curr) ?? {},
                }), {});
            }
            else {
                return Object.entries(getLiterals).reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: (0, Object_1.get)(baseLiterals, value) ?? {},
                }), {});
            }
        }
        if (typeof getLiterals === 'function')
            return getLiterals(baseLiterals);
        return baseLiterals ?? {};
    }
    createGetLiterals(getLiterals) {
        const { mode = Modes_1.MODES.PROD, baseLiteralsPath = 'utils', } = this.options;
        const literals = {
            ...this.getLiterals(getLiterals),
            ...this.getLiterals(baseLiteralsPath),
        };
        const getLiteral = (obj, key) => {
            const literal = (0, Object_1.get)(obj, key);
            if (!literal) {
                if (mode === Modes_1.MODES.DEBUG)
                    console.warn(`Literal no encontrado: ${key}`);
                if (this.unsetFile
                    && [Modes_1.MODES.DEV, Modes_1.MODES.DEBUG].includes(mode)) {
                    const unsetFileContent = this.unsetFile.getFileContent();
                    (0, Object_1.set)(unsetFileContent, key, key);
                    this.unsetFile.setFileContent(unsetFileContent);
                    if (mode === Modes_1.MODES.DEBUG)
                        console.log('Literal se ha creado en el archivo de idioma no seteado:', this.unsetFile.filePath);
                }
            }
            return literal;
        };
        return new Proxy(literals, {
            get: (target, prop) => getLiteral(target, String(prop)),
            apply: (target, thisArg, [key, defaultValue]) => getLiteral(target, String(key)) ?? defaultValue,
        });
    }
}
exports.InterLang = InterLang;
// Exportación
exports.default = InterLang;
