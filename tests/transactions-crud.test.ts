/**
 * Transactions CRUD Tests
 *
 * Manual test script for validating transactions CRUD functionality
 * Run with: tsx tests/transactions-crud.test.ts
 *
 * Prerequisites: User must be logged in and have an account
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  data?: any;
}

const results: TestResult[] = [];

// Test data
let authToken: string | null = null;
let testAccountId: string | null = null;
let createdTransactionId: string | null = null;
let userId: string | null = null;

// Helper function to log results
function logResult(result: TestResult) {
  results.push(result);
  const icon = result.passed ? '✅' : '❌';
  console.log(`${icon} ${result.name}: ${result.message}`);
  if (result.data) {
    console.log('   Data:', JSON.stringify(result.data, null, 2));
  }
}

// Setup: Login and create test account
async function setupAuth() {
  console.log('🔐 Setting up authentication and test account...');

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
  };

  try {
    // Register user
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    if (!registerResponse.ok) {
      throw new Error('Failed to register test user');
    }

    const registerData = await registerResponse.json();
    userId = registerData.user?.id;

    // Extract token from cookie
    const setCookie = registerResponse.headers.get('set-cookie');
    const match = setCookie?.match(/auth_token=([^;]+)/);
    authToken = match ? match[1] : null;

    if (!authToken) {
      throw new Error('Failed to get auth token');
    }

    // Create test account
    const accountResponse = await fetch(`${API_BASE_URL}/api/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${authToken}`,
      },
      body: JSON.stringify({
        name: `Test Account ${Date.now()}`,
        type: 'CHECKING',
        balance: 5000,
        currency: 'BRL',
      }),
    });

    if (!accountResponse.ok) {
      throw new Error('Failed to create test account');
    }

    const accountData = await accountResponse.json();
    testAccountId = accountData.id;

    console.log('✅ Authentication and test account setup complete\n');
  } catch (error: any) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Test 1: Create manual transaction
async function testCreateTransaction() {
  console.log('\n📝 Test 1: Create Manual Transaction');

  const transaction = {
    accountId: testAccountId,
    amount: 150.5,
    type: 'EXPENSE',
    category: 'Alimentação',
    description: 'Almoço no restaurante',
    date: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${authToken}`,
      },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      createdTransactionId = data.id;
      logResult({
        name: 'Create Transaction',
        passed: true,
        message: 'Transaction created successfully',
        data: {
          id: data.id,
          amount: data.amount,
          type: data.type,
          category: data.category,
        },
      });
    } else {
      logResult({
        name: 'Create Transaction',
        passed: false,
        message: data.message || 'Transaction creation failed',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Create Transaction',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 2: List transactions
async function testListTransactions() {
  console.log('\n📋 Test 2: List Transactions');

  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      const hasCreatedTransaction = data.some((tx: any) => tx.id === createdTransactionId);
      logResult({
        name: 'List Transactions',
        passed: hasCreatedTransaction,
        message: hasCreatedTransaction
          ? `Successfully listed ${data.length} transaction(s), including created transaction`
          : `Listed ${data.length} transaction(s), but created transaction not found`,
        data: { count: data.length, hasCreatedTransaction },
      });
    } else {
      logResult({
        name: 'List Transactions',
        passed: false,
        message: 'Failed to list transactions',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'List Transactions',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 3: List transactions with filters
async function testListTransactionsWithFilters() {
  console.log('\n🔍 Test 3: List Transactions with Filters');

  try {
    const params = new URLSearchParams({
      type: 'EXPENSE',
      limit: '10',
    });

    const response = await fetch(`${API_BASE_URL}/api/transactions?${params}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      const allExpenses = data.every((tx: any) => tx.type === 'EXPENSE');
      logResult({
        name: 'List Transactions with Filters',
        passed: allExpenses || data.length === 0,
        message:
          allExpenses || data.length === 0
            ? `Successfully filtered ${data.length} expense transaction(s)`
            : 'Filter not working correctly',
        data: { count: data.length, allExpenses },
      });
    } else {
      logResult({
        name: 'List Transactions with Filters',
        passed: false,
        message: 'Failed to list filtered transactions',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'List Transactions with Filters',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 4: Get transaction by ID
async function testGetTransactionById() {
  console.log('\n🔍 Test 4: Get Transaction by ID');

  if (!createdTransactionId) {
    logResult({
      name: 'Get Transaction by ID',
      passed: false,
      message: 'No transaction ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${createdTransactionId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.id === createdTransactionId) {
      logResult({
        name: 'Get Transaction by ID',
        passed: true,
        message: 'Successfully retrieved transaction',
        data: {
          id: data.id,
          amount: data.amount,
          type: data.type,
        },
      });
    } else {
      logResult({
        name: 'Get Transaction by ID',
        passed: false,
        message: 'Failed to retrieve transaction',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Get Transaction by ID',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 5: Update transaction
async function testUpdateTransaction() {
  console.log('\n✏️ Test 5: Update Transaction');

  if (!createdTransactionId) {
    logResult({
      name: 'Update Transaction',
      passed: false,
      message: 'No transaction ID available',
    });
    return;
  }

  const updates = {
    amount: 200.75,
    description: 'Updated: Jantar no restaurante',
    category: 'Restaurantes',
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${createdTransactionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${authToken}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.ok && data.id === createdTransactionId) {
      const amountUpdated = Math.abs(data.amount - updates.amount) < 0.01;
      const descriptionUpdated = data.description === updates.description;

      logResult({
        name: 'Update Transaction',
        passed: amountUpdated && descriptionUpdated,
        message:
          amountUpdated && descriptionUpdated ? 'Transaction updated successfully' : 'Transaction update incomplete',
        data: {
          id: data.id,
          amount: data.amount,
          description: data.description,
          amountUpdated,
          descriptionUpdated,
        },
      });
    } else {
      logResult({
        name: 'Update Transaction',
        passed: false,
        message: 'Failed to update transaction',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Update Transaction',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 6: Get transaction statistics
async function testGetTransactionStats() {
  console.log('\n📊 Test 6: Get Transaction Statistics');

  if (!userId) {
    logResult({
      name: 'Get Transaction Stats',
      passed: false,
      message: 'No user ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/stats/${userId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.totalTransactions !== undefined) {
      logResult({
        name: 'Get Transaction Stats',
        passed: true,
        message: 'Successfully retrieved transaction statistics',
        data: {
          totalTransactions: data.totalTransactions,
          totalIncome: data.totalIncome,
          totalExpenses: data.totalExpenses,
        },
      });
    } else {
      logResult({
        name: 'Get Transaction Stats',
        passed: false,
        message: 'Failed to retrieve statistics',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Get Transaction Stats',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 7: Delete transaction
async function testDeleteTransaction() {
  console.log('\n🗑️ Test 7: Delete Transaction');

  if (!createdTransactionId) {
    logResult({
      name: 'Delete Transaction',
      passed: false,
      message: 'No transaction ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${createdTransactionId}`, {
      method: 'DELETE',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (response.ok || response.status === 204) {
      logResult({
        name: 'Delete Transaction',
        passed: true,
        message: 'Transaction deleted successfully',
        data: { status: response.status },
      });
    } else {
      const data = await response.json();
      logResult({
        name: 'Delete Transaction',
        passed: false,
        message: 'Failed to delete transaction',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Delete Transaction',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 8: Verify transaction is deleted
async function testVerifyTransactionDeleted() {
  console.log('\n✅ Test 8: Verify Transaction is Deleted');

  if (!createdTransactionId) {
    logResult({
      name: 'Verify Transaction Deleted',
      passed: false,
      message: 'No transaction ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${createdTransactionId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (response.status === 404) {
      logResult({
        name: 'Verify Transaction Deleted',
        passed: true,
        message: 'Transaction correctly not found after deletion',
        data: { status: response.status },
      });
    } else {
      logResult({
        name: 'Verify Transaction Deleted',
        passed: false,
        message: 'Transaction still exists after deletion',
        data: { status: response.status },
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Verify Transaction Deleted',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Transactions CRUD Tests...');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  await setupAuth();
  await testCreateTransaction();
  await testListTransactions();
  await testListTransactionsWithFilters();
  await testGetTransactionById();
  await testUpdateTransaction();
  await testGetTransactionStats();
  await testDeleteTransaction();
  await testVerifyTransactionDeleted();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   - ${r.name}: ${r.message}`);
      });
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
