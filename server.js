require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const path = require('path');
const mongoose = require('mongoose');

// Get MongoDB URI from env
const mongoURI = process.env.MONGO_URI;

// Create Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Function to connect to MongoDB
async function connectMongoDB() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Mount API routes
app.use('/api', async (req, res, next) => {
  try {
    // Dynamic import of API routes
    const routesModule = await import('./server/routes-mongo.mjs');
    req.app.locals.apiRouter = routesModule.default;
    next();
  } catch (error) {
    console.error('Error loading API routes:', error);
    res.status(500).json({ error: 'Server configuration error' });
  }
}, (req, res, next) => {
  if (req.app.locals.apiRouter) {
    req.app.locals.apiRouter(req, res, next);
  } else {
    next();
  }
});

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// Handle SPA routing - send all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Use port 5000 for Replit
const PORT = 5000;

// Create HTTP server
const server = createServer(app);

// Start the server
async function startServer() {
  // Try to connect to MongoDB first
  await connectMongoDB();
  
  // Start listening
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Launch the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});