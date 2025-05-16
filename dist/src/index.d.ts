import { GetLiterals, InterLangOptions, LiteralsResult } from './types';
/**
 * InterLang - Biblioteca TypeScript sin dependencias usando clases ES6
 * @version VERSION desde package.json
 */
/**
 * Clase principal de InterLang
 */
declare class InterLang {
    private options;
    private file;
    private unsetFile;
    /**
     * Constructor de la clase principal
     * @param options - Opciones de configuración
     */
    constructor(options?: InterLangOptions);
    /**
     * Inicializa la biblioteca
     * @param lang - Lenguaje a inicializar
     * @returns Instancia para encadenamiento
     */
    initialize(lang: string): InterLang;
    private getLiterals;
    createGetLiterals(getLiterals: GetLiterals): LiteralsResult;
}
export default InterLang;
export { InterLang, InterLangOptions };
