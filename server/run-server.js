const { exec } = require('child_process');

// First kill all existing node processes
console.log('Killing existing Node.js processes...');
exec('pkill -f node || true', (error) => {
  // Wait for processes to terminate
  setTimeout(() => {
    // Pick a random port between 10000 and 65000
    const port = Math.floor(Math.random() * 55000) + 10000;
    console.log(`Trying port ${port}...`);
    
    // Update .env file with the new port
    const fs = require('fs');
    let envContent = fs.readFileSync('.env', 'utf8');
    envContent = envContent.replace(/PORT=\d+/, `PORT=${port}`);
    fs.writeFileSync('.env', envContent);
    
    // Start the server with the new port
    console.log(`Starting server on port ${port}...`);
    exec(`PORT=${port} node server/index-mongo.js`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(stdout);
    });
  }, 2000);
});
