/**
 * Chess Society App Launcher
 * This script ensures the app starts on the correct port for Replit
 */

console.log('Starting Chess Society application...');

// Try to load the ES modules version first
import('./server/index-mongo.mjs')
  .then(() => {
    console.log('Started using ES modules version');
  })
  .catch(err => {
    console.error('Failed to start ES modules version:', err);
    console.log('Falling back to CommonJS version...');
    
    // Fallback to CommonJS
    try {
      require('./server/index-mongo.js');
      console.log('Started using CommonJS version');
    } catch (commonJsError) {
      console.error('Failed to start CommonJS version:', commonJsError);
      process.exit(1);
    }
  });