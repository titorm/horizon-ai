/**
 * Migration: Create user_settings table
 */
import { IndexType } from 'node-appwrite';

import { Migration, MigrationContext } from './migration.interface';

export const migration: Migration = {
  id: '20250123_000005',
  description: 'Create user settings table',

  async up(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Creating user_settings table...');

    // Create user_settings table
    // await databases.createCollection({
    //   databaseId,
    //   collectionId: 'user_settings',
    //   name: 'User Settings',
    //   permissions: ['read("any")', 'write("any")'],
    //   rowSecurity: true, // rowSecurity enabled
    // });

    console.log('Creating columns...');

    // user_id - Foreign key to users table
    // await createStringColumn({
    //   databaseId,
    //   collectionId: 'user_settings',
    //   key: 'user_id',
    //   size: 255,
    //   required: true,
    // });

    // two_factor_enabled
    await createBooleanColumn({
      databaseId,
      collectionId: 'user_settings',
      key: 'two_factor_enabled',
      required: true,
    });

    // email_verified
    await createBooleanColumn({
      databaseId,
      collectionId: 'user_settings',
      key: 'email_verified',
      required: true,
    });

    // phone_verified
    await createBooleanColumn({
      databaseId,
      collectionId: 'user_settings',
      key: 'phone_verified',
      required: true,
    });

    // marketing_emails
    await createBooleanColumn({
      databaseId,
      collectionId: 'user_settings',
      key: 'marketing_emails',
      required: true,
    });

    // privacy_settings - JSON string
    await createStringColumn({
      databaseId,
      collectionId: 'user_settings',
      key: 'privacy_settings',
      size: 5000,
      required: true,
    });

    // created_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'user_settings',
      key: 'created_at',
      required: true,
    });

    // updated_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'user_settings',
      key: 'updated_at',
      required: true,
    });

    console.log('Creating indexes...');

    // Create unique index on user_id
    await createIndex({
      databaseId,
      collectionId: 'user_settings',
      key: 'idx_user_id',
      type: IndexType.Unique,
      columns: ['user_id'],
    });

    console.log('✅ User settings table created successfully');
  },

  async down(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Dropping user_settings table...');

    await databases.deleteCollection({
      databaseId,
      collectionId: 'user_settings',
    });

    console.log('✅ User settings table dropped successfully');
  },
};
