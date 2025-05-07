const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'chess-society-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // API routes
    require('./routes-mongo')(app);
    
    // Create and start server
    const server = http.createServer(app);
    
    // For Replit compatibility - hardcode port 5000
    const PORT = 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[express] Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});