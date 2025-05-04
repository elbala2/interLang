import fs from 'fs';
import path from 'path';
import { InterLangOptions } from '../types';
import { MODES } from '../constants/Modes';
import { JSON_EXTENSION } from '../constants/FileExtensions';

/**
 * Crea un archivo de idioma basado en la configuración
 * @param options - Opciones de configuración
 * @param lang - Código de idioma
 * @param content - Contenido opcional para el archivo
 * @returns Ruta del archivo creado
 */
export default class LanguageFile {
  public options: InterLangOptions;
  public dirPath: string;
  public filePath: string;

  private checkMainDir(): string {
    const {
      dictionaryPath = './i18n',
      mode = MODES.PROD,
    } = this.options;

    const dirPath = path.resolve(process.cwd(), dictionaryPath);
    if (
      !fs.existsSync(dirPath)
      && [MODES.DEBUG, MODES.DEV].includes(mode)
    ) {
      fs.mkdirSync(dirPath, { recursive: true });
      if (mode === MODES.DEBUG) console.log(`Directorio creado: ${dirPath}`);
    }

    return dirPath;
  }

  private checkFile(lang: string): string {
    const {
      langExtension = JSON_EXTENSION,
      mode = MODES.PROD,
    } = this.options;

    const filePath = path.join(this.dirPath, `/${lang}/index${langExtension}`);
    if (
      !fs.existsSync(filePath)
      && [MODES.DEBUG, MODES.DEV].includes(mode)
    ) {
      fs.writeFileSync(filePath, '');
      if (mode === MODES.DEBUG) console.log(`Archivo creado: ${filePath}`);
    }

    return filePath;
  }

  constructor(
    lang: string,
    options: InterLangOptions,
  ) {
    this.options = options;
    this.dirPath = this.checkMainDir();
    this.filePath = this.checkFile(lang);
  }

  public getFileContent(): any {
    const {
      mode = MODES.PROD,
      langExtension = JSON_EXTENSION,
    } = this.options;
    
    const fileContent = fs.readFileSync(this.filePath, 'utf8');

    if (mode === MODES.DEBUG) console.log(`Obtenido contenido del archivo: ${this.filePath}`);
    
    if (langExtension === JSON_EXTENSION) {
      try {
        return JSON.parse(fileContent || '{}');
      } catch (error) {
        console.error(`Error al parsear el archivo: ${this.filePath}`);
        return {};
      }
    }

    return fileContent;
  }
} 