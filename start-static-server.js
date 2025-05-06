const express = require('express');
const path = require('path');
const fs = require('fs');

// Define alternative ports to try
const PORTS = [8080, 8081, 8082, 8083, 3000, 3001, 5000, 5001];

const app = express();

// Serve static content from client directory
app.use(express.static(path.join(__dirname, 'client')));

// Preview HTML file
app.get('/preview', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview.html'));
});

// Get first available port
function tryPort(index) {
  if (index >= PORTS.length) {
    console.error('All ports are in use. Could not start server.');
    process.exit(1);
    return;
  }
  
  const port = PORTS[index];
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`[Chess Society Preview] Server running on port ${port}`);
    console.log(`View the preview at: http://localhost:${port}/preview`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Trying next port...`);
      tryPort(index + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

tryPort(0);