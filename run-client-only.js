const { spawn } = require('child_process');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Kill any existing processes
try {
  console.log('Stopping any existing processes...');
  execSync('pkill -f node || true');
} catch (error) {
  console.log('No processes to kill');
}

// Path to Vite binary
const viteBinPath = path.resolve(__dirname, 'node_modules/.bin/vite');

// Check if Vite binary exists
if (!fs.existsSync(viteBinPath)) {
  console.error('Vite binary not found at', viteBinPath);
  process.exit(1);
}

// Create an .env.local file with MongoDB URI
console.log('Setting up environment variables...');
fs.writeFileSync('.env.local', `MONGO_URI=${process.env.MONGO_URI || ''}\n`);

// Find an available port
const findAvailablePort = (start) => {
  const http = require('http');
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(start, () => {
      server.close(() => {
        resolve(start);
      });
    });
    server.on('error', () => {
      resolve(findAvailablePort(start + 1));
    });
  });
};

// Start the Vite dev server
const startViteDevServer = async () => {
  const port = await findAvailablePort(3000);
  console.log(`Starting Vite dev server on port ${port}...`);
  
  // Start Vite
  const viteProcess = spawn(viteBinPath, ['--port', port.toString()], {
    cwd: path.resolve(__dirname),
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    process.exit(1);
  });
  
  console.log(`Vite dev server started on port ${port}`);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    viteProcess.kill('SIGINT');
    process.exit(0);
  });
};

// Main function
const main = async () => {
  try {
    await startViteDevServer();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the main function
main();
