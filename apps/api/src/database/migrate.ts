import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate as dbMigrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dns from 'dns/promises';

const monoRepoRoot = path.resolve(__dirname, '../../../..');
const envFileLocal = path.join(monoRepoRoot, '.env.local');
const envFileDefault = path.join(monoRepoRoot, '.env');
const envFile = fs.existsSync(envFileLocal) ? envFileLocal : envFileDefault;
if (!fs.existsSync(envFile)) {
  console.warn(`No env file found at ${envFileLocal} or ${envFileDefault}. Proceeding with process.env`);
} else {
  dotenv.config({ path: envFile });
}

const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_URL } =
  process.env as Record<string, string | undefined>;

console.log({ DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_URL });
const migrate = async () => {
  console.log('=== Starting Migration ===');

  await migrateDatabase();

  console.log('=== Completed Migration ===');
  process.exit();
};

const migrateDatabase = async () => {
  console.log(`=== Migrating ===`);

  let pool;

  if (DATABASE_URL && DATABASE_URL.length > 0) {
    try {
      const url = new URL(DATABASE_URL);
      const host = url.hostname;
      try {
        await dns.lookup(host);
      } catch (err: any) {
        const forceLocal = process.env.MIGRATE_FORCE_LOCAL === 'true';
        console.warn(`DNS lookup failed for host '${host}': ${err.code || err.message}`);
        if (forceLocal) {
          console.warn('MIGRATE_FORCE_LOCAL=true -> falling back to localhost');
        } else {
          console.error(
            `Host '${host}' is not resolvable. Set MIGRATE_FORCE_LOCAL=true to fallback to localhost or fix DNS.`,
          );
          throw err;
        }
      }
    } catch (err) {
      if (!(process.env.MIGRATE_FORCE_LOCAL === 'true')) {
        throw err;
      }
    }

    if (process.env.MIGRATE_FORCE_LOCAL === 'true') {
      const password =
        typeof DATABASE_PASSWORD === 'string' && DATABASE_PASSWORD.length > 0 ? DATABASE_PASSWORD : 'postgres';
      pool = new Pool({
        host: DATABASE_HOST || 'localhost',
        port: DATABASE_PORT ? parseInt(DATABASE_PORT as string, 10) : 5432,
        database: DATABASE_NAME || 'postgres',
        user: DATABASE_USERNAME || 'postgres',
        password,
        max: 1,
      });
    } else {
      pool = new Pool({ connectionString: DATABASE_URL, max: 1 } as any);
    }
  } else {
    const password =
      typeof DATABASE_PASSWORD === 'string' && DATABASE_PASSWORD.length > 0 ? DATABASE_PASSWORD : 'postgres';
    pool = new Pool({
      host: DATABASE_HOST || 'localhost',
      port: DATABASE_PORT ? parseInt(DATABASE_PORT as string, 10) : 5432,
      database: DATABASE_NAME || 'postgres',
      user: DATABASE_USERNAME || 'postgres',
      password,
      max: 1,
    });
  }

  const db = drizzle(pool as any, { casing: 'snake_case' });

  await dbMigrate(db, {
    migrationsFolder: path.join(__dirname, 'migrations'),
    migrationsSchema: 'db_migrations',
    migrationsTable: 'db_migrations',
  });

  console.log(`=== Migrated ===`);

  return db;
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
