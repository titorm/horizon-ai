import { Account, Client, Databases, ID, TablesDB } from 'node-appwrite';

import AppwriteDBAdapter from './adapter';

// Appwrite client instance
let client: Client | null = null;
let account: Account | null = null;
let databases: Databases | TablesDB | null = null;
let tables: TablesDB | null = null;
let dbAdapter: AppwriteDBAdapter | null = null;

/**
 * Initialize Appwrite client
 * Must be called after environment variables are loaded
 */
export function initializeAppwrite() {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    throw new Error(
      'Appwrite configuration missing. Required: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY',
    );
  }

  client = new Client();
  client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

  account = new Account(client);
  databases = new Databases(client);
  // Try TablesDB if available in SDK
  try {
    tables = new TablesDB(client);
    // prefer tables when SDK supports it
    databases = tables;
  } catch (err) {
    // ignore, fall back to Databases
    tables = null;
  }

  // Wrap with adapter so legacy call sites keep working
  dbAdapter = new AppwriteDBAdapter(databases);

  console.log('✅ Appwrite client initialized successfully');
  console.log('   Endpoint:', endpoint);
  console.log('   Project ID:', projectId);

  // Return databases adapter under `databases` so existing injected consumers work
  return { client, account, databases: dbAdapter };
}

/**
 * Get Appwrite client instance
 */
export function getAppwriteClient(): Client {
  if (!client) {
    throw new Error('Appwrite client not initialized. Call initializeAppwrite() first.');
  }
  return client;
}

/**
 * Get Appwrite Account service
 */
export function getAppwriteAccount(): Account {
  if (!account) {
    throw new Error('Appwrite client not initialized. Call initializeAppwrite() first.');
  }
  return account;
}

/**
 * Get Appwrite Databases service
 */
export function getAppwriteDatabases(): any {
  if (!dbAdapter) {
    throw new Error('Appwrite client not initialized. Call initializeAppwrite() first.');
  }
  return dbAdapter;
}

/**
 * Get raw TablesDB instance when available. Throws if TablesDB is not supported.
 */
export function getAppwriteTables(): TablesDB {
  if (!tables) {
    throw new Error('TablesDB is not available in the current Appwrite SDK instance.');
  }
  return tables;
}

/**
 * Generate unique ID for Appwrite
 */
export function generateId(): string {
  return ID.unique();
}

export { Client, Account, Databases, ID };
