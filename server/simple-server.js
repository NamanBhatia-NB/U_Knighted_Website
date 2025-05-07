// Simple server that will definitely start without MongoDB or other dependencies
require('dotenv').config();
const express = require('express');
const http = require('http');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Find a free port
function findAvailablePort(port, callback) {
  const server = http.createServer();
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${port + 1}`);
      findAvailablePort(port + 1, callback);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
  
  server.listen(port, () => {
    server.close(() => {
      callback(port);
    });
  });
}

// Simple API endpoint that doesn't require MongoDB
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running correctly',
    mongoUri: process.env.MONGO_URI ? 'Configured' : 'Not configured'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// Start server
findAvailablePort(3500, (port) => {
  console.log(`Starting server on port ${port}...`);
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running successfully on port ${port}`);
    console.log(`Try accessing the API at http://localhost:${port}/api/status`);
  });
});