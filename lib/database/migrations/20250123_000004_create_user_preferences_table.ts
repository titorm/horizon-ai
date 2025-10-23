/**
 * Migration: Create user_preferences table
 */
import { IndexType } from 'node-appwrite';

import { Migration, MigrationContext } from './migration.interface';

export const migration: Migration = {
  id: '20250123_000004',
  description: 'Create user preferences table',

  async up(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Creating user_preferences table...');

    // Create user_preferences table
    await databases.createCollection({
      databaseId,
      collectionId: 'user_preferences',
      name: 'User Preferences',
      permissions: ['read("any")', 'write("any")'],
      rowSecurity: true, // rowSecurity enabled
    });

    console.log('Creating columns...');

    // user_id - Foreign key to users table
    await createStringColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'user_id',
      size: 255,
      required: true,
    });

    // theme - enum: light, dark, system
    await createEnumColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'theme',
      elements: ['light', 'dark', 'system'],
      required: true,
    });

    // language
    await createStringColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'language',
      size: 10,
      required: true,
    });

    // currency
    await createStringColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'currency',
      size: 10,
      required: true,
    });

    // timezone
    await createStringColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'timezone',
      size: 100,
      required: true,
    });

    // notifications - JSON string
    await createStringColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'notifications',
      size: 5000,
      required: true,
    });

    // created_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'created_at',
      required: true,
    });

    // updated_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'user_preferences',
      key: 'updated_at',
      required: true,
    });

    console.log('Creating indexes...');

    // Create unique index on user_id
    await createIndex({
      databaseId,
      collectionId: 'user_preferences',
      key: 'idx_user_id',
      type: IndexType.Unique,
      columns: ['user_id'],
    });

    console.log('✅ User preferences table created successfully');
  },

  async down(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Dropping user_preferences table...');

    await databases.deleteCollection({
      databaseId,
      collectionId: 'user_preferences',
    });

    console.log('✅ User preferences table dropped successfully');
  },
};
