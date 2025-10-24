#!/usr/bin/env tsx

/**
 * Environment Variables Validation Script
 *
 * This script validates that all required environment variables are set
 * and properly configured for the target environment (development, staging, production).
 *
 * Usage:
 *   tsx scripts/validate-env.ts [environment]
 *
 * Examples:
 *   tsx scripts/validate-env.ts development
 *   tsx scripts/validate-env.ts production
 */
import * as fs from 'fs';
import * as path from 'path';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface ValidationRule {
  name: string;
  required: boolean;
  minLength?: number;
  pattern?: RegExp;
  description: string;
  productionOnly?: boolean;
}

const validationRules: ValidationRule[] = [
  // Appwrite Configuration
  {
    name: 'APPWRITE_ENDPOINT',
    required: true,
    pattern: /^https?:\/\/.+/,
    description: 'Appwrite API endpoint URL',
  },
  {
    name: 'APPWRITE_PROJECT_ID',
    required: true,
    minLength: 10,
    description: 'Appwrite project ID',
  },
  {
    name: 'APPWRITE_API_KEY',
    required: true,
    minLength: 20,
    description: 'Appwrite API key',
  },
  {
    name: 'APPWRITE_DATABASE_ID',
    required: true,
    minLength: 10,
    description: 'Appwrite database ID',
  },

  // JWT Configuration
  {
    name: 'JWT_SECRET',
    required: true,
    minLength: 32,
    description: 'JWT signing secret (min 32 characters)',
  },
  {
    name: 'JWT_EXPIRATION',
    required: true,
    pattern: /^\d+[smhd]$/,
    description: 'JWT expiration time (e.g., 7d, 24h)',
  },
  {
    name: 'JWT_REFRESH_SECRET',
    required: true,
    minLength: 32,
    description: 'JWT refresh token secret (min 32 characters)',
  },
  {
    name: 'JWT_REFRESH_EXPIRATION',
    required: true,
    pattern: /^\d+[smhd]$/,
    description: 'JWT refresh token expiration (e.g., 30d)',
  },

  // Server Configuration
  {
    name: 'NODE_ENV',
    required: true,
    pattern: /^(development|production|test)$/,
    description: 'Node environment (development, production, test)',
  },
  {
    name: 'API_URL',
    required: true,
    pattern: /^https?:\/\/.+/,
    description: 'API base URL',
  },

  // CORS Configuration
  {
    name: 'CORS_ORIGIN',
    required: true,
    pattern: /^https?:\/\/.+/,
    description: 'CORS allowed origin',
  },

  // Cookie Configuration
  {
    name: 'COOKIE_SECURE',
    required: false,
    pattern: /^(true|false)$/,
    description: 'Cookie secure flag (should be true in production)',
    productionOnly: true,
  },

  // Public Variables
  {
    name: 'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    required: true,
    pattern: /^https?:\/\/.+/,
    description: 'Public Appwrite endpoint',
  },
  {
    name: 'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
    required: true,
    minLength: 10,
    description: 'Public Appwrite project ID',
  },
  {
    name: 'NEXT_PUBLIC_API_URL',
    required: true,
    pattern: /^https?:\/\/.+/,
    description: 'Public API URL',
  },

  // Optional Variables
  {
    name: 'GEMINI_API_KEY',
    required: false,
    description: 'Google Gemini API key (optional)',
  },
];

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

function loadEnvFile(envPath: string): Record<string, string> {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env: Record<string, string> = {};

  envContent.split('\n').forEach((line) => {
    line = line.trim();

    // Skip comments and empty lines
    if (!line || line.startsWith('#')) {
      return;
    }

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      env[key] = value;
    }
  });

  return env;
}

