require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const { Member, Event, News, Contact, Newsletter, SocietyStats } = require('../models');

// First, find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is busy, try the next one
        console.log(`Port ${startPort} is busy, trying next port...`);
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    
    server.listen(startPort, () => {
      server.close(() => {
        console.log(`Found available port: ${startPort}`);
        resolve(startPort);
      });
    });
  });
};

// Create Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Chess Society API is working!' });
});

// Contact submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
    
    console.log('Saving contact to database:', contact);
    await contact.save();
    console.log('Contact saved successfully:', contact);
    
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: `Failed to submit contact form: ${error.message}` });
  }
});

// Member registration endpoint
app.post('/api/members/register', async (req, res) => {
  try {
    console.log('Received member registration:', req.body);
    
    // Check if email already exists
    const existingMember = await Member.findOne({ email: req.body.email });
    if (existingMember) {
      console.log('Email already exists:', req.body.email);
      return res.status(409).json({ 
        error: "Email already exists", 
        message: "This email is already registered with us." 
      });
    }
    
    const member = new Member({
      name: `${req.body.firstName} ${req.body.lastName}`,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      experience: req.body.experience,
      message: req.body.message,
      newsletter: req.body.newsletter
    });
    
    console.log('Saving new member to database:', member);
    await member.save();
    console.log('Member saved successfully:', member);
    
    // Update stats count
    await SocietyStats.updateOne({}, { $inc: { members: 1 } }, { upsert: true });
    
    res.status(201).json(member);
  } catch (error) {
    console.error('Error registering member:', error);
    res.status(500).json({ error: `Failed to register member: ${error.message}` });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    console.log('Received newsletter subscription:', req.body);
    
    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: req.body.email });
    if (existingSubscription) {
      console.log('Email already subscribed:', req.body.email);
      return res.status(409).json({ 
        error: "Already subscribed", 
        message: "This email is already subscribed to our newsletter." 
      });
    }
    
    const subscription = new Newsletter({
      email: req.body.email,
      name: req.body.name || ''
    });
    
    console.log('Saving newsletter subscription to database:', subscription);
    await subscription.save();
    console.log('Subscription saved successfully:', subscription);
    
    res.status(201).json(subscription);
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: `Failed to subscribe to newsletter: ${error.message}` });
  }
});

// Set up Vite for development
const setupVite = require('./vite').setupVite;

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Kill any existing processes on port 3000 and 3001
    try {
      console.log('Checking for existing processes on ports 3000 and 3001...');
      console.log('App will use a different port if these are occupied');
    } catch (err) {
      console.log('No processes to kill');
    }
    
    // Use the MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;
    console.log('Connecting to MongoDB...');
    
    // Create connection options with retry
    const mongooseOptions = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    };
    
    await mongoose.connect(mongoURI, mongooseOptions);
    console.log('MongoDB connected successfully!');
    
    // Find an available port starting from 3500
    // This helps avoid conflicts with other services
    const PORT = await findAvailablePort(3500);
    
    // Create HTTP server
    const server = http.createServer(app);
    
    // Set up Vite in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('Setting up Vite development server...');
      setupVite(app, server);
    } else {
      // Serve static files in production
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }
    
    // Start the server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connection established`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    console.error('Details:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Failed to connect to MongoDB. Check your connection string and network.');
    }
    process.exit(1);
  }
}

// Start the server
startServer();