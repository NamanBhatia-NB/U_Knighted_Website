// This file serves as a bridge between CommonJS and ES Modules
// It allows us to keep using the npm scripts while gradually migrating to ES modules

// First load the dotenv config
require('dotenv').config();

console.log('Starting server with ES modules compatibility layer...');

// Use dynamic import() to load the ES module version
(async () => {
  try {
    // Import our ES module server
    await import('../server/index-mongo.mjs');
    console.log('ES modules server loaded successfully');
  } catch (error) {
    console.error('Failed to load ES modules server:', error);
    process.exit(1);
  }
})();