require('dotenv').config();
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

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

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB and continue setup after connection
(async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
    setupRoutes();
    setupServer();
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    setupRoutes(); // Continue anyway to allow frontend to work
    setupServer();
  }
})();

function setupRoutes() {
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
      console.error('Error loading ES module routes:', error);
      
      // Fallback API endpoints if routes failed to load
      app.get('/api/society/stats', (req, res) => {
        res.json({
          members: 120,
          tournaments: 15,
          championships: 8
        });
      });
      
      app.post('/api/contact', (req, res) => {
        console.log('Contact form submission:', req.body);
        res.status(200).json({ message: 'Contact form received' });
      });
      
      app.post('/api/join', (req, res) => {
        console.log('Join form submission:', req.body);
        res.status(200).json({ message: 'Join request received' });
      });
    }
  })();
}

function setupServer() {
  // For Express, use port 5000
  const PORT = 5000;

  // Serve static files directly from the public directory
  app.use(express.static(path.join(__dirname, '../client/public')));
  
  // Catch-all route to handle all frontend requests
  app.get('*', (req, res) => {
    // Check if this is an API request
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Serve the main HTML file
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
  });

  // Error handling
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Start the Express server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Chess Society website available at http://localhost:${PORT}`);
  });
}

module.exports = app;