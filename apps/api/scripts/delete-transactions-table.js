const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '../../.env' });

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function deleteTransactionsTable() {
  try {
    console.log('🔍 Checking if transactions table exists...');
    const exists = await databases.getCollection(process.env.APPWRITE_DATABASE_ID, 'transactions');

    console.log('✅ Table exists with', exists.attributes.length, 'columns');
    console.log('📋 Columns:', exists.attributes.map((a) => a.key).join(', '));

    console.log('\n🗑️  Deleting transactions table...');
    await databases.deleteCollection(process.env.APPWRITE_DATABASE_ID, 'transactions');

    console.log('✅ Transactions table deleted successfully!');
  } catch (error) {
    if (error.code === 404) {
      console.log('✅ Table does NOT exist (already clean)');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

deleteTransactionsTable();
