const express = require('express');
const router = express.Router();
const { Member, Event, News, Contact, Newsletter, SocietyStats } = require('../models');

// Get society stats
router.get('/society/stats', async (req, res) => {
  try {
    let stats = await SocietyStats.findOne();
    if (!stats) {
      stats = await SocietyStats.create({});
    }
    res.json(stats);
  } catch (error) {
    console.error('Error fetching society stats:', error);
    res.status(500).json({ error: 'Failed to fetch society stats' });
  }
});

// Get all members
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find().select('-message -newsletter');
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Register a new member
router.post('/members/register', async (req, res) => {
  try {
    // Check if email already exists
    const existingMember = await Member.findOne({ email: req.body.email });
    if (existingMember) {
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
    
    await member.save();
    
    // Update stats count
    await SocietyStats.updateOne({}, { $inc: { members: 1 } }, { upsert: true });
    
    res.status(201).json(member);
  } catch (error) {
    console.error('Error registering member:', error);
    res.status(500).json({ error: 'Failed to register member' });
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event
router.post('/events', async (req, res) => {
  try {
    const { title, type, date, timeStart, timeEnd, description, location } = req.body;
    
    // Validate required fields
    if (!title || !type || !date || !timeStart || !timeEnd || !description || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const event = new Event({
      title,
      type,
      date,
      timeStart,
      timeEnd,
      description,
      location
    });
    
    await event.save();
    
    // Update society stats - increment tournaments if it's a tournament
    if (type.toLowerCase() === 'tournament') {
      await SocietyStats.updateOne({}, { $inc: { tournaments: 1 } }, { upsert: true });
    }
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/events/:id', async (req, res) => {
  try {
    const { title, type, date, timeStart, timeEnd, description, location } = req.body;
    
    // Validate required fields
    if (!title || !type || !date || !timeStart || !timeEnd || !description || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        type,
        date,
        timeStart,
        timeEnd,
        description,
        location
      },
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Update society stats - decrement tournaments if it was a tournament
    if (event.type.toLowerCase() === 'tournament') {
      await SocietyStats.updateOne({}, { $inc: { tournaments: -1 } });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get all news
router.get('/news', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Submit contact form
router.post('/contact', async (req, res) => {
  try {
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
    
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Subscribe to newsletter
router.post('/newsletter/subscribe', async (req, res) => {
  try {
    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: req.body.email });
    if (existingSubscription) {
      return res.status(409).json({ 
        error: "Email already subscribed", 
        message: "This email address is already subscribed to our newsletter." 
      });
    }
    
    const subscription = new Newsletter({
      email: req.body.email,
      name: req.body.name || ''
    });
    
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
});



module.exports = router;