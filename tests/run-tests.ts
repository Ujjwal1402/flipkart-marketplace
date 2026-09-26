/**
 * Test Execution Runner
 * Executes integration and e2e test suites
 */
import { runIntegrationTests } from './integration/api.test';
import { runCheckoutE2ETests } from './e2e/checkout-flow.test';

async function main() {
  console.log('==================================================');
  console.log('   Flipkart Enterprise Test Runner Started');
  console.log('==================================================');

  const integrationResults = await runIntegrationTests();
  const e2eResults = await runCheckoutE2ETests();

  const totalPassed = integrationResults.passed + e2eResults.passed;
  const totalFailed = integrationResults.failed + e2eResults.failed;

  console.log('\n==================================================');
  console.log(`   Test Results: ${totalPassed} Passed, ${totalFailed} Failed`);
  console.log('==================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
