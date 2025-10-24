/**
 * Accounts CRUD Tests
 *
 * Manual test script for validating accounts CRUD functionality
 * Run with: tsx tests/accounts-crud.test.ts
 *
 * Prerequisites: User must be logged in (run auth-flow.test.ts first)
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
const testAccount = {
  name: `Test Account ${Date.now()}`,
  type: 'CHECKING' as const,
  balance: 1000.5,
  currency: 'BRL',
  bankName: 'Test Bank',
};

let authToken: string | null = null;
let createdAccountId: string | null = null;

// Helper function to log results
function logResult(result: TestResult) {
  results.push(result);
  const icon = result.passed ? '✅' : '❌';
  console.log(`${icon} ${result.name}: ${result.message}`);
  if (result.data) {
    console.log('   Data:', JSON.stringify(result.data, null, 2));
  }
}

// Setup: Login to get auth token
async function setupAuth() {
  console.log('🔐 Setting up authentication...');

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

    // Extract token from cookie
    const setCookie = registerResponse.headers.get('set-cookie');
    const match = setCookie?.match(/auth_token=([^;]+)/);
    authToken = match ? match[1] : null;

    if (!authToken) {
      throw new Error('Failed to get auth token');
    }

    console.log('✅ Authentication setup complete\n');
  } catch (error: any) {
    console.error('❌ Authentication setup failed:', error.message);
    process.exit(1);
  }
}

// Test 1: Create account
async function testCreateAccount() {
  console.log('\n📝 Test 1: Create Account');

  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${authToken}`,
      },
      body: JSON.stringify(testAccount),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      createdAccountId = data.id;
      logResult({
        name: 'Create Account',
        passed: true,
        message: 'Account created successfully',
        data: {
          id: data.id,
          name: data.name,
          type: data.type,
          balance: data.balance,
        },
      });
    } else {
      logResult({
        name: 'Create Account',
        passed: false,
        message: data.message || 'Account creation failed',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Create Account',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 2: List accounts
async function testListAccounts() {
  console.log('\n📋 Test 2: List Accounts');

  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      const hasCreatedAccount = data.some((acc: any) => acc.id === createdAccountId);
      logResult({
        name: 'List Accounts',
        passed: hasCreatedAccount,
        message: hasCreatedAccount
          ? `Successfully listed ${data.length} account(s), including created account`
          : `Listed ${data.length} account(s), but created account not found`,
        data: { count: data.length, hasCreatedAccount },
      });
    } else {
      logResult({
        name: 'List Accounts',
        passed: false,
        message: 'Failed to list accounts',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'List Accounts',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 3: Get account by ID
async function testGetAccountById() {
  console.log('\n🔍 Test 3: Get Account by ID');

  if (!createdAccountId) {
    logResult({
      name: 'Get Account by ID',
      passed: false,
      message: 'No account ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${createdAccountId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.id === createdAccountId) {
      logResult({
        name: 'Get Account by ID',
        passed: true,
        message: 'Successfully retrieved account',
        data: {
          id: data.id,
          name: data.name,
          balance: data.balance,
        },
      });
    } else {
      logResult({
        name: 'Get Account by ID',
        passed: false,
        message: 'Failed to retrieve account',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Get Account by ID',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 4: Update account
async function testUpdateAccount() {
  console.log('\n✏️ Test 4: Update Account');

  if (!createdAccountId) {
    logResult({
      name: 'Update Account',
      passed: false,
      message: 'No account ID available',
    });
    return;
  }

  const updates = {
    name: `Updated Account ${Date.now()}`,
    balance: 2500.75,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${createdAccountId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${authToken}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.ok && data.id === createdAccountId) {
      const nameUpdated = data.name === updates.name;
      const balanceUpdated = Math.abs(data.balance - updates.balance) < 0.01;

      logResult({
        name: 'Update Account',
        passed: nameUpdated && balanceUpdated,
        message: nameUpdated && balanceUpdated ? 'Account updated successfully' : 'Account update incomplete',
        data: {
          id: data.id,
          name: data.name,
          balance: data.balance,
          nameUpdated,
          balanceUpdated,
        },
      });
    } else {
      logResult({
        name: 'Update Account',
        passed: false,
        message: 'Failed to update account',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Update Account',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 5: Delete account
async function testDeleteAccount() {
  console.log('\n🗑️ Test 5: Delete Account');

  if (!createdAccountId) {
    logResult({
      name: 'Delete Account',
      passed: false,
      message: 'No account ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${createdAccountId}`, {
      method: 'DELETE',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (response.ok || response.status === 204) {
      logResult({
        name: 'Delete Account',
        passed: true,
        message: 'Account deleted successfully',
        data: { status: response.status },
      });
    } else {
      const data = await response.json();
      logResult({
        name: 'Delete Account',
        passed: false,
        message: 'Failed to delete account',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Delete Account',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 6: Verify account is deleted
async function testVerifyAccountDeleted() {
  console.log('\n✅ Test 6: Verify Account is Deleted');

  if (!createdAccountId) {
    logResult({
      name: 'Verify Account Deleted',
      passed: false,
      message: 'No account ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${createdAccountId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (response.status === 404) {
      logResult({
        name: 'Verify Account Deleted',
        passed: true,
        message: 'Account correctly not found after deletion',
        data: { status: response.status },
      });
    } else {
      logResult({
        name: 'Verify Account Deleted',
        passed: false,
        message: 'Account still exists after deletion',
        data: { status: response.status },
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Verify Account Deleted',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Accounts CRUD Tests...');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  await setupAuth();
  await testCreateAccount();
  await testListAccounts();
  await testGetAccountById();
  await testUpdateAccount();
  await testDeleteAccount();
  await testVerifyAccountDeleted();

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
