/**
 * Credit Cards CRUD Tests
 *
 * Manual test script for validating credit cards CRUD functionality
 * Run with: tsx tests/credit-cards-crud.test.ts
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
let createdCardId: string | null = null;

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

// Test 1: Create credit card
async function testCreateCreditCard() {
  console.log('\n📝 Test 1: Create Credit Card');

  const creditCard = {
    accountId: testAccountId,
    cardNumber: '**** **** **** 1234',
    cardholderName: 'Test User',
    expirationDate: '12/2028',
    brand: 'Visa',
    creditLimit: 10000,
    availableCredit: 10000,
    closingDay: 15,
    dueDay: 25,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/credit-cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${authToken}`,
      },
      body: JSON.stringify(creditCard),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      createdCardId = data.id;
      logResult({
        name: 'Create Credit Card',
        passed: true,
        message: 'Credit card created successfully',
        data: {
          id: data.id,
          cardNumber: data.cardNumber,
          brand: data.brand,
          creditLimit: data.creditLimit,
        },
      });
    } else {
      logResult({
        name: 'Create Credit Card',
        passed: false,
        message: data.message || 'Credit card creation failed',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Create Credit Card',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 2: List credit cards by account
async function testListCreditCardsByAccount() {
  console.log('\n📋 Test 2: List Credit Cards by Account');

  if (!testAccountId) {
    logResult({
      name: 'List Credit Cards by Account',
      passed: false,
      message: 'No account ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/credit-cards/account/${testAccountId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      const hasCreatedCard = data.some((card: any) => card.id === createdCardId);
      logResult({
        name: 'List Credit Cards by Account',
        passed: hasCreatedCard,
        message: hasCreatedCard
          ? `Successfully listed ${data.length} credit card(s), including created card`
          : `Listed ${data.length} credit card(s), but created card not found`,
        data: { count: data.length, hasCreatedCard },
      });
    } else {
      logResult({
        name: 'List Credit Cards by Account',
        passed: false,
        message: 'Failed to list credit cards',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'List Credit Cards by Account',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 3: Get credit card by ID
async function testGetCreditCardById() {
  console.log('\n🔍 Test 3: Get Credit Card by ID');

  if (!createdCardId) {
    logResult({
      name: 'Get Credit Card by ID',
      passed: false,
      message: 'No credit card ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/credit-cards/${createdCardId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.id === createdCardId) {
      logResult({
        name: 'Get Credit Card by ID',
        passed: true,
        message: 'Successfully retrieved credit card',
        data: {
          id: data.id,
          cardNumber: data.cardNumber,
          brand: data.brand,
          creditLimit: data.creditLimit,
        },
      });
    } else {
      logResult({
        name: 'Get Credit Card by ID',
        passed: false,
        message: 'Failed to retrieve credit card',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Get Credit Card by ID',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 4: Update credit card
async function testUpdateCreditCard() {
  console.log('\n✏️ Test 4: Update Credit Card');

  if (!createdCardId) {
    logResult({
      name: 'Update Credit Card',
      passed: false,
      message: 'No credit card ID available',
    });
    return;
  }

  const updates = {
    creditLimit: 15000,
    availableCredit: 14500,
    closingDay: 20,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/credit-cards/${createdCardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${authToken}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.ok && data.id === createdCardId) {
      const limitUpdated = data.creditLimit === updates.creditLimit;
      const availableUpdated = data.availableCredit === updates.availableCredit;
      const closingDayUpdated = data.closingDay === updates.closingDay;

      logResult({
        name: 'Update Credit Card',
        passed: limitUpdated && availableUpdated && closingDayUpdated,
        message:
          limitUpdated && availableUpdated && closingDayUpdated
            ? 'Credit card updated successfully'
            : 'Credit card update incomplete',
        data: {
          id: data.id,
          creditLimit: data.creditLimit,
          availableCredit: data.availableCredit,
          closingDay: data.closingDay,
          limitUpdated,
          availableUpdated,
          closingDayUpdated,
        },
      });
    } else {
      logResult({
        name: 'Update Credit Card',
        passed: false,
        message: 'Failed to update credit card',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Update Credit Card',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 5: Delete credit card
async function testDeleteCreditCard() {
  console.log('\n🗑️ Test 5: Delete Credit Card');

  if (!createdCardId) {
    logResult({
      name: 'Delete Credit Card',
      passed: false,
      message: 'No credit card ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/credit-cards/${createdCardId}`, {
      method: 'DELETE',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (response.ok || response.status === 204) {
      logResult({
        name: 'Delete Credit Card',
        passed: true,
        message: 'Credit card deleted successfully',
        data: { status: response.status },
      });
    } else {
      const data = await response.json();
      logResult({
        name: 'Delete Credit Card',
        passed: false,
        message: 'Failed to delete credit card',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Delete Credit Card',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 6: Verify credit card is deleted
async function testVerifyCreditCardDeleted() {
  console.log('\n✅ Test 6: Verify Credit Card is Deleted');

  if (!createdCardId) {
    logResult({
      name: 'Verify Credit Card Deleted',
      passed: false,
      message: 'No credit card ID available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/credit-cards/${createdCardId}`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (response.status === 404) {
      logResult({
        name: 'Verify Credit Card Deleted',
        passed: true,
        message: 'Credit card correctly not found after deletion',
        data: { status: response.status },
      });
    } else {
      logResult({
        name: 'Verify Credit Card Deleted',
        passed: false,
        message: 'Credit card still exists after deletion',
        data: { status: response.status },
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Verify Credit Card Deleted',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Credit Cards CRUD Tests...');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  await setupAuth();
  await testCreateCreditCard();
  await testListCreditCardsByAccount();
  await testGetCreditCardById();
  await testUpdateCreditCard();
  await testDeleteCreditCard();
  await testVerifyCreditCardDeleted();

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
