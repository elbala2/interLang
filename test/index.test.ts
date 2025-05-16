import { beforeEach, describe, expect, it, vi } from 'vitest';
import InterLang from '../src/index';
import fs from 'fs';
import { MODES } from '../src/constants/Modes';

vi.mock('fs');

describe('InterLang', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue('{}');
  });

  describe('Constructor', () => {
    it('should create an instance with default options', () => {
      const interlang = new InterLang();
      expect(interlang).toBeInstanceOf(InterLang);
    });

    it('should create an instance with custom options', () => {
      const options = {
        mode: MODES.DEV,
        language: 'es',
        defaultLanguage: 'en',
        dictionaryPath: './custom-i18n'
      };
      const interlang = new InterLang(options);
      expect(interlang).toBeInstanceOf(InterLang);
    });

    it('should throw an error for invalid language extension', () => {
      expect(() => {
        new InterLang({ langExtension: '.invalid' as any });
      }).toThrow(/La extensión de archivo .invalid no es válida/);
    });
  });

  describe('initialize', () => {
    it('should initialize with specified language', () => {
      const interlang = new InterLang();
      const result = interlang.initialize('es');
      
      expect(result).toBe(interlang); // Chainable return
      expect(fs.existsSync).toHaveBeenCalled();
    });
  });

  describe('createGetLiterals', () => {
    it('should return literals when provided string path', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        test: { hello: 'Hello World' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals('test') as Record<string, any>;
      
      expect(literals.hello).toBe('Hello World');
    });

    it('should return literals when provided array of paths', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        page1: { title: 'Page 1' },
        page2: { title: 'Page 2' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals(['page1', 'page2']) as Record<string, any>;
      
      expect(literals.title).toBe('Page 2'); // Gets first match
    });

    it('should return literals when provided object mapping', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        page1: { title: 'Page 1' },
        page2: { button: 'Click me' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals({
        customTitle: 'page1',
        customButton: 'page2'
      }) as Record<string, any>;
      
      expect(literals.customTitle).toEqual({ title: 'Page 1' });
      expect(literals.customButton).toEqual({ button: 'Click me' });
    });

    it('should return literals when provided function', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        page: { title: 'My Page', button: 'Click me' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals((baseLiterals: any) => ({
        custom: baseLiterals.page
      })) as Record<string, any>;
      
      expect(literals.custom).toEqual({ title: 'My Page', button: 'Click me' });
    });

    it('should track missing literals in dev mode', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        page: { title: 'My Page' }
      }));
      
      const interlang = new InterLang({ mode: MODES.DEV });
      const literals = interlang.createGetLiterals('page') as Record<string, any>;
      
      const nonExistent = literals.nonExistent;
      
      expect(nonExistent).toBeUndefined();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should also work as a function when accessing literals', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        page: { title: 'My Page' }
      }));
      
      const interlang = new InterLang();
      const literalsFunc = interlang.createGetLiterals('page') as Function;

      expect(literalsFunc('title')).toBe('My Page');
      expect(literalsFunc('nonExistent', 'default')).toBe('default');
    });

    it('should return a boolean with isInterLang property', () => {
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals('page') as Record<string, any>;

      expect(literals.isInterLang).toBe(true);
    });

    it('should return an object with object property', () => {
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals('page') as Record<string, any>;

      expect(literals).toBeInstanceOf(Object);
    });
  });
});
