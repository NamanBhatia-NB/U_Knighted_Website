require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./db/mongoose');
const routes = require('./server/routes-mongo');

// Set a custom port for this script
const PORT = 54321;

// Connect to MongoDB
console.log('Connecting to MongoDB...');
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');

    const app = express();

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // API Routes
    app.use('/api', routes);

    // Setup Vite in dev mode
    const setupVite = require('./server/vite').setupVite;
    const server = require('http').createServer(app);
    setupVite(app, server);

    // Start server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[express] serving on port ${PORT}`);
      console.log(`Server is running at http://localhost:${PORT}`);
    });

    // Handle errors
    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });