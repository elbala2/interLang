#!/usr/bin/env node

import { version } from '../package.json';
import fs from 'fs';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
InterLang CLI v${version}
-----------------------
A library that allows you to create and use languages in your code.

Usage:
  interlang [command] [options]

Commands:
  help     Display this help message
  version  Display version information
  generate [sourcePath] [baseLanguage] [newLanguage] [extension]  Generate a new language file
  translate [content] [targetLang]  Translate a language file

For more information, visit: https://github.com/youruser/interlang
`);
}

function printVersion() {
  console.log(`InterLang v${version}`);
}

/**
 * Traduce texto usando la API gratuita de LibreTranslate
 * @param text Texto a traducir
 * @param targetLang Código del idioma de destino
 * @returns Texto traducido
 */
async function translateText(text: string, targetLang: string): Promise<string> {
  const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  if (!GOOGLE_TRANSLATE_API_KEY) {
    throw new Error('GOOGLE_TRANSLATE_API_KEY environment variable is required. Please set it before running the command.');
  }

  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`, {
    method: "POST",
    body: JSON.stringify({
      q: text,
      target: targetLang,
      format: "text"
    }),
    headers: { 
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  
  if (data.error) {
    throw new Error(`Google Translate API error: ${data.error.message}`);
  }

  return data.data.translations[0].translatedText;
}

/**
 * Traduce un objeto o texto
 */
async function translate(content: any, targetLang: string): Promise<any> {
  // Si es un string, traducir directamente
  if (typeof content === 'string') {
    return await translateText(content, targetLang);
  }

  const calls = Object.values(content).map((value) => translate(value, targetLang));
  const results = await Promise.all(calls);

  return Object.fromEntries(Object.entries(content)
    .map(([key, value], index) => [key, results[index]]));
}

async function generateLanguage(
  sourcePath: string,
  baseLanguage: string,
  newLanguage: string,
  extension: string = '.json'
) {
  console.log('Generating...');
  
  if (!sourcePath || !baseLanguage || !newLanguage) {
    console.error('Error: You must provide a source file and a language code.');
    console.log('Usage: interlang -g <sourcePath> <baseLanguage> <newLanguage>');
    process.exit(1);
  }

  try {
    // Check if source file exists
    const sourceFilePath = `${sourcePath}/${baseLanguage}/index${extension}`;
    if (!fs.existsSync(sourceFilePath)) {
      console.error(`Error: Source file not found: ${sourceFilePath}`);
      process.exit(1);
    }

    // Read the source file
    let content = fs.readFileSync(sourceFilePath, 'utf8');
    
    // Parse JSON file
    if (extension === '.json') {
      content = JSON.parse(content);
    }
    
    // Create target directory if it doesn't exist
    const targetDir = `${sourcePath}/${newLanguage}`;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    console.log('Starting translation...');
    
    const translatedData = await translate(content, newLanguage);
    
    // Write translated content to the new file
    const targetFilePath = `${sourcePath}/${newLanguage}/index${extension}`;
    fs.writeFileSync(targetFilePath, JSON.stringify(translatedData, null, 2));
    
    console.log(`Translation completed: ${targetFilePath}`);
  } catch (error) {
    console.error('Error generating language file:', error);
    process.exit(1);
  }
}

async function main() {
  if (args.length === 0 || args[0] === 'help') {
    printHelp();
    return;
  }


  switch (args[0]) {
    case '--version':
    case '-v':
      printVersion();
      break;

    case '--help':
    case '-h':
      printHelp();
      break;

    case '--generate':
    case '-g':
      generateLanguage(args[1], args[2], args[3], args[4]);
      break;

    case '--translate':
    case '-t':
      const translatedText = await translate(args[1], args[2]);
      console.log(translatedText);
      break;

    default:
      console.error(`Unknown command: ${args[0]}`);
      printHelp();
      process.exit(1);
  }
}

// Call main and handle any errors
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
}); 