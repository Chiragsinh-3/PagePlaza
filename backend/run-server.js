// This is a helper script to start the server with ts-node and transpile-only mode
// It bypasses TypeScript type checking completely
const { spawn } = require('child_process');
const path = require('path');

// Increase memory limit
process.env.NODE_OPTIONS = '--max-old-space-size=2048';

// Run ts-node with transpile-only flag and minimal tsconfig
const tsNode = spawn('npx', ['ts-node', '--project', 'tsconfig.dev.json', '--transpile-only', 'index.ts'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env
});

tsNode.on('error', (err) => {
  console.error('Failed to start ts-node process:', err);
  process.exit(1);
});

tsNode.on('close', (code) => {
  console.log(`ts-node process exited with code ${code}`);
  process.exit(code);
});
