/**
 * Migration: Create user_profiles table
 */
import { IndexType } from 'node-appwrite';

import { Migration, MigrationContext } from './migration.interface';

export const migration: Migration = {
  id: '20250123_000003',
  description: 'Create user profiles table',

  async up(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Creating user_profiles table...');

    // Create user_profiles table
    await databases.createCollection({
      databaseId,
      collectionId: 'user_profiles',
      name: 'User Profiles',
      permissions: ['read("any")', 'write("any")'],
      rowSecurity: true, // rowSecurity enabled
    });

    console.log('Creating columns...');

    // user_id - Foreign key to users table
    await createStringColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'user_id',
      size: 255,
      required: true,
    });

    // bio
    await createStringColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'bio',
      size: 1000,
      required: false,
    });

    // avatar_url
    await databases.createUrlColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'avatar_url',
      required: false,
    });

    // phone
    await createStringColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'phone',
      size: 50,
      required: false,
    });

    // address - JSON string
    await createStringColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'address',
      size: 5000,
      required: false,
    });

    // birthdate
    await createDatetimeColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'birthdate',
      required: false,
    });

    // created_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'created_at',
      required: true,
    });

    // updated_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'user_profiles',
      key: 'updated_at',
      required: true,
    });

    console.log('Creating indexes...');

    // Create unique index on user_id
    await createIndex({
      databaseId,
      collectionId: 'user_profiles',
      key: 'idx_user_id',
      type: IndexType.Unique,
      columns: ['user_id'],
    });

    console.log('✅ User profiles table created successfully');
  },

  async down(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Dropping user_profiles table...');

    await databases.deleteCollection({
      databaseId,
      collectionId: 'user_profiles',
    });

    console.log('✅ User profiles table dropped successfully');
  },
};
