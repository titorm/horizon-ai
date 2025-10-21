import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

// Carregar .env da raiz do monorepo
const envPath = process.env.DATABASE_URL 
  ? '.'
  : (process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), '.env') 
    : path.join(process.cwd(), '.env.local'));

dotenv.config({ path: envPath });

export default {
  schema: './apps/api/src/database/schema.ts',
  out: './apps/api/src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
