import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Carregar .env.local ou .env da raiz do monorepo
const envFileLocal = path.resolve('.env.local');
const envFileDefault = path.resolve('.env');
const envFile = fs.existsSync(envFileLocal) ? envFileLocal : envFileDefault;

console.log(`Loading environment from: ${envFile}`);
dotenv.config({ path: envFile });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL não está configurada. Configure em .env ou .env.local');
}

export default {
  schema: './apps/api/src/database/schema.ts',
  out: './apps/api/src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