function validateEnvironment(environment: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  // Load environment variables
  const envPath = path.join(process.cwd(), '.env.local');
  const envVars = loadEnvFile(envPath);

  // Merge with process.env
  const allVars = { ...envVars, ...process.env };

  console.log(`${colors.cyan}Validating environment: ${environment}${colors.reset}\n`);

  // Validate each rule
  validationRules.forEach((rule) => {
    const value = allVars[rule.name];

    // Check if required variable is missing
    if (rule.required && !value) {
      result.valid = false;
      result.errors.push(`❌ ${rule.name} is required but not set - ${rule.description}`);
      return;
    }

    // Skip optional variables if not set
    if (!rule.required && !value) {
      result.info.push(`ℹ️  ${rule.name} is not set (optional) - ${rule.description}`);
      return;
    }

    if (value) {
      // Check minimum length
      if (rule.minLength && value.length < rule.minLength) {
        result.valid = false;
        result.errors.push(
          `❌ ${rule.name} is too short (${value.length} chars, min ${rule.minLength}) - ${rule.description}`,
        );
      }

      // Check pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        result.valid = false;
        result.errors.push(`❌ ${rule.name} has invalid format - ${rule.description}`);
      }

      // Production-specific checks
      if (environment === 'production') {
        // Check for default/example values
        if (value.includes('your-') || value.includes('change-this')) {
          result.valid = false;
          result.errors.push(`❌ ${rule.name} contains placeholder value - ${rule.description}`);
        }

        // Check HTTPS in production
        if (rule.name.includes('URL') || rule.name.includes('ENDPOINT') || rule.name.includes('ORIGIN')) {
          if (value.startsWith('http://') && !value.includes('localhost')) {
            result.warnings.push(`⚠️  ${rule.name} should use HTTPS in production`);
          }
        }

        // Check cookie security
        if (rule.name === 'COOKIE_SECURE' && value !== 'true') {
          result.warnings.push(`⚠️  COOKIE_SECURE should be 'true' in production`);
        }
      }

      result.info.push(`✅ ${rule.name} is set`);
    }
  });

  // Additional cross-variable validations
  if (allVars.APPWRITE_ENDPOINT !== allVars.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
    result.warnings.push(`⚠️  APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_ENDPOINT should match`);
  }

  if (allVars.APPWRITE_PROJECT_ID !== allVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    result.warnings.push(`⚠️  APPWRITE_PROJECT_ID and NEXT_PUBLIC_APPWRITE_PROJECT_ID should match`);
  }

  if (allVars.API_URL !== allVars.NEXT_PUBLIC_API_URL) {
    result.warnings.push(`⚠️  API_URL and NEXT_PUBLIC_API_URL should match`);
  }

  return result;
}

function printResults(result: ValidationResult): void {
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');

  if (result.errors.length > 0) {
    console.log(`${colors.red}ERRORS:${colors.reset}`);
    result.errors.forEach((error) => console.log(`  ${error}`));
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}WARNINGS:${colors.reset}`);
    result.warnings.forEach((warning) => console.log(`  ${warning}`));
    console.log('');
  }

  if (result.info.length > 0 && process.argv.includes('--verbose')) {
    console.log(`${colors.blue}INFO:${colors.reset}`);
    result.info.forEach((info) => console.log(`  ${info}`));
    console.log('');
  }

  console.log('='.repeat(80));

  if (result.valid && result.warnings.length === 0) {
    console.log(`${colors.green}✅ All validations passed!${colors.reset}`);
  } else if (result.valid && result.warnings.length > 0) {
    console.log(`${colors.yellow}⚠️  Validation passed with warnings${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Validation failed${colors.reset}`);
  }

  console.log('='.repeat(80) + '\n');
}

function generateEnvTemplate(): void {
  console.log(`${colors.cyan}Generating .env.template from validation rules...${colors.reset}\n`);

  let template = '# Environment Variables Template\n';
  template += '# Generated from validation rules\n';
  template += `# Last updated: ${new Date().toISOString()}\n\n`;

  const categories = {
    'Appwrite Configuration': validationRules.filter((r) => r.name.includes('APPWRITE')),
    'JWT Configuration': validationRules.filter((r) => r.name.includes('JWT')),
    'Server Configuration': validationRules.filter(
      (r) => r.name === 'NODE_ENV' || r.name === 'API_URL' || r.name === 'PORT',
    ),
    'CORS Configuration': validationRules.filter((r) => r.name.includes('CORS')),
    'Cookie Configuration': validationRules.filter((r) => r.name.includes('COOKIE')),
    'Public Variables': validationRules.filter((r) => r.name.startsWith('NEXT_PUBLIC_')),
    'Optional Variables': validationRules.filter((r) => !r.required),
  };

  Object.entries(categories).forEach(([category, rules]) => {
    if (rules.length === 0) return;

    template += `# ${category}\n`;
    rules.forEach((rule) => {
      template += `# ${rule.description}\n`;
      if (rule.required) {
        template += `# Required: Yes\n`;
      }
      if (rule.minLength) {
        template += `# Min length: ${rule.minLength}\n`;
      }
      if (rule.pattern) {
        template += `# Pattern: ${rule.pattern.source}\n`;
      }
      template += `${rule.name}=\n\n`;
    });
  });

  const templatePath = path.join(process.cwd(), '.env.template');
  fs.writeFileSync(templatePath, template);
  console.log(`${colors.green}✅ Template generated at: ${templatePath}${colors.reset}\n`);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);
  const environment = args[0] || process.env.NODE_ENV || 'development';

  // Handle special commands
  if (args.includes('--generate-template')) {
    generateEnvTemplate();
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.cyan}Environment Variables Validation Script${colors.reset}

Usage:
  tsx scripts/validate-env.ts [environment] [options]

Arguments:
  environment    Target environment (development, staging, production)
                 Default: development

Options:
  --verbose      Show all validation info
  --generate-template  Generate .env.template file
  --help, -h     Show this help message

Examples:
  tsx scripts/validate-env.ts development
  tsx scripts/validate-env.ts production --verbose
  tsx scripts/validate-env.ts --generate-template
    `);
    return;
  }

  const result = validateEnvironment(environment);
  printResults(result);

  // Exit with error code if validation failed
  if (!result.valid) {
    process.exit(1);
  }
}

main();
