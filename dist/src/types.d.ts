export type Mode = 'debug' | 'develop' | 'production';
export type LangExtension = '.json' | '.js' | '.ts';
export type GetLiterals = string | string[] | {
    [key: string]: string;
} | ((baseLiterals: Object) => Object) | undefined;
/**
 * Tipo del resultado de createGetLiterals
 * Puede ser accedido como objeto o como función
 */
export type LiteralsResult = {
    [key: string]: any;
} & {
    (key: string, defaultValue?: any): any;
};
/**
 * Opciones de configuración para InterLang
 */
export interface InterLangOptions {
    mode?: Mode;
    language?: string;
    defaultLanguage?: string;
    langExtension?: LangExtension;
    dictionaryPath?: string;
    baseLiteralsPath?: string;
}
