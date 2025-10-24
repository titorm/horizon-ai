/**
 * Run All Tests
 *
 * Executes all test suites sequentially and provides a comprehensive summary
 * Run with: tsx tests/run-all-tests.ts
 */
import { spawn } from 'child_process';
import { join } from 'path';

interface TestSuite {
  name: string;
  file: string;
  description: string;
}

const testSuites: TestSuite[] = [
  {
    name: 'Authentication Flow',
    file: 'auth-flow.test.ts',
    description: 'Tests user registration, login, logout, and route protection',
  },
  {
    name: 'Accounts CRUD',
    file: 'accounts-crud.test.ts',
    description: 'Tests bank account create, read, update, and delete operations',
  },
  {
    name: 'Transactions CRUD',
    file: 'transactions-crud.test.ts',
    description: 'Tests transaction management and filtering',
  },
  {
    name: 'Credit Cards CRUD',
    file: 'credit-cards-crud.test.ts',
    description: 'Tests credit card management operations',
  },
];

interface TestResult {
  suite: string;
  passed: boolean;
  duration: number;
  output: string;
}

const results: TestResult[] = [];

function runTest(suite: TestSuite): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testPath = join(__dirname, suite.file);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Running: ${suite.name}`);
    console.log(`📝 ${suite.description}`);
    console.log('='.repeat(60));

    const child = spawn('tsx', [testPath], {
      stdio: 'inherit',
      env: process.env,
    });

    let output = '';

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      const passed = code === 0;

      results.push({
        suite: suite.name,
        passed,
        duration,
        output,
      });

      resolve({
        suite: suite.name,
        passed,
        duration,
        output,
      });
    });

    child.on('error', (error) => {
      const duration = Date.now() - startTime;
      console.error(`❌ Error running ${suite.name}:`, error);

      results.push({
        suite: suite.name,
        passed: false,
        duration,
        output: error.message,
      });

      resolve({
        suite: suite.name,
        passed: false,
        duration,
        output: error.message,
      });
    });
  });
}

async function runAllTests() {
  console.log('🚀 Starting Complete Test Suite');
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log(`🔗 API Base URL: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}`);

  const overallStartTime = Date.now();

  // Run each test suite sequentially
  for (const suite of testSuites) {
    await runTest(suite);
  }

  const overallDuration = Date.now() - overallStartTime;

  // Print comprehensive summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 COMPLETE TEST SUITE SUMMARY');
  console.log('='.repeat(60));

  const passedSuites = results.filter((r) => r.passed).length;
  const failedSuites = results.filter((r) => !r.passed).length;
  const totalSuites = results.length;

  console.log(`\n📈 Overall Results:`);
  console.log(`   Total Test Suites: ${totalSuites}`);
  console.log(`   ✅ Passed: ${passedSuites}`);
  console.log(`   ❌ Failed: ${failedSuites}`);
  console.log(`   Success Rate: ${((passedSuites / totalSuites) * 100).toFixed(1)}%`);
  console.log(`   Total Duration: ${(overallDuration / 1000).toFixed(2)}s`);

  console.log(`\n📋 Test Suite Details:`);
  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    const status = result.passed ? 'PASSED' : 'FAILED';
    console.log(`   ${index + 1}. ${icon} ${result.suite}: ${status} (${(result.duration / 1000).toFixed(2)}s)`);
  });

  if (failedSuites > 0) {
    console.log(`\n❌ Failed Test Suites:`);
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   - ${r.suite}`);
      });
  }

  console.log('\n' + '='.repeat(60));

  if (failedSuites === 0) {
    console.log('🎉 All test suites passed successfully!');
  } else {
    console.log('⚠️  Some test suites failed. Please review the output above.');
  }

  console.log('='.repeat(60) + '\n');

  // Exit with appropriate code
  process.exit(failedSuites > 0 ? 1 : 0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run all tests
runAllTests().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
