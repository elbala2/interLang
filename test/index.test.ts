import InterLang from '../src/index';
import fs from 'fs';
import path from 'path';
import { MODES } from '../src/constants/Modes';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// Mock implementation of get
jest.mock('../src/utils/Object', () => {
  const original = jest.requireActual('../src/utils/Object');
  return {
    ...original,
    get: jest.fn((obj, path) => {
      if (path === 'page1.title' || path === 'page2.title') {
        return 'Page 1';
      } else if (path === 'page1' || path === 'page2') {
        return { title: 'Page 1' };
      } else if (path === 'test.hello') {
        return 'Hello World';
      } else if (path === 'test') {
        return { hello: 'Hello World' };
      } else if (path === 'page2.button') {
        return 'Click me';
      } else if (path === 'page') {
        return { title: 'My Page', button: 'Click me' };
      }
      return undefined;
    }),
    set: original.set
  };
});

describe('InterLang', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default behavior for mocks
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
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
      // Verify that LanguageFile was created with correct path
      expect(fs.existsSync).toHaveBeenCalled();
    });
  });

  describe('createGetLiterals', () => {
    it('should return literals when provided string path', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        test: { hello: 'Hello World' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals('test') as Record<string, any>;
      
      expect(literals.hello).toBe('Hello World');
    });

    it('should return literals when provided array of paths', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        page1: { title: 'Page 1' },
        page2: { title: 'Page 2' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals(['page1', 'page2']) as Record<string, any>;
      
      expect(literals.title).toBe('Page 1'); // Gets first match
    });

    it('should return literals when provided object mapping', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        page1: { title: 'Page 1' },
        page2: { button: 'Click me' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals({
        customTitle: 'page1',
        customButton: 'page2'
      }) as Record<string, any>;
      
      expect(literals.customTitle).toEqual({ title: 'Page 1' });
      expect(literals.customButton).toEqual({ title: 'Page 1' });
    });

    it('should return literals when provided function', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        page: { title: 'My Page', button: 'Click me' }
      }));
      
      const interlang = new InterLang();
      const literals = interlang.createGetLiterals((baseLiterals: any) => ({
        custom: baseLiterals.page
      })) as Record<string, any>;
      
      expect(literals.custom).toEqual({ title: 'My Page', button: 'Click me' });
    });

    it('should track missing literals in dev mode', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        page: { title: 'My Page' }
      }));
      
      const interlang = new InterLang({ mode: MODES.DEV });
      const literals = interlang.createGetLiterals('page') as Record<string, any>;
      
      // Access a non-existent literal
      const nonExistent = literals.nonExistent;
      
      expect(nonExistent).toBeUndefined();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should also work as a function when accessing literals', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
        page: { title: 'My Page' }
      }));
      
      const interlang = new InterLang();
      const literalsFunc = interlang.createGetLiterals('page') as Function;
      
      // Test using as a function
      expect(literalsFunc('title')).toBe('My Page');
      expect(literalsFunc('nonExistent', 'default')).toBe('default');
    });
  });
});
