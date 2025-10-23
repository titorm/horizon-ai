# Appwrite Migrations

This directory contains all database schema migrations for the Horizon AI project.

## Quick Start

```bash
# Check migration status
pnpm migrate:status

# Run all pending migrations
pnpm migrate:up

# Rollback last migration
pnpm migrate:down
```

## What's Here

- `migration.interface.ts` - TypeScript interfaces
- `migration-runner.ts` - Migration execution engine
- `cli.ts` - Command-line interface
- `index.ts` - Migration registry (add new migrations here)
- `20250123_*` - Individual migration files

## Current Migrations

1. `20250123_000001_create_migrations_table.ts` - Migration tracking
2. `20250123_000002_create_users_table.ts` - User accounts
3. `20250123_000003_create_user_profiles_table.ts` - User profiles
4. `20250123_000004_create_user_preferences_table.ts` - User preferences
5. `20250123_000005_create_user_settings_table.ts` - User settings
6. `20251022_000006_sync_schema_with_appwrite_schema.ts` - Schema sync
7. `20251022_000007_create_transactions_table.ts` - Transactions
8. `20251022_000008_create_accounts_table.ts` - Accounts
9. `20251022_000009_create_credit_cards_table.ts` - Credit cards

## Documentation

See `/docs/MIGRATIONS.md` for complete guide.

See `/docs/MIGRATIONS-QUICK-REF.md` for quick reference.

## Creating New Migration (concise workflow)

1. Create a new migration file under this folder and prefix it with a timestamp: `YYYYMMDD_NNNNNN_description.ts`.
2. Implement `up(context: MigrationContext)` and `down(context: MigrationContext)` using the provided APIs.
3. Register the migration in `index.ts` by importing it and appending it to the end of the `migrations` array.
4. Commit the migration file and the `index.ts` change together.
5. Run `pnpm migrate:up`.

What happens when you run `migrate:up`:

- The runner will apply pending migrations in order.

- It will append applied migration ids to `applied-migrations.json` (this file is authoritative to prevent edits of already-applied migrations).

- It will also attempt to write a record to the `migrations` table in Appwrite (best-effort).

Rules:

- NEVER edit migrations that are present in `applied-migrations.json`.

- To change an applied schema, create a new migration that performs the required incremental changes.

## Environment Variables

Required in `.env.local`:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
```
