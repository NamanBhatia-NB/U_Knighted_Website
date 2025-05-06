require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./static-routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api', routes);

// Use Vite for client
const setupVite = require('./vite').setupVite;
const server = require('http').createServer(app);
setupVite(app, server);

// Start server with WebSocket support  
const PORT = 54321; // Using a completely different port
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[express] serving chess society app on port ${PORT}`);
});

// Handle errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;