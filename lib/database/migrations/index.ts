/**
 * Migration Registry
 * All migrations must be registered here in chronological order
 */
import { migration as createMigrationsTable } from './20250123_000001_create_migrations_table';
import { migration as createUsersTable } from './20250123_000002_create_users_table';
import { migration as createUserProfilesTable } from './20250123_000003_create_user_profiles_table';
import { migration as createUserPreferencesTable } from './20250123_000004_create_user_preferences_table';
import { migration as createUserSettingsTable } from './20250123_000005_create_user_settings_table';
import { migration as syncSchemaWithAppwriteSchema } from './20251022_000006_sync_schema_with_appwrite_schema';
import { migration as createTransactionsTable } from './20251022_000007_create_transactions_table';
import { migration as createAccountsTable } from './20251022_000008_create_accounts_table';
import { migration as createCreditCardsTable } from './20251022_000009_create_credit_cards_table';
import { Migration } from './migration.interface';

/**
 * All migrations in order of execution
 * IMPORTANT: Never remove or reorder existing migrations
 * Always add new migrations at the end
 */
export const migrations: Migration[] = [
  createMigrationsTable,
  createUsersTable,
  createUserProfilesTable,
  createUserPreferencesTable,
  createUserSettingsTable,
  syncSchemaWithAppwriteSchema,
  createTransactionsTable,
  createAccountsTable,
  createCreditCardsTable,
];
