require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { createServer: createViteServer } = require('vite');
const path = require('path');
const mongoose = require('mongoose');

// Use MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// MongoDB connection
async function connectToMongoDB() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
}

async function startServer() {
  // Connect to MongoDB
  await connectToMongoDB();
  
  // Create Express app
  const app = express();
  
  // Middleware for parsing JSON
  app.use(express.json());
  
  // Load API routes
  try {
    // We need to use dynamic import for ES modules
    const { default: apiRoutes } = await import('./routes-mongo.mjs');
    app.use('/api', apiRoutes);
    console.log('API routes loaded successfully');
  } catch (error) {
    console.error('Error loading API routes:', error);
    process.exit(1);
  }
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create Vite server
  try {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { server: httpServer }
      },
      appType: 'spa',
      root: path.resolve(__dirname, '../client')
    });
    
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
    
    console.log('Vite middleware setup complete');
  } catch (error) {
    console.error('Vite server creation failed:', error);
    process.exit(1);
  }
  
  // Fixed port for Replit to detect
  const PORT = 5000;
  
  // Start the server
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start the server
startServer().catch(error => {
  console.error('Server startup failed:', error);
  process.exit(1);
});