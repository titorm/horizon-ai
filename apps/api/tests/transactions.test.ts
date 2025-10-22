/**
 * Transactions API Tests
 *
 * This file contains test examples for the transactions API
 * You can run these with curl, Postman, or in your test suite
 */

// ============================================
// Test Variables
// ============================================
const API_BASE_URL = 'http://localhost:4000';
const JWT_TOKEN = 'your_jwt_token_here'; // Replace with actual token
const USER_ID = 'user_123'; // Replace with actual user ID

// ============================================
// 1. Create Manual Transaction
// ============================================
/**
 * curl -X POST http://localhost:4000/transactions/manual \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -d '{
 *     "userId": "user_123",
 *     "amount": 150.50,
 *     "type": "expense",
 *     "category": "Alimentação",
 *     "description": "Almoço no restaurante",
 *     "date": "2025-10-22T12:30:00Z",
 *     "merchant": "Restaurante ABC",
 *     "currency": "BRL",
 *     "status": "completed",
 *     "tags": ["almoço", "trabalho"]
 *   }'
 */
export const testCreateManualTransaction = async () => {
  const response = await fetch(`${API_BASE_URL}/transactions/manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
    body: JSON.stringify({
      userId: USER_ID,
      amount: 150.5,
      type: 'expense',
      category: 'Alimentação',
      description: 'Almoço no restaurante',
      date: new Date().toISOString(),
      merchant: 'Restaurante ABC',
      currency: 'BRL',
      status: 'completed',
      tags: ['almoço', 'trabalho'],
    }),
  });

  const data = await response.json();
  console.log('✅ Manual Transaction Created:', data);
  return data;
};

// ============================================
// 2. Create Integration Transaction
// ============================================
/**
 * curl -X POST http://localhost:4000/transactions/integration \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -d '{
 *     "userId": "user_123",
 *     "amount": 5000.00,
 *     "type": "income",
 *     "category": "Salário",
 *     "description": "Salário mensal",
 *     "date": "2025-10-01T00:00:00Z",
 *     "currency": "BRL",
 *     "integrationId": "bank_integration_789",
 *     "integrationData": {
 *       "bankTransactionId": "TXN987654321",
 *       "bankName": "Banco XYZ"
 *     }
 *   }'
 */
export const testCreateIntegrationTransaction = async () => {
  const response = await fetch(`${API_BASE_URL}/transactions/integration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
    body: JSON.stringify({
      userId: USER_ID,
      amount: 5000.0,
      type: 'income',
      category: 'Salário',
      description: 'Salário mensal',
      date: '2025-10-01T00:00:00Z',
      currency: 'BRL',
      integrationId: 'bank_integration_789',
      integrationData: {
        bankTransactionId: 'TXN987654321',
        bankName: 'Banco XYZ',
      },
    }),
  });

  const data = await response.json();
  console.log('✅ Integration Transaction Created:', data);
  return data;
};

// ============================================
// 3. Bulk Create Transactions
// ============================================
/**
 * curl -X POST http://localhost:4000/transactions/integration/bulk \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -d '[
 *     {
 *       "userId": "user_123",
 *       "amount": 50.00,
 *       "type": "expense",
 *       "category": "Transporte",
 *       "date": "2025-10-21T08:00:00Z",
 *       "currency": "BRL",
 *       "integrationId": "bank_integration_789"
 *     }
 *   ]'
 */
export const testBulkCreateTransactions = async () => {
  const transactions = [
    {
      userId: USER_ID,
      amount: 50.0,
      type: 'expense' as const,
      category: 'Transporte',
      description: 'Uber para o trabalho',
      date: '2025-10-21T08:00:00Z',
      currency: 'BRL',
      integrationId: 'bank_integration_789',
    },
    {
      userId: USER_ID,
      amount: 120.5,
      type: 'expense' as const,
      category: 'Alimentação',
      description: 'Almoço',
      date: '2025-10-21T12:00:00Z',
      currency: 'BRL',
      integrationId: 'bank_integration_789',
    },
    {
      userId: USER_ID,
      amount: 30.0,
      type: 'expense' as const,
      category: 'Transporte',
      description: 'Estacionamento',
      date: '2025-10-21T14:00:00Z',
      currency: 'BRL',
      integrationId: 'bank_integration_789',
    },
  ];

  const response = await fetch(`${API_BASE_URL}/transactions/integration/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
    body: JSON.stringify(transactions),
  });

  const data = await response.json();
  console.log('✅ Bulk Transactions Created:', data);
  return data;
};

// ============================================
// 4. List Transactions with Filters
// ============================================
/**
 * curl -X GET "http://localhost:4000/transactions?userId=user_123&type=expense&limit=10" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export const testListTransactions = async () => {
  const params = new URLSearchParams({
    userId: USER_ID,
    type: 'expense',
    limit: '10',
    offset: '0',
  });

  const response = await fetch(`${API_BASE_URL}/transactions?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  const data = await response.json();
  console.log('✅ Transactions Listed:', data);
  return data;
};

// ============================================
// 5. List Transactions by Date Range
// ============================================
/**
 * curl -X GET "http://localhost:4000/transactions?userId=user_123&startDate=2025-10-01&endDate=2025-10-31" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export const testListTransactionsByDateRange = async () => {
  const params = new URLSearchParams({
    userId: USER_ID,
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-10-31T23:59:59Z',
  });

  const response = await fetch(`${API_BASE_URL}/transactions?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  const data = await response.json();
  console.log('✅ Transactions by Date Range:', data);
  return data;
};

// ============================================
// 6. Get Transaction by ID
// ============================================
/**
 * curl -X GET http://localhost:4000/transactions/TRANSACTION_ID \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export const testGetTransactionById = async (transactionId: string) => {
  const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  const data = await response.json();
  console.log('✅ Transaction Retrieved:', data);
  return data;
};

// ============================================
// 7. Update Transaction
// ============================================
/**
 * curl -X PUT http://localhost:4000/transactions/TRANSACTION_ID \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -d '{
 *     "amount": 200.00,
 *     "description": "Descrição atualizada"
 *   }'
 */
export const testUpdateTransaction = async (transactionId: string) => {
  const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
    body: JSON.stringify({
      amount: 200.0,
      description: 'Descrição atualizada',
      category: 'Nova Categoria',
    }),
  });

  const data = await response.json();
  console.log('✅ Transaction Updated:', data);
  return data;
};

