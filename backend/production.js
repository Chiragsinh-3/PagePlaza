// Simple production entry point
// This script will be used by Render.com to start the application

console.log('Starting application in production mode...');

try {
  require('./dist/index.js');
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1);
}
