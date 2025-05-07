// This is a special script to run the Chess Society server
console.log('Starting Chess Society server...');

// Try to use our fixed server version first
try {
  console.log('Using simplified server with direct Vite integration');
  require('./server/fix-server.js');
} catch (err) {
  console.error('Failed to start simplified server, falling back to ES modules:', err);
  
  // Use dynamic import() as fallback to load ES modules from CommonJS
  import('./server/index-mongo.mjs')
    .then(() => {
      console.log('ESM server started successfully');
    })
    .catch(fallbackErr => {
      console.error('Failed to start ESM server:', fallbackErr);
      console.log('Attempting to use CommonJS version as final fallback...');
      
      try {
        require('./server/index-mongo.js');
      } catch (finalErr) {
        console.error('All server startup methods failed:', finalErr);
        process.exit(1);
      }
    });
}