// Simple entry point for production environments
// This allows running the app without TypeScript compilation issues
console.log('Starting server from server.js');

try {
  console.log('Loading compiled JavaScript from dist/index.js');
  require('./dist/index.js');
} catch (error) {
  console.error('Failed to load compiled JavaScript:', error.message);
  console.log('Attempting to run TypeScript directly...');
  
  try {
    require('ts-node/register');
    require('./index.ts');
  } catch (tsError) {
    console.error('Failed to run TypeScript:', tsError.message);
    process.exit(1);
  }
}
