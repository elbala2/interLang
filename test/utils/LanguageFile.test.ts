import LanguageFile from '../../src/utils/LanguageFile';
import fs from 'fs';
import path from 'path';
import { MODES } from '../../src/constants/Modes';

// Mock fs and path modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  resolve: jest.fn(),
  join: jest.fn(),
}));

describe('LanguageFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default behavior for mocks
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
    (path.resolve as jest.Mock).mockImplementation((...args) => args.join('/'));
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
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
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
      
      const languageFile = new LanguageFile('en', {
        mode: MODES.DEV,
        dictionaryPath: './i18n/en'
      });
      
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should create file if it does not exist in dev mode', () => {
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)  // Directory exists
        .mockReturnValueOnce(false); // File does not exist
      
      const languageFile = new LanguageFile('en', {
        mode: MODES.DEV,
        dictionaryPath: './i18n/en'
      });
      
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should not create directory if it does not exist in prod mode', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
      
      const languageFile = new LanguageFile('en', {
        mode: MODES.PROD,
        dictionaryPath: './i18n/en'
      });
      
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getFileContent', () => {
    it('should read and parse JSON file content', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('{"key": "value"}');
      
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en'
      });
      
      const content = languageFile.getFileContent();
      expect(content).toEqual({ key: 'value' });
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    it('should return empty object if JSON is invalid', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      
      const languageFile = new LanguageFile('en', {
        dictionaryPath: './i18n/en'
      });
      
      const content = languageFile.getFileContent();
      expect(content).toEqual({});
    });

    it('should return raw content for non-JSON extension', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('const content = "test";');
      
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