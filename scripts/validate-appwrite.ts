#!/usr/bin/env tsx

/**
 * Validate Appwrite Configuration Script
 * Run with: pnpm tsx scripts/validate-appwrite.ts
 */
import 'dotenv/config';

import { printValidationResults, validateAppwrite } from '../lib/appwrite/validation';

async function main() {
  console.log('Starting Appwrite validation...\n');

  const result = await validateAppwrite();
  printValidationResults(result);

  if (!result.valid) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Validation script error:', error);
  process.exit(1);
});
