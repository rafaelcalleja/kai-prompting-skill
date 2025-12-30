#!/usr/bin/env bun
/**
 * ValidateTemplate.ts - Template Syntax Validator
 *
 * Validates Handlebars template syntax and reports errors.
 *
 * Usage:
 *   bun run ValidateTemplate.ts --template <path>
 *   bun run ValidateTemplate.ts --all
 *
 * Examples:
 *   bun run ValidateTemplate.ts --template primitives/Briefing.hbs
 *   bun run ValidateTemplate.ts --all
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, resolve, basename } from 'path';
import Handlebars from 'handlebars';

// Get script directory for relative template resolution
const scriptDir = dirname(new URL(import.meta.url).pathname);
const templatesDir = join(scriptDir, '..', 'templates');
const primitivesDir = join(templatesDir, 'primitives');

interface ValidationResult {
  path: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  variables: string[];
}

interface ValidateOptions {
  template?: string;
  all?: boolean;
}

function parseArgs(): ValidateOptions {
  const args = process.argv.slice(2);
  const options: ValidateOptions = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--template':
      case '-t':
        options.template = args[++i];
        break;
      case '--all':
      case '-a':
        options.all = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  if (!options.template && !options.all) {
    console.error('Error: --template or --all is required');
    printHelp();
    process.exit(1);
  }

  return options;
}

function printHelp(): void {
  console.log(`
ValidateTemplate - Handlebars Template Validator

Usage:
  bun run ValidateTemplate.ts --template <path>
  bun run ValidateTemplate.ts --all

Options:
  -t, --template  Path to Handlebars template (.hbs)
  -a, --all       Validate all templates in primitives/
  -h, --help      Show this help message

Examples:
  bun run ValidateTemplate.ts -t primitives/Briefing.hbs
  bun run ValidateTemplate.ts --all
`);
}

function resolveTemplatePath(templatePath: string): string {
  if (templatePath.startsWith('/')) {
    return templatePath;
  }

  if (existsSync(templatePath)) {
    return resolve(templatePath);
  }

  const templatesPath = join(templatesDir, templatePath);
  if (existsSync(templatesPath)) {
    return templatesPath;
  }

  throw new Error(`Template not found: ${templatePath}`);
}

function extractVariables(template: string): string[] {
  const variables = new Set<string>();

  // Match {{variable}}, {{#each variable}}, {{#if variable}}, etc.
  const patterns = [
    /\{\{([a-zA-Z_][a-zA-Z0-9_\.]*)\}\}/g,           // Simple variables
    /\{\{#each\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\}\}/g,   // Each blocks
    /\{\{#if\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\}\}/g,     // If blocks
    /\{\{#unless\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\}\}/g, // Unless blocks
    /\{\{#with\s+([a-zA-Z_][a-zA-Z0-9_\.]*)\}\}/g,   // With blocks
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(template)) !== null) {
      // Get root variable name
      const rootVar = match[1].split('.')[0];
      if (rootVar !== 'this' && rootVar !== '@index' && rootVar !== '@key' && rootVar !== '@first' && rootVar !== '@last') {
        variables.add(rootVar);
      }
    }
  }

  return Array.from(variables).sort();
}

function validateTemplate(templatePath: string): ValidationResult {
  const result: ValidationResult = {
    path: templatePath,
    valid: true,
    errors: [],
    warnings: [],
    variables: []
  };

  try {
    const content = readFileSync(templatePath, 'utf-8');

    // Check for syntax errors by compiling
    try {
      Handlebars.compile(content);
    } catch (error) {
      result.valid = false;
      result.errors.push(`Syntax error: ${(error as Error).message}`);
      return result;
    }

    // Extract variables
    result.variables = extractVariables(content);

    // Check for common issues

    // Warning: Template has no variables
    if (result.variables.length === 0) {
      result.warnings.push('Template has no variables - is this intentional?');
    }

    // Warning: Unclosed blocks
    const blockOpeners = (content.match(/\{\{#(each|if|unless|with)/g) || []).length;
    const blockClosers = (content.match(/\{\{\/(each|if|unless|with)/g) || []).length;
    if (blockOpeners !== blockClosers) {
      result.errors.push(`Mismatched block tags: ${blockOpeners} openers, ${blockClosers} closers`);
      result.valid = false;
    }

    // Warning: Check for data structure comment
    if (!content.includes('Data Structure:')) {
      result.warnings.push('Template lacks Data Structure documentation comment');
    }

  } catch (error) {
    result.valid = false;
    result.errors.push(`Read error: ${(error as Error).message}`);
  }

  return result;
}

function printResult(result: ValidationResult): void {
  const status = result.valid ? '✅' : '❌';
  console.log(`\n${status} ${basename(result.path)}`);

  if (result.errors.length > 0) {
    console.log('  Errors:');
    result.errors.forEach(e => console.log(`    - ${e}`));
  }

  if (result.warnings.length > 0) {
    console.log('  Warnings:');
    result.warnings.forEach(w => console.log(`    - ${w}`));
  }

  if (result.variables.length > 0) {
    console.log(`  Variables: ${result.variables.join(', ')}`);
  }
}

function main(): void {
  const options = parseArgs();
  const results: ValidationResult[] = [];

  if (options.all) {
    // Validate all templates in primitives/
    if (!existsSync(primitivesDir)) {
      console.error(`Primitives directory not found: ${primitivesDir}`);
      process.exit(1);
    }

    const files = readdirSync(primitivesDir).filter(f => f.endsWith('.hbs'));
    console.log(`Validating ${files.length} templates in primitives/...`);

    for (const file of files) {
      results.push(validateTemplate(join(primitivesDir, file)));
    }
  } else if (options.template) {
    try {
      const templatePath = resolveTemplatePath(options.template);
      results.push(validateTemplate(templatePath));
    } catch (error) {
      console.error(`❌ ${(error as Error).message}`);
      process.exit(1);
    }
  }

  // Print results
  results.forEach(printResult);

  // Summary
  const valid = results.filter(r => r.valid).length;
  const invalid = results.filter(r => !r.valid).length;
  const warnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Summary: ${valid} valid, ${invalid} invalid, ${warnings} warnings`);

  // Exit with error if any invalid
  if (invalid > 0) {
    process.exit(1);
  }
}

main();
