/**
 * Bridge script to handle both CommonJS and ES modules
 * This script will dynamically import our ES modules server
 */

// Check if the .mjs file exists
const fs = require('fs');
const path = require('path');

const mjs_server_path = path.join(__dirname, 'index-mongo.mjs');
const js_server_path = path.join(__dirname, 'index-mongo.js');

async function startServer() {
  console.log('Starting chess society server...');

  try {
    if (fs.existsSync(mjs_server_path)) {
      console.log('Using ES modules version');
      // Use dynamic import for ES modules
      import('./index-mongo.mjs').catch(err => {
        console.error('Error loading ES modules version:', err);
        console.log('Falling back to CommonJS version');
        require('./index-mongo.js');
      });
    } else {
      console.log('Using CommonJS version');
      require('./index-mongo.js');
    }
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();