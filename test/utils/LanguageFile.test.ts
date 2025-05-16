import { beforeEach, describe, expect, it, vi } from 'vitest';

// Definir los tipos de los mocks primero
type MockedFunction = ReturnType<typeof vi.fn>;

vi.mock('fs', () => {
  return {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    default: {
      existsSync: vi.fn(),
      mkdirSync: vi.fn(),
      writeFileSync: vi.fn(),
      readFileSync: vi.fn(),
    }
  };
});

vi.mock('path', () => {
  return {
    resolve: vi.fn(),
    join: vi.fn(),
    default: {
      resolve: vi.fn(),
      join: vi.fn(),
    }
  };
});

import LanguageFile from '../../src/utils/LanguageFile';
import fs from 'fs';
import path from 'path';
import { MODES } from '../../src/constants/Modes';

describe('LanguageFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default behavior for mocks
    (fs.existsSync as MockedFunction).mockReturnValue(true);
    (fs.readFileSync as MockedFunction).mockReturnValue('{}');
    (path.resolve as MockedFunction).mockImplementation((...args) => args.join('/'));
    (path.join as MockedFunction).mockImplementation((...args) => args.join('/'));
  });

  describe('constructor', () => {
    it('should create an instance with default options', () => {
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en'
      });
      
      expect(languageFile).toBeInstanceOf(LanguageFile);
      expect(path.resolve).toHaveBeenCalled();
      expect(fs.existsSync).toHaveBeenCalled();
    });

    it('should create directory if it does not exist in dev mode', () => {
      (fs.existsSync as MockedFunction).mockReturnValueOnce(false);
      
      const languageFile = new LanguageFile('en', {
        mode: MODES.DEV,
        dictionaryPath: './i18n/en'
      });
      
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should create file if it does not exist in dev mode', () => {
      (fs.existsSync as MockedFunction)
        .mockReturnValueOnce(true)  // Directory exists
        .mockReturnValueOnce(false); // File does not exist

      const languageFile = new LanguageFile('en', {
        mode: MODES.DEV,
        dictionaryPath: './i18n/en'
      });

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should not create directory if it does not exist in prod mode', () => {
      (fs.existsSync as MockedFunction).mockReturnValueOnce(false);
      
      const languageFile = new LanguageFile('en', {
        mode: MODES.PROD,
        dictionaryPath: './i18n/en'
      });
      
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getFileContent', () => {
    it('should read and parse JSON file content', () => {
      (fs.readFileSync as MockedFunction).mockReturnValue('{"key": "value"}');
      
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en'
      });
      
      const content = languageFile.getFileContent();
      expect(content).toEqual({ key: 'value' });
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    it('should return empty object if JSON is invalid', () => {
      (fs.readFileSync as MockedFunction).mockReturnValue('invalid json');
      
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en'
      });
      
      const content = languageFile.getFileContent();
      expect(content).toEqual({});
    });

    it('should return raw content for non-JSON extension', () => {
      (fs.readFileSync as MockedFunction).mockReturnValue('const content = "test";');
      
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en',
        langExtension: '.js'
      });
      
      const content = languageFile.getFileContent();
      expect(content).toBe('const content = "test";');
    });
  });

  describe('setFileContent', () => {
    it('should stringify and write JSON content to file', () => {
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en'
      });
      
      const content = { key: 'value' };
      languageFile.setFileContent(content);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(content, null, 2)
      );
    });

    it('should write raw content for non-JSON extension', () => {
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en',
        langExtension: '.js'
      });
      
      const content = 'const content = "test";';
      languageFile.setFileContent(content);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        content
      );
    });

    it('should not throw when JSON.stringify fails', () => {
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en'
      });
      
      // Create circular reference to cause JSON.stringify to fail
      const circular: any = {};
      circular.self = circular;
      
      expect(() => {
        languageFile.setFileContent(circular);
      }).not.toThrow();
      
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
}); 