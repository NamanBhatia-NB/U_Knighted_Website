require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const connectDB = require('../db/mongoose');
const routes = require('./routes-mongo');
const { setupVite } = require('./vite');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api', routes);

// In development, use Vite for client
setupVite(app, server).catch(err => {
  console.error('Vite setup error:', err);
  process.exit(1);
});

// Handle errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[express] serving on port ${PORT}`);
});

module.exports = app;