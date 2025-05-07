require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Member, Event, News, Contact, Newsletter, SocietyStats } = require('../models');

// Set up MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chess_society';
console.log('Attempting to connect to MongoDB...');

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
    startServer();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3001; // Use environment variable or default

  // Middleware to parse JSON
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // API Routes
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
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

  // Serve static files
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle all other routes as static
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}
