
export type Mode = 'debug' | 'develop' | 'production';
export type LangExtension = '.json' | '.js' | '.ts';

export type GetLiterals =
  | string
  | string[]
  | { [key: string]: string }
  | ((baseLiterals: Object) => Object)
  | undefined;

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

