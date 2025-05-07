require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const connectDB = require('../db/mongoose');
const routes = require('./routes-mongo');

// Find an available port dynamically
function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} is busy, trying next port...`);
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    
    server.listen(startPort, () => {
      server.close(() => {
        console.log(`Found available port: ${startPort}`);
        resolve(startPort);
      });
    });
  });
}

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// Add MongoDB status endpoint
app.get('/api/mongodb-status', (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) {
    res.json({ status: 'connected', message: 'MongoDB is connected' });
  } else {
    res.json({ status: 'disconnected', message: 'MongoDB is not connected' });
  }
});

// API Routes
app.use('/api', routes);

// Main server startup function
async function startServer() {
  try {
    // First check for any running processes that might block ports
    console.log('Looking for an available port...');
    
    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    const connected = await connectDB();
    
    if (!connected) {
      console.log('Will continue with limited functionality (forms will use localStorage only)');
    }
    
    // Find an available port starting from 3500
    // Using higher ports reduces chance of conflicts
    const PORT = await findAvailablePort(3500);
    
    // Create HTTP server
    const server = http.createServer(app);
    
    // Set up Vite for development
    if (process.env.NODE_ENV !== 'production') {
      const setupVite = require('./vite').setupVite;
      console.log('Setting up Vite development server...');
      await setupVite(app, server);
    } else {
      // Serve static files in production
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }
    
    // Start server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      if (connected) {
        console.log('MongoDB connection is active - all features available');
      } else {
        console.log('MongoDB connection failed - using localStorage fallback for forms');
      }
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();