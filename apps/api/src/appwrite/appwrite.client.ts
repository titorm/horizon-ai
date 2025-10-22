import { Client, Account, Databases, ID } from 'node-appwrite';

// Appwrite client instance
let client: Client | null = null;
let account: Account | null = null;
let databases: Databases | null = null;

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

  console.log('✅ Appwrite client initialized successfully');
  console.log('   Endpoint:', endpoint);
  console.log('   Project ID:', projectId);

  return { client, account, databases };
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
export function getAppwriteDatabases(): Databases {
  if (!databases) {
    throw new Error('Appwrite client not initialized. Call initializeAppwrite() first.');
  }
  return databases;
}

/**
 * Generate unique ID for Appwrite
 */
export function generateId(): string {
  return ID.unique();
}

export { Client, Account, Databases, ID };
