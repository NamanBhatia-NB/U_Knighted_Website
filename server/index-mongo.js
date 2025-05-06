require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('../db/mongoose');
const routes = require('./routes-mongo');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api', routes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // In development, use Vite for client
  const setupVite = require('./vite').setupVite;
  const server = require('http').createServer(app);
  setupVite(app, server);
  
  // Get port from environment variable
  const PORT = process.env.PORT || 3000;
  
  // Start server with WebSocket support
  server.listen(PORT, '0.0.0.0', () => {
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
  // Get port from environment variable
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[express] serving on port ${PORT}`);
  });
}

module.exports = app;