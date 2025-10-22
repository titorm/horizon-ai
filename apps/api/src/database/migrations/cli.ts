#!/usr/bin/env node
/**
 * Appwrite Migration CLI
 * Usage:
 *   pnpm migrate:up       - Run all pending migrations
 *   pnpm migrate:down     - Rollback the last migration
 *   pnpm migrate:status   - Show migration status
 *   pnpm migrate:reset    - Rollback ALL migrations (DANGER!)
 */

import { Client } from 'node-appwrite';
import { MigrationRunner } from './migration-runner';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

// Validate required environment variables
const requiredEnvVars = ['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY', 'APPWRITE_DATABASE_ID'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: ${envVar} is not set in environment variables`);
    process.exit(1);
  }
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const runner = new MigrationRunner(client, process.env.APPWRITE_DATABASE_ID!);

// Parse command
const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case 'up':
        await runner.up();
        break;

      case 'down':
        await runner.down();
        break;

      case 'status':
        await runner.status();
        break;

      case 'reset':
        console.log('⚠️  WARNING: This will DELETE ALL DATA!\n');
        console.log('Type "yes" to confirm: ');

        // In production, you'd want to use readline for user input
        // For now, we'll require explicit confirmation via environment variable
        if (process.env.CONFIRM_RESET === 'yes') {
          await runner.reset();
        } else {
          console.log('❌ Reset cancelled. Set CONFIRM_RESET=yes to proceed.');
          process.exit(1);
        }
        break;

      default:
        console.log('Appwrite Migration CLI\n');
        console.log('Commands:');
        console.log('  up      - Run all pending migrations');
        console.log('  down    - Rollback the last migration');
        console.log('  status  - Show migration status');
        console.log('  reset   - Rollback ALL migrations (requires CONFIRM_RESET=yes)');
        console.log('\nUsage:');
        console.log('  pnpm migrate:up');
        console.log('  pnpm migrate:down');
        console.log('  pnpm migrate:status');
        console.log('  CONFIRM_RESET=yes pnpm migrate:reset');
        process.exit(command ? 1 : 0);
    }
  } catch (error) {
    console.error('\n❌ Migration error:');
    console.error(error);
    process.exit(1);
  }
}

main();
