// Script to kill processes and restart server
const { execSync } = require('child_process');
const { spawn } = require('child_process');

console.log('Stopping any running processes...');

try {
  // Kill any existing Node.js processes
  execSync('pkill -f node || true');
  console.log('Killed existing Node.js processes');
} catch (error) {
  console.log('No processes to kill');
}

// Wait a moment for ports to be released
setTimeout(() => {
  console.log('Starting server with MongoDB connection...');
  
  // Spawn server process
  const server = spawn('node', ['server/chess-mongo-server.js'], {
    stdio: 'inherit',
    detached: false
  });
  
  server.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
  
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.kill('SIGINT');
    process.exit(0);
  });
  
  console.log('Server started successfully');
}, 2000);
