// Simple script to launch Vite with specific command line flags
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Vite with custom configuration...');

// Start Vite with specific flags to avoid configuration issues
const vite = spawn('npx', [
  'vite',
  '--config', path.join(__dirname, 'vite.config.js'), // Use a basic JS config
  '--port', '3000',
  '--strictPort',
  '--host',  // Listen on all interfaces
  '--debug'  // Add debug output
], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    // Force CommonJS build
    VITE_FORCE_CJS: 'true',
    // Skip plugins that cause issues
    VITE_SKIP_CARTOGRAPHER: 'true'
  }
});

vite.on('error', (error) => {
  console.error('Failed to start Vite dev server:', error);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Vite dev server exited with code ${code}`);
  process.exit(code);
});