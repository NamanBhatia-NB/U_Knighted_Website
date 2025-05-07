const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chess-society';

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Create Express app
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/public')));

// Simple API endpoints
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

// Route for contact page
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/contact.html'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});