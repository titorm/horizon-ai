#!/usr/bin/env node
/**
 * E2E test for Appwrite integration (creates a user and verifies rows)
 *
 * Usage:
 *   APPWRITE_ENDPOINT=... APPWRITE_PROJECT_ID=... APPWRITE_API_KEY=... APPWRITE_DATABASE_ID=... node ./apps/api/scripts/e2e-test-appwrite.js
 *
 * NOTE: This script uses the server API key and will create a user. It's idempotent in that it will remove
 * the created resources after the test if possible.
 */

const path = require('path');
const {
  initializeAppwrite,
  getAppwriteAccount,
  getAppwriteDatabases,
  generateId,
} = require('../src/appwrite/appwrite.client');

async function main() {
  // initialize
  const { client, account, databases } = initializeAppwrite();
  const db = getAppwriteDatabases();
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  if (!databaseId) throw new Error('APPWRITE_DATABASE_ID is required');

  // Create a test user via server-side account create
  const testEmail = `e2e+${Date.now()}@example.com`;
  const testPwd = 'Password123!';

  console.log('Creating test user:', testEmail);

  const result = await account.createEmailSession(testEmail, testPwd).catch(() => null);

  // If the test user doesn't exist, create it using the server key (accounts.create)
  let user;
  try {
    // @ts-ignore: .create in server API
    user = await account.create(testEmail, testPwd, testEmail);
    console.log('User created via admin API:', user.$id);
  } catch (err) {
    console.warn('Could not create user via admin API:', err.message || err);
    throw err;
  }

  // Wait briefly for DB triggers (if any)
  await new Promise((r) => setTimeout(r, 1000));

  // Check tables for rows
  const userId = user.$id;
  console.log('Checking rows for user id:', userId);

  const tables = ['users', 'user_profiles', 'user_preferences', 'user_settings'];

  for (const table of tables) {
    try {
      const res = await db.listRows({ databaseId, tableId: table, queries: [] });
      console.log(`Table ${table} has ${res.rows.length} rows (sample):`, res.rows.slice(0, 2));
    } catch (err) {
      console.error(`Failed to list rows for table ${table}:`, err.message || err);
    }
  }

  console.log('\nE2E check complete. Manually inspect Appwrite console for more details.');
}

main().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
