# Test Suite Documentation

This directory contains manual test scripts for validating the Horizon AI Next.js application functionality.

## Overview

The test suite includes comprehensive tests for:

- **Authentication Flow** - User registration, login, logout, and route protection
- **Accounts CRUD** - Create, read, update, and delete bank accounts
- **Transactions CRUD** - Create, read, update, and delete transactions with filtering
- **Credit Cards CRUD** - Create, read, update, and delete credit cards

## Prerequisites

1. **Development Server Running**

   ```bash
   pnpm dev
   ```

   The server should be running on `http://localhost:3000` (or set `NEXT_PUBLIC_API_URL` environment variable)

2. **Appwrite Configuration**
   - Ensure Appwrite is properly configured with valid credentials in `.env.local`
   - Database and collections should be set up (run migrations if needed)

3. **Node.js and pnpm**
   - Node.js >= 22
   - pnpm >= 9

## Running Tests

### Run Individual Test Suites

Each test suite can be run independently:

```bash
# Test authentication flow
tsx tests/auth-flow.test.ts

# Test accounts CRUD
tsx tests/accounts-crud.test.ts

# Test transactions CRUD
tsx tests/transactions-crud.test.ts

# Test credit cards CRUD
tsx tests/credit-cards-crud.test.ts
```

### Run All Tests

Run all test suites sequentially:

```bash
tsx tests/run-all-tests.ts
```

## Test Suites

### 1. Authentication Flow Tests (`auth-flow.test.ts`)

Tests the complete authentication lifecycle:

- ✅ Register new user
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (should fail)
- ✅ Access protected route with authentication
- ✅ Access protected route without authentication (should fail)
- ✅ Logout
- ✅ Access protected route after logout (should fail)

**Requirements Covered:** 6.1, 6.2, 6.3, 6.4, 6.5

### 2. Accounts CRUD Tests (`accounts-crud.test.ts`)

Tests bank account management:

- ✅ Create account
- ✅ List accounts
- ✅ Get account by ID
- ✅ Update account
- ✅ Delete account
- ✅ Verify account is deleted

**Requirements Covered:** 3.1, 3.2, 3.3

### 3. Transactions CRUD Tests (`transactions-crud.test.ts`)

Tests transaction management:

- ✅ Create manual transaction
- ✅ List transactions
- ✅ List transactions with filters (by type)
- ✅ Get transaction by ID
- ✅ Update transaction
- ✅ Get transaction statistics
- ✅ Delete transaction
- ✅ Verify transaction is deleted

**Requirements Covered:** 3.1, 3.2, 3.3

### 4. Credit Cards CRUD Tests (`credit-cards-crud.test.ts`)

Tests credit card management:

- ✅ Create credit card
- ✅ List credit cards by account
- ✅ Get credit card by ID
- ✅ Update credit card
- ✅ Delete credit card
- ✅ Verify credit card is deleted

**Requirements Covered:** 3.1, 3.2, 3.3

## Test Output

Each test suite provides detailed output:

```
🧪 Starting Authentication Flow Tests...
API Base URL: http://localhost:3000

📝 Test 1: Register New User
✅ Register User: User registered successfully
   Data: {
     "userId": "...",
     "email": "test-1234567890@example.com"
   }

...

==================================================
📊 Test Summary
==================================================
Total Tests: 7
✅ Passed: 7
❌ Failed: 0
Success Rate: 100.0%
```

## Environment Variables

The tests use the following environment variable:

- `NEXT_PUBLIC_API_URL` - Base URL for the API (default: `http://localhost:3000`)

Set it before running tests if using a different URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000 tsx tests/auth-flow.test.ts
```

## Test Data

Each test suite:

- Creates unique test data using timestamps to avoid conflicts
- Cleans up after itself by deleting created resources
- Uses isolated test users to prevent interference between test runs

## Troubleshooting

### Tests Fail with Connection Errors

**Problem:** Cannot connect to the API
**Solution:** Ensure the development server is running on the correct port

```bash
pnpm dev
```

### Tests Fail with Authentication Errors

**Problem:** Appwrite authentication not working
**Solution:**

1. Check `.env.local` has correct Appwrite credentials
2. Verify Appwrite project is accessible
3. Check Appwrite console for any errors

### Tests Fail with Database Errors

**Problem:** Database operations failing
**Solution:**

1. Run database migrations: `pnpm migrate:up`
2. Check Appwrite database and collections are created
3. Verify database permissions in Appwrite console

### Intermittent Test Failures

**Problem:** Tests pass sometimes but fail other times
**Solution:**

1. Check for rate limiting in Appwrite
2. Ensure no other processes are interfering with test data
3. Run tests individually to isolate the issue

## Adding New Tests

To add new test cases:

1. Create a new test file in the `tests/` directory
2. Follow the existing test structure:
   - Import necessary types and helpers
   - Define test data
   - Create setup function if needed
   - Write individual test functions
   - Create a `runAllTests()` function
   - Add summary reporting

3. Update this README with the new test suite information

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    pnpm dev &
    sleep 5
    tsx tests/run-all-tests.ts
```

## Notes

- Tests create real data in the database (not mocked)
- Each test run creates new users and resources
- Tests are designed to be idempotent and can be run multiple times
- Failed tests will exit with code 1 for CI/CD integration
- Successful tests will exit with code 0

## Support

For issues or questions about the test suite:

1. Check the troubleshooting section above
2. Review the test output for specific error messages
3. Verify all prerequisites are met
4. Check the main project README for setup instructions
