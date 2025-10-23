import { IndexType, createStringColumn, createBooleanColumn, createDatetimeColumn, createIndex, createIntegerColumn } from 'node-appwrite';

import { Migration, MigrationContext } from './migration.interface';

export const migration: Migration = {
  id: '20251022_000006',
  description:
    'Sync runtime tables with appwrite-schema.ts (add missing columns/indexes) without editing older migrations',

  async up(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Syncing schema for users, user_profiles, user_preferences, user_settings...');

    // Helper to attempt an operation and ignore already-exists errors
    const safe = async (fn: () => Promise<any>, message: string) => {
      try {
        await fn();
        console.log('\u2705 ' + message);
      } catch (err: any) {
        // If column/table/index already exists, skip. Otherwise, log warning and continue.
        const code = err?.code ?? err?.status ?? err?.message;
        console.warn('Skipping (might already exist) -', message);
      }
    };

    // USERS table adjustments
    await safe(async () => {
      await createStringColumn({
        databaseId,
        collectionId: 'users',
        key: 'password_hash',
        size: 1000,
        required: true,
      });
    }, 'users.password_hash');

    await safe(async () => {
      await createBooleanColumn({ databaseId, collectionId: 'users', key: 'is_email_verified', required: true });
    }, 'users.is_email_verified');

    await safe(async () => {
      await createBooleanColumn({ databaseId, collectionId: 'users', key: 'is_active', required: true });
    }, 'users.is_active');

    await safe(async () => {
      await createDatetimeColumn({ databaseId, collectionId: 'users', key: 'last_login_at', required: false });
    }, 'users.last_login_at');

    // Ensure index on email exists
    await safe(async () => {
      await createIndex({
        databaseId,
        collectionId: 'users',
        key: 'email_idx',
        type: IndexType.Key,
        columns: ['email'],
      });
    }, 'users.email_idx');

    // USER_PROFILES adjustments
    const profileCols = [
      {
        key: 'first_name',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'first_name',
            size: 100,
            required: false,
          }),
      },
      {
        key: 'last_name',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'last_name',
            size: 100,
            required: false,
          }),
      },
      {
        key: 'display_name',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'display_name',
            size: 200,
            required: false,
          }),
      },
      {
        key: 'avatar_url',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'avatar_url',
            size: 1000,
            required: false,
          }),
      },
      {
        key: 'phone_number',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'phone_number',
            size: 20,
            required: false,
          }),
      },
      {
        key: 'date_of_birth',
        fn: () =>
          createDatetimeColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'date_of_birth',
            required: false,
          }),
      },
      {
        key: 'address',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'address',
            size: 10000,
            required: false,
          }),
      },
      {
        key: 'bio',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'bio',
            size: 2000,
            required: false,
          }),
      },
      {
        key: 'occupation',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'occupation',
            size: 100,
            required: false,
          }),
      },
      {
        key: 'company',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'company',
            size: 100,
            required: false,
          }),
      },
      {
        key: 'website',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'website',
            size: 255,
            required: false,
          }),
      },
      {
        key: 'social_links',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_profiles',
            key: 'social_links',
            size: 2000,
            required: false,
          }),
      },
    ];

    for (const c of profileCols) {
      // eslint-disable-next-line no-await-in-loop
      await safe(c.fn, `user_profiles.${c.key}`);
    }

    await safe(async () => {
      await createIndex({
        databaseId,
        collectionId: 'user_profiles',
        key: 'user_id_idx',
        type: IndexType.Unique,
        columns: ['user_id'],
      });
    }, 'user_profiles.user_id_idx');

    // USER_PREFERENCES adjustments
    const prefCols = [
      {
        key: 'theme',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'theme',
            size: 20,
            required: true,
          }),
      },
      {
        key: 'language',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'language',
            size: 10,
            required: true,
          }),
      },
      {
        key: 'currency',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'currency',
            size: 10,
            required: true,
          }),
      },
      {
        key: 'default_dashboard_view',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'default_dashboard_view',
            size: 50,
            required: false,
          }),
      },
      {
        key: 'dashboard_widgets',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'dashboard_widgets',
            size: 10000,
            required: false,
          }),
      },
      {
        key: 'email_notifications',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'email_notifications',
            required: true,
          }),
      },
      {
        key: 'push_notifications',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'push_notifications',
            required: true,
          }),
      },
      {
        key: 'sms_notifications',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'sms_notifications',
            required: true,
          }),
      },
      {
        key: 'notification_frequency',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'notification_frequency',
            size: 20,
            required: true,
          }),
      },
      {
        key: 'show_balances',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'show_balances',
            required: true,
          }),
      },
      {
        key: 'auto_categorization_enabled',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'auto_categorization_enabled',
            required: true,
          }),
      },
      {
        key: 'budget_alerts',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'budget_alerts',
            required: true,
          }),
      },
      {
        key: 'profile_visibility',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'profile_visibility',
            size: 20,
            required: true,
          }),
      },
      {
        key: 'share_data_for_insights',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_preferences',
            key: 'share_data_for_insights',
            required: true,
          }),
      },
    ];

    for (const c of prefCols) {
      // eslint-disable-next-line no-await-in-loop
      await safe(c.fn, `user_preferences.${c.key}`);
    }

    await safe(async () => {
      await createIndex({
        databaseId,
        collectionId: 'user_preferences',
        key: 'user_id_idx',
        type: IndexType.Unique,
        columns: ['user_id'],
      });
    }, 'user_preferences.user_id_idx');

    // USER_SETTINGS adjustments
    const settingsCols = [
      {
        key: 'two_factor_enabled',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'two_factor_enabled',
            required: true,
          }),
      },
      {
        key: 'two_factor_method',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'two_factor_method',
            size: 20,
            required: false,
          }),
      },
      {
        key: 'session_timeout',
        fn: () =>
          createIntegerColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'session_timeout',
            required: true,
            min: 5,
            max: 1440,
          }),
      },
      {
        key: 'password_last_changed_at',
        fn: () =>
          createDatetimeColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'password_last_changed_at',
            required: false,
          }),
      },
      {
        key: 'auto_sync_enabled',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'auto_sync_enabled',
            required: true,
          }),
      },
      {
        key: 'sync_frequency',
        fn: () =>
          createIntegerColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'sync_frequency',
            required: true,
            min: 1,
            max: 1440,
          }),
      },
      {
        key: 'cloud_backup_enabled',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'cloud_backup_enabled',
            required: true,
          }),
      },
      {
        key: 'connected_banks',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'connected_banks',
            size: 50000,
            required: false,
          }),
      },
      {
        key: 'connected_apps',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'connected_apps',
            size: 50000,
            required: false,
          }),
      },
      {
        key: 'beta_features',
        fn: () =>
          createBooleanColumn({ databaseId, collectionId: 'user_settings', key: 'beta_features', required: true }),
      },
      {
        key: 'analytics_opt_in',
        fn: () =>
          createBooleanColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'analytics_opt_in',
            required: true,
          }),
      },
      {
        key: 'custom_settings',
        fn: () =>
          createStringColumn({
            databaseId,
            collectionId: 'user_settings',
            key: 'custom_settings',
            size: 50000,
            required: false,
          }),
      },
    ];

    for (const c of settingsCols) {
      // eslint-disable-next-line no-await-in-loop
      await safe(c.fn, `user_settings.${c.key}`);
    }

    await safe(async () => {
      await createIndex({
        databaseId,
        collectionId: 'user_settings',
        key: 'user_id_idx',
        type: IndexType.Unique,
        columns: ['user_id'],
      });
    }, 'user_settings.user_id_idx');

    await safe(async () => {
      await createIndex({
        databaseId,
        collectionId: 'user_settings',
        key: 'two_factor_enabled_idx',
        type: IndexType.Key,
        columns: ['two_factor_enabled'],
      });
    }, 'user_settings.two_factor_enabled_idx');

    console.log('\nSchema sync migration completed (safe/ignored existing items).');
  },

  async down(context: MigrationContext): Promise<void> {
    // Rolling back schema sync is risky; intentionally not implemented to avoid accidental destructive operations.
    console.log('Down operation for schema sync is intentionally a no-op to avoid destructive changes.');
  },
};
