"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Modes_1 = require("../constants/Modes");
const FileExtensions_1 = require("../constants/FileExtensions");
/**
 * Crea un archivo de idioma basado en la configuración
 * @param options - Opciones de configuración
 * @param lang - Código de idioma
 * @param content - Contenido opcional para el archivo
 * @returns Ruta del archivo creado
 */
class LanguageFile {
    checkMainDir() {
        const { dictionaryPath = './i18n', mode = Modes_1.MODES.PROD, } = this.options;
        const dirPath = path_1.default.resolve(process.cwd(), dictionaryPath);
        if (!fs_1.default.existsSync(dirPath)
            && [Modes_1.MODES.DEBUG, Modes_1.MODES.DEV].includes(mode)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
            if (mode === Modes_1.MODES.DEBUG)
                console.log(`Directorio creado: ${dirPath}`);
        }
        return dirPath;
    }
    checkFile(name) {
        const { langExtension = FileExtensions_1.JSON_EXTENSION, mode = Modes_1.MODES.PROD, } = this.options;
        const filePath = path_1.default.join(this.dirPath, `/${name}${langExtension}`);
        if (!fs_1.default.existsSync(filePath)
            && [Modes_1.MODES.DEBUG, Modes_1.MODES.DEV].includes(mode)) {
            fs_1.default.writeFileSync(filePath, '');
            if (mode === Modes_1.MODES.DEBUG)
                console.log(`Archivo creado: ${filePath}`);
        }
        return filePath;
    }
    constructor(name, options) {
        this.options = options;
        this.dirPath = this.checkMainDir();
        this.filePath = this.checkFile(name);
    }
    getFileContent() {
        const { mode = Modes_1.MODES.PROD, langExtension = FileExtensions_1.JSON_EXTENSION, } = this.options;
        const fileContent = fs_1.default.readFileSync(this.filePath, 'utf8');
        if (mode === Modes_1.MODES.DEBUG)
            console.log(`Obtenido contenido del archivo: ${this.filePath}`);
        if (langExtension === FileExtensions_1.JSON_EXTENSION) {
            try {
                return JSON.parse(fileContent || '{}');
            }
            catch (error) {
                console.error(`Error al parsear el archivo: ${this.filePath}`);
                return {};
            }
        }
        return fileContent;
    }
    setFileContent(content) {
        const { mode = Modes_1.MODES.PROD, langExtension = FileExtensions_1.JSON_EXTENSION, } = this.options;
        let newContent = content;
        if (langExtension === FileExtensions_1.JSON_EXTENSION) {
            try {
                newContent = JSON.stringify(content, null, 2);
            }
            catch (error) {
                if ([Modes_1.MODES.DEBUG, Modes_1.MODES.DEV].includes(mode))
                    console.error(`Error al actualizar el archivo: ${this.filePath}`);
                return;
            }
        }
        fs_1.default.writeFileSync(this.filePath, newContent);
        if (mode === Modes_1.MODES.DEBUG)
            console.log(`Archivo actualizado: ${this.filePath}`);
    }
}
exports.default = LanguageFile;
