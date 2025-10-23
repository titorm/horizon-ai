/**
 * Migration: Create users table
 */
import { IndexType } from 'node-appwrite';

import { Migration, MigrationContext } from './migration.interface';

export const migration: Migration = {
  id: '20250123_000002',
  description: 'Create users table',

  async up(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Creating users table...');

    // Create users table
    await databases.createCollection({
      databaseId,
      collectionId: 'users',
      name: 'Users',
      permissions: ['read("any")', 'write("any")'],
      rowSecurity: true, // rowSecurity enabled
    });

    console.log('Creating columns...');

    // auth_user_id - Reference to Appwrite Auth user
    await createStringColumn({
      databaseId,
      collectionId: 'users',
      key: 'auth_user_id',
      size: 255,
      required: true,
    });

    // email
    await databases.createEmailColumn({
      databaseId,
      collectionId: 'users',
      key: 'email',
      required: true,
    });

    // name
    await createStringColumn({
      databaseId,
      collectionId: 'users',
      key: 'name',
      size: 255,
      required: true,
    });

    // created_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'users',
      key: 'created_at',
      required: true,
    });

    // updated_at
    await createDatetimeColumn({
      databaseId,
      collectionId: 'users',
      key: 'updated_at',
      required: true,
    });

    console.log('Creating indexes...');

    // Create unique index on auth_user_id
    await createIndex({
      databaseId,
      collectionId: 'users',
      key: 'idx_auth_user_id',
      type: IndexType.Unique,
      columns: ['auth_user_id'],
    });

    // Create index on email
    await createIndex({
      databaseId,
      collectionId: 'users',
      key: 'idx_email',
      type: IndexType.Key,
      columns: ['email'],
    });

    console.log('✅ Users table created successfully');
  },

  async down(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    console.log('Dropping users table...');

    await databases.deleteCollection({
      databaseId,
      collectionId: 'users',
    });

    console.log('✅ Users table dropped successfully');
  },
};
