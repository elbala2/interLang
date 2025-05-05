import { InterLangOptions } from '../types';
/**
 * Crea un archivo de idioma basado en la configuración
 * @param options - Opciones de configuración
 * @param lang - Código de idioma
 * @param content - Contenido opcional para el archivo
 * @returns Ruta del archivo creado
 */
export default class LanguageFile {
    options: InterLangOptions;
    dirPath: string;
    filePath: string;
    private checkMainDir;
    private checkFile;
    constructor(name: string, options: InterLangOptions);
    getFileContent(): any;
    setFileContent(content: any): void;
}
