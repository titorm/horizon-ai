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

## Documentation

See `/docs/MIGRATIONS.md` for complete guide.

See `/docs/MIGRATIONS-QUICK-REF.md` for quick reference.

## Creating New Migration

1. Create file: `YYYYMMDD_NNNNNN_description.ts`
2. Implement `up()` and `down()` methods
3. Register in `index.ts`
4. Run `pnpm migrate:up`

## Environment Variables

Required in `.env`:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
```
