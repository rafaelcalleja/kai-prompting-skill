#!/usr/bin/env bun
/**
 * RenderTemplate.ts - Template Rendering Engine
 *
 * Renders Handlebars templates with YAML data to produce final prompts.
 *
 * Usage:
 *   bun run RenderTemplate.ts --template <path> --data <path> [--output <path>]
 *
 * Examples:
 *   bun run RenderTemplate.ts --template primitives/Briefing.hbs --data data.yaml
 *   bun run RenderTemplate.ts --template primitives/Roster.hbs --data agents.yaml --output roster.md
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import Handlebars from 'handlebars';
import { parse as parseYaml } from 'yaml';

// Get script directory for relative template resolution
const scriptDir = dirname(new URL(import.meta.url).pathname);
const templatesDir = join(scriptDir, '..', 'templates');

interface RenderOptions {
  template: string;
  data: string;
  output?: string;
}

function parseArgs(): RenderOptions {
  const args = process.argv.slice(2);
  const options: Partial<RenderOptions> = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--template':
      case '-t':
        options.template = args[++i];
        break;
      case '--data':
      case '-d':
        options.data = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  if (!options.template || !options.data) {
    console.error('Error: --template and --data are required');
    printHelp();
    process.exit(1);
  }

  return options as RenderOptions;
}

function printHelp(): void {
  console.log(`
RenderTemplate - Handlebars Template Renderer

Usage:
  bun run RenderTemplate.ts --template <path> --data <path> [--output <path>]

Options:
  -t, --template  Path to Handlebars template (.hbs)
  -d, --data      Path to YAML data file (.yaml/.yml)
  -o, --output    Output file path (optional, prints to stdout if not specified)
  -h, --help      Show this help message

Examples:
  bun run RenderTemplate.ts -t primitives/Briefing.hbs -d briefing.yaml
  bun run RenderTemplate.ts -t primitives/Roster.hbs -d agents.yaml -o roster.md
`);
}

function resolveTemplatePath(templatePath: string): string {
  // Check if it's an absolute path
  if (templatePath.startsWith('/')) {
    return templatePath;
  }

  // Check relative to current directory
  if (existsSync(templatePath)) {
    return resolve(templatePath);
  }

  // Check relative to templates directory
  const templatesPath = join(templatesDir, templatePath);
  if (existsSync(templatesPath)) {
    return templatesPath;
  }

  throw new Error(`Template not found: ${templatePath}`);
}

function loadTemplate(templatePath: string): HandlebarsTemplateDelegate {
  const resolvedPath = resolveTemplatePath(templatePath);
  const templateContent = readFileSync(resolvedPath, 'utf-8');
  return Handlebars.compile(templateContent);
}

function loadData(dataPath: string): Record<string, unknown> {
  if (!existsSync(dataPath)) {
    throw new Error(`Data file not found: ${dataPath}`);
  }

  const dataContent = readFileSync(dataPath, 'utf-8');
  return parseYaml(dataContent) as Record<string, unknown>;
}

function registerHelpers(): void {
  // Helper: Format date
  Handlebars.registerHelper('formatDate', (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Helper: Uppercase
  Handlebars.registerHelper('uppercase', (str: string) => {
    return str?.toUpperCase() ?? '';
  });

  // Helper: Lowercase
  Handlebars.registerHelper('lowercase', (str: string) => {
    return str?.toLowerCase() ?? '';
  });

  // Helper: Join array with separator
  Handlebars.registerHelper('join', (arr: string[], separator: string) => {
    if (!Array.isArray(arr)) return '';
    return arr.join(typeof separator === 'string' ? separator : ', ');
  });

  // Helper: Conditional equality
  Handlebars.registerHelper('eq', (a: unknown, b: unknown) => {
    return a === b;
  });

  // Helper: Increment number (for 1-based indexing)
  Handlebars.registerHelper('inc', (num: number) => {
    return num + 1;
  });
}

function main(): void {
  try {
    const options = parseArgs();

    // Register custom helpers
    registerHelpers();

    // Load template and data
    const template = loadTemplate(options.template);
    const data = loadData(options.data);

    // Render
    const output = template(data);

    // Output
    if (options.output) {
      writeFileSync(options.output, output, 'utf-8');
      console.log(`✅ Rendered to: ${options.output}`);
    } else {
      console.log(output);
    }

  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
