/**
 * Authentication Flow Tests
 *
 * Manual test script for validating authentication functionality
 * Run with: tsx tests/auth-flow.test.ts
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
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
};

let authToken: string | null = null;

// Helper function to log results
function logResult(result: TestResult) {
  results.push(result);
  const icon = result.passed ? '✅' : '❌';
  console.log(`${icon} ${result.name}: ${result.message}`);
  if (result.data) {
    console.log('   Data:', JSON.stringify(result.data, null, 2));
  }
}

// Helper function to extract cookie
function extractAuthToken(response: Response): string | null {
  const setCookie = response.headers.get('set-cookie');
  if (!setCookie) return null;

  const match = setCookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : null;
}

// Test 1: Register new user
async function testRegisterUser() {
  console.log('\n📝 Test 1: Register New User');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (response.ok && data.user) {
      authToken = extractAuthToken(response);
      logResult({
        name: 'Register User',
        passed: true,
        message: 'User registered successfully',
        data: { userId: data.user.id, email: data.user.email },
      });
    } else {
      logResult({
        name: 'Register User',
        passed: false,
        message: data.message || 'Registration failed',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Register User',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 2: Login with valid credentials
async function testLoginValid() {
  console.log('\n🔐 Test 2: Login with Valid Credentials');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.user) {
      authToken = extractAuthToken(response);
      logResult({
        name: 'Login Valid',
        passed: true,
        message: 'Login successful with valid credentials',
        data: { userId: data.user.id, hasToken: !!authToken },
      });
    } else {
      logResult({
        name: 'Login Valid',
        passed: false,
        message: data.message || 'Login failed',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Login Valid',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 3: Login with invalid credentials
async function testLoginInvalid() {
  console.log('\n🚫 Test 3: Login with Invalid Credentials');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123!',
      }),
    });

    const data = await response.json();

    if (!response.ok && response.status === 401) {
      logResult({
        name: 'Login Invalid',
        passed: true,
        message: 'Correctly rejected invalid credentials',
        data: { status: response.status },
      });
    } else {
      logResult({
        name: 'Login Invalid',
        passed: false,
        message: 'Should have rejected invalid credentials',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Login Invalid',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 4: Access protected route with token
async function testProtectedRouteWithAuth() {
  console.log('\n🔒 Test 4: Access Protected Route with Authentication');

  if (!authToken) {
    logResult({
      name: 'Protected Route With Auth',
      passed: false,
      message: 'No auth token available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.user) {
      logResult({
        name: 'Protected Route With Auth',
        passed: true,
        message: 'Successfully accessed protected route',
        data: { email: data.user.email },
      });
    } else {
      logResult({
        name: 'Protected Route With Auth',
        passed: false,
        message: 'Failed to access protected route',
        data,
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Protected Route With Auth',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 5: Access protected route without token
async function testProtectedRouteWithoutAuth() {
  console.log('\n🚫 Test 5: Access Protected Route without Authentication');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
    });

    if (response.status === 401) {
      logResult({
        name: 'Protected Route Without Auth',
        passed: true,
        message: 'Correctly rejected unauthenticated request',
        data: { status: response.status },
      });
    } else {
      logResult({
        name: 'Protected Route Without Auth',
        passed: false,
        message: 'Should have rejected unauthenticated request',
        data: { status: response.status },
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Protected Route Without Auth',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 6: Logout
async function testLogout() {
  console.log('\n👋 Test 6: Logout');

  if (!authToken) {
    logResult({
      name: 'Logout',
      passed: false,
      message: 'No auth token available',
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
      method: 'POST',
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (response.ok) {
      const setCookie = response.headers.get('set-cookie');
      const tokenCleared = setCookie?.includes('auth_token=;') || setCookie?.includes('Max-Age=0');

      logResult({
        name: 'Logout',
        passed: tokenCleared || false,
        message: tokenCleared ? 'Logout successful, token cleared' : 'Logout response OK but token not cleared',
        data: { status: response.status },
      });

      authToken = null;
    } else {
      logResult({
        name: 'Logout',
        passed: false,
        message: 'Logout failed',
        data: { status: response.status },
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Logout',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Test 7: Access protected route after logout
async function testProtectedRouteAfterLogout() {
  console.log('\n🔒 Test 7: Access Protected Route After Logout');

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
    });

    if (response.status === 401) {
      logResult({
        name: 'Protected Route After Logout',
        passed: true,
        message: 'Correctly rejected request after logout',
        data: { status: response.status },
      });
    } else {
      logResult({
        name: 'Protected Route After Logout',
        passed: false,
        message: 'Should have rejected request after logout',
        data: { status: response.status },
      });
    }
  } catch (error: any) {
    logResult({
      name: 'Protected Route After Logout',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Authentication Flow Tests...');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  await testRegisterUser();
  await testLoginValid();
  await testLoginInvalid();
  await testProtectedRouteWithAuth();
  await testProtectedRouteWithoutAuth();
  await testLogout();
  await testProtectedRouteAfterLogout();

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
