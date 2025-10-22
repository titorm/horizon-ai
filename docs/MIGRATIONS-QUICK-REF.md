# Appwrite Migration Quick Reference

## Commands

```bash
# Run all pending migrations
pnpm migrate:up

# Show migration status
pnpm migrate:status

# Rollback last migration
pnpm migrate:down

# Reset database (DANGER - requires confirmation)
CONFIRM_RESET=yes pnpm migrate:reset
```

## Create New Migration Template

```typescript
// apps/api/src/database/migrations/YYYYMMDD_NNNNNN_description.ts
import { IndexType } from 'node-appwrite';
import { Migration, MigrationContext } from './migration.interface';

export const migration: Migration = {
  id: 'YYYYMMDD_NNNNNN_description',
  description: 'Human readable description',

  async up(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    // 1. Create collection
    await databases.createCollection({
      databaseId,
      collectionId: 'collection_name',
      name: 'Collection Display Name',
      permissions: ['read("any")', 'write("any")'],
      documentSecurity: true,
      enabled: true,
    });

    // 2. Add attributes
    await databases.createStringAttribute({
      databaseId,
      collectionId: 'collection_name',
      key: 'field_name',
      size: 255,
      required: true,
    });

    // 3. Create indexes
    await databases.createIndex({
      databaseId,
      collectionId: 'collection_name',
      key: 'idx_field_name',
      type: IndexType.Key,
      attributes: ['field_name'],
    });

    console.log('✅ Migration completed');
  },

  async down(context: MigrationContext): Promise<void> {
    const { databases, databaseId } = context;

    await databases.deleteCollection({
      databaseId,
      collectionId: 'collection_name',
    });

    console.log('✅ Rollback completed');
  },
};
```

## Attribute Types Cheat Sheet

```typescript
// String (text, JSON, etc.)
await databases.createStringAttribute({
  databaseId, collectionId, key: 'name', size: 255, required: true,
});

// Email
await databases.createEmailAttribute({
  databaseId, collectionId, key: 'email', required: true,
});

// Boolean
await databases.createBooleanAttribute({
  databaseId, collectionId, key: 'is_active', required: true, xdefault: false,
});

// Integer
await databases.createIntegerAttribute({
  databaseId, collectionId, key: 'count', required: true, min: 0, max: 100,
});

// Float
await databases.createFloatAttribute({
  databaseId, collectionId, key: 'price', required: true, min: 0,
});

// DateTime
await databases.createDatetimeAttribute({
  databaseId, collectionId, key: 'created_at', required: true,
});

// Enum
await databases.createEnumAttribute({
  databaseId, collectionId, key: 'status',
  elements: ['active', 'inactive'], required: true, xdefault: 'active',
});

// URL
await databases.createUrlAttribute({
  databaseId, collectionId, key: 'website', required: false,
});
```

## Index Types

```typescript
// Unique - No duplicates allowed
type: IndexType.Unique

// Key - Fast queries
type: IndexType.Key

// Fulltext - Text search
type: IndexType.Fulltext
```

## Register Migration

Add to `apps/api/src/database/migrations/index.ts`:

```typescript
import { migration as newMigration } from './YYYYMMDD_NNNNNN_description';

export const migrations: Migration[] = [
  // ... existing migrations
  newMigration, // Add at the end
];
```

## Common Patterns

### Add Column to Existing Table

```typescript
async up(context) {
  await context.databases.createStringAttribute({
    databaseId: context.databaseId,
    collectionId: 'existing_table',
    key: 'new_column',
    size: 100,
    required: false,
  });
}

async down(context) {
  await context.databases.deleteAttribute({
    databaseId: context.databaseId,
    collectionId: 'existing_table',
    key: 'new_column',
  });
}
```

### Add Index

```typescript
async up(context) {
  await context.databases.createIndex({
    databaseId: context.databaseId,
    collectionId: 'table_name',
    key: 'idx_column_name',
    type: IndexType.Key,
    attributes: ['column_name'],
  });
}

async down(context) {
  await context.databases.deleteIndex({
    databaseId: context.databaseId,
    collectionId: 'table_name',
    key: 'idx_column_name',
  });
}
```

## Best Practices

1. ✅ Never modify existing migrations
2. ✅ Always implement `down()` method
3. ✅ Test locally before deploying
4. ✅ Use descriptive migration names
5. ✅ Keep migrations atomic (one logical change)
6. ✅ Run `migrate:status` to verify state
7. ❌ Don't use `default` - use `xdefault` for required fields
8. ❌ Don't add default values to optional (required: false) fields

## Environment Variables Required

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
```

## Troubleshooting

### Migration Failed

1. Check error message
2. Fix migration code
3. Clean up partial changes in Appwrite Console
4. Re-run migration

### Check What's Applied

```bash
pnpm migrate:status
```

### Start Fresh (Development Only)

```bash
CONFIRM_RESET=yes pnpm migrate:reset
pnpm migrate:up
```

## Current Database Schema

```
migrations          - Tracks applied migrations
users               - User accounts
user_profiles       - User profile data
user_preferences    - User preferences (theme, language, etc.)
user_settings       - User settings (security, privacy, etc.)
```
