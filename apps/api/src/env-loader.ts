/**
 * Environment loader for development
 * This file loads .env.local before any other imports
 */
import { config } from 'dotenv';
import { resolve } from 'path';

// Load from turborepo root
const envLocalPath = resolve(__dirname, '../../../.env.local');
const envPath = resolve(__dirname, '../../../.env');

console.log('🔧 Loading environment variables...');

// Try .env.local first (development), then .env (fallback)
const result = config({ path: envLocalPath });
if (result.error) {
  console.log('   .env.local not found, trying .env...');
  const fallbackResult = config({ path: envPath });
  if (fallbackResult.error) {
    console.warn('⚠️  No .env file found. Using system environment variables.');
  } else {
    console.log('✅ Loaded from .env');
  }
} else {
  console.log('✅ Loaded from .env.local');
}

// Validate critical variables for Appwrite
const requiredVars = ['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY', 'JWT_SECRET'];
const missingVars = requiredVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error('\nPlease set these variables in .env.local or .env at the root of the turborepo.');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully\n');
