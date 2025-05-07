require('dotenv').config();
const express = require('express');
const path = require('path');

// Use enhanced MongoDB connection from ESM version
const connectDB = async () => {
  try {
    // Dynamically import the ES module version
    const moduleImport = await import('../db/mongoose.mjs');
    const connectDBFunc = moduleImport.default;
    return await connectDBFunc();
  } catch (error) {
    console.error('Error importing ES module mongoose connection:', error);
    // Fallback to CommonJS version if ES module fails
    const connectDBFunc = require('../db/mongoose');
    return connectDBFunc();
  }
};

// Connect to MongoDB - use async IIFE to handle the async connectDB
(async () => {
  await connectDB();
})();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load routes using dynamic import
(async () => {
  try {
    // Try to use the ES module version of routes
    const routesModule = await import('./routes-mongo.mjs');
    const routes = routesModule.default;
    // API Routes
    app.use('/api', routes);
    console.log('Using ES modules version of routes');
  } catch (error) {
    console.error('Error loading ES module routes, falling back to CommonJS:', error);
    // Fallback to CommonJS version
    const routes = require('./routes-mongo');
    // API Routes
    app.use('/api', routes);
  }
})();

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // In development, use Vite for client
  (async () => {
    try {
      // Serve static files from client directory for proper path resolution
      app.use(express.static(path.join(__dirname, '../client')));
      
      // Try to use ES modules version of vite setup
      const viteModule = await import('./vite.mjs');
      const setupVite = viteModule.setupVite;
      const http = await import('http');
      const server = http.createServer(app);
      await setupVite(app, server);
      console.log('Using ES modules version of Vite setup');
    } catch (error) {
      console.error('Error loading ES module Vite setup, falling back to CommonJS:', error);
      // Fallback to CommonJS version
      const viteUtils = require('./vite');
      const server = require('http').createServer(app);
      
      // Serve static files from client directory for proper path resolution
      app.use(express.static(path.join(__dirname, '../client')));
      
      viteUtils.setupVite(app, server);
    }
  })();
  
  // Use a dynamic port allocation to avoid conflicts
  const findFreePort = (startPort) => {
    return new Promise((resolve, reject) => {
      const http = require('http');
      const server = http.createServer();
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${startPort} in use, trying ${startPort + 1}`);
          resolve(findFreePort(startPort + 1));
        } else {
          reject(err);
        }
      });
      
      server.listen(startPort, () => {
        server.close(() => {
          resolve(startPort);
        });
      });
    });
  };
  
  // Use port 5000 (default for Replit) or fallback to dynamic port allocation
  const PORT = 5000;
  
  // Create a new HTTP server with the Express app
  const http = require('http');
  const httpServer = http.createServer(app);
  
  // Start server with WebSocket support
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[express] serving on port ${PORT}`);
  });
}

// Handle errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for direct execution
if (!module.parent) {
  // Use dynamic port allocation to avoid conflicts
  const findFreePort = (startPort) => {
    return new Promise((resolve, reject) => {
      const http = require('http');
      const server = http.createServer();
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${startPort} in use, trying ${startPort + 1}`);
          resolve(findFreePort(startPort + 1));
        } else {
          reject(err);
        }
      });
      
      server.listen(startPort, () => {
        server.close(() => {
          resolve(startPort);
        });
      });
    });
  };
  
  // Find an available port starting from 3500
  findFreePort(3500).then(PORT => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[express] serving on port ${PORT}`);
    });
  });
}

module.exports = app;