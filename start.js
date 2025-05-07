// Combined script to kill existing processes and start the server
const { execSync, spawn } = require('child_process');
const http = require('http');

// Try to kill any processes on common ports
const portsToCheck = [3000, 3001, 3002, 3003, 5173];

function killProcessesOnPorts() {
  // Try to find and kill processes using specific ports
  portsToCheck.forEach(port => {
    try {
      // Find the process ID using the port
      console.log(`Attempting to find processes on port ${port}...`);
      const processListCommand = `lsof -i :${port} -t`;
      
      try {
        const pids = execSync(processListCommand, { encoding: 'utf-8' }).trim().split('\n');
        
        if (pids.length === 0 || (pids.length === 1 && pids[0] === '')) {
          console.log(`No processes found on port ${port}.`);
        } else {
          console.log(`Found ${pids.length} process(es) on port ${port}: ${pids.join(', ')}`);
          
          // Kill each process
          pids.forEach(pid => {
            if (pid) {
              console.log(`Killing process with PID ${pid}`);
              try {
                execSync(`kill -9 ${pid}`);
                console.log(`Successfully killed process ${pid}`);
              } catch (killError) {
                console.error(`Failed to kill process ${pid}:`, killError.message);
              }
            }
          });
        }
      } catch (error) {
        // If lsof command fails, it might mean no process is using the port
        console.log(`No processes found on port ${port} or lsof command failed.`);
      }
    } catch (error) {
      console.error(`Error checking port ${port}:`, error.message);
    }
  });
}

// Function to find an available port
function findAvailablePort(startPort, callback) {
  let port = startPort;
  
  function tryPort() {
    const server = http.createServer();
    
    server.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying ${port + 1}.`);
        port += 1;
        tryPort();
      } else {
        callback(err);
      }
    });
    
    server.once('listening', () => {
      server.close(() => {
        console.log(`Found available port: ${port}`);
        callback(null, port);
      });
    });
    
    server.listen(port);
  }
  
  tryPort();
}

// Kill any existing processes
killProcessesOnPorts();

// Find an available port and start the server
findAvailablePort(3100, (err, port) => {
  if (err) {
    console.error('Error finding available port:', err.message);
    process.exit(1);
  }
  
  console.log(`Starting server on port ${port}...`);
  
  // Set environment variables for the child process
  process.env.PORT = port.toString();
  
  // Start the server with the available port
  const serverProcess = spawn('node', ['server/dynamic-port-server.js'], {
    env: { ...process.env, PORT: port.toString() },
    stdio: 'inherit'
  });
  
  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
  
  console.log(`Server process started with PID ${serverProcess.pid}`);
  
  process.on('SIGINT', () => {
    console.log('Shutting down server...');
    serverProcess.kill('SIGINT');
    process.exit();
  });
});
