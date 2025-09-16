const { spawn } = require('child_process');

console.log('🧪 Running Quantum DeFi Protocol Tests...\n');

// Run tests with telemetry disabled
const testProcess = spawn('npx', ['hardhat', 'test', '--no-telemetry'], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed successfully!');
  } else {
    console.log('\n❌ Some tests failed. Exit code:', code);
  }
  process.exit(code);
});

testProcess.on('error', (error) => {
  console.error('❌ Test execution error:', error);
  process.exit(1);
});
