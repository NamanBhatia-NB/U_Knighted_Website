require('dotenv').config();
const express = require('express');
const path = require('path');

// Set a custom port that's less likely to be in use
const PORT = 34567;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup Vite in dev mode
const setupVite = require('./server/vite').setupVite;
const server = require('http').createServer(app);
setupVite(app, server);

// API routes for static event data
app.get('/api/events', (req, res) => {
  try {
    // Serve the static JSON file data
    const events = require('./client/src/data/events.json');
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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