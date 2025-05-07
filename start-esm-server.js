// This script is a bridge to run ES modules while keeping the package.json file unchanged
console.log('Starting server with ES modules...');

// Use dynamic import to load ES module files
// This trick allows us to load ES modules from CommonJS without changing package.json
import('./server/index-mongo.mjs')
  .then(() => {
    console.log('Server started successfully with ES modules');
  })
  .catch(err => {
    console.error('Failed to start server with ES modules:', err);
    process.exit(1);
  });