// ============================================
// 8. Delete Transaction
// ============================================
/**
 * curl -X DELETE http://localhost:4000/transactions/TRANSACTION_ID \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export const testDeleteTransaction = async (transactionId: string) => {
  const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  if (response.status === 204) {
    console.log('✅ Transaction Deleted Successfully');
    return { success: true };
  }

  const data = await response.json();
  console.log('❌ Delete Failed:', data);
  return data;
};

// ============================================
// 9. Get Transaction Statistics
// ============================================
/**
 * curl -X GET "http://localhost:4000/transactions/stats/user_123?startDate=2025-10-01&endDate=2025-10-31" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export const testGetTransactionStats = async () => {
  const params = new URLSearchParams({
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-10-31T23:59:59Z',
  });

  const response = await fetch(`${API_BASE_URL}/transactions/stats/${USER_ID}?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  const data = await response.json();
  console.log('✅ Transaction Statistics:', data);
  return data;
};

// ============================================
// 10. Search Transactions
// ============================================
/**
 * curl -X GET "http://localhost:4000/transactions?userId=user_123&search=restaurante" \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 */
export const testSearchTransactions = async (searchTerm: string) => {
  const params = new URLSearchParams({
    userId: USER_ID,
    search: searchTerm,
  });

  const response = await fetch(`${API_BASE_URL}/transactions?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  const data = await response.json();
  console.log('✅ Search Results:', data);
  return data;
};

// ============================================
// Run All Tests
// ============================================
export const runAllTests = async () => {
  console.log('🧪 Starting Transaction API Tests...\n');

  try {
    // 1. Create manual transaction
    console.log('Test 1: Create Manual Transaction');
    const manualTx = await testCreateManualTransaction();
    const manualTxId = manualTx.data.$id;

    // 2. Create integration transaction
    console.log('\nTest 2: Create Integration Transaction');
    const integrationTx = await testCreateIntegrationTransaction();

    // 3. Bulk create
    console.log('\nTest 3: Bulk Create Transactions');
    await testBulkCreateTransactions();

    // 4. List transactions
    console.log('\nTest 4: List Transactions');
    await testListTransactions();

    // 5. List by date range
    console.log('\nTest 5: List by Date Range');
    await testListTransactionsByDateRange();

    // 6. Get by ID
    console.log('\nTest 6: Get Transaction by ID');
    await testGetTransactionById(manualTxId);

    // 7. Update transaction
    console.log('\nTest 7: Update Transaction');
    await testUpdateTransaction(manualTxId);

    // 8. Get statistics
    console.log('\nTest 8: Get Statistics');
    await testGetTransactionStats();

    // 9. Search
    console.log('\nTest 9: Search Transactions');
    await testSearchTransactions('restaurante');

    // 10. Delete transaction
    console.log('\nTest 10: Delete Transaction');
    await testDeleteTransaction(manualTxId);

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// ============================================
// Export for use in tests
// ============================================
export default {
  testCreateManualTransaction,
  testCreateIntegrationTransaction,
  testBulkCreateTransactions,
  testListTransactions,
  testListTransactionsByDateRange,
  testGetTransactionById,
  testUpdateTransaction,
  testDeleteTransaction,
  testGetTransactionStats,
  testSearchTransactions,
  runAllTests,
};

// ============================================
// Usage Example
// ============================================
/**
 * To run these tests:
 *
 * 1. Start the API server:
 *    cd apps/api && pnpm dev
 *
 * 2. Get a JWT token by logging in
 *
 * 3. Update the JWT_TOKEN and USER_ID variables above
 *
 * 4. Run the tests:
 *    node -r ts-node/register apps/api/tests/transactions.test.ts
 *
 * Or import in your test suite:
 *    import transactionTests from './transactions.test';
 *    await transactionTests.runAllTests();
 */
