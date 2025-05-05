#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../package.json");
const args = process.argv.slice(2);
function printHelp() {
    console.log(`
InterLang CLI v${package_json_1.version}
-----------------------
A library that allows you to create and use languages in your code.

Usage:
  interlang [command] [options]

Commands:
  help     Display this help message
  version  Display version information

For more information, visit: https://github.com/youruser/interlang
`);
}
function printVersion() {
    console.log(`InterLang v${package_json_1.version}`);
}
function main() {
    if (args.length === 0 || args[0] === 'help') {
        printHelp();
        return;
    }
    switch (args[0]) {
        case 'version':
            printVersion();
            break;
        default:
            console.error(`Unknown command: ${args[0]}`);
            printHelp();
            process.exit(1);
    }
}
main();
