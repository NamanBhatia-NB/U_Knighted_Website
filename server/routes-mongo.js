const express = require('express');
const router = express.Router();
const { Member, Event, News, Contact, Newsletter, SocietyStats, Tutorial, Lesson } = require('../models');

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
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
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

// ============= TUTORIAL ROUTES =============

// Get all tutorials
router.get('/tutorials', async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ position: 1 });
    res.json(tutorials);
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    res.status(500).json({ error: 'Failed to fetch tutorials' });
  }
});

// Get a specific tutorial by ID with its lessons
router.get('/tutorials/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' });
    }
    
    const lessons = await Lesson.find({ tutorialId: tutorial._id }).sort({ position: 1 });
    
    res.json({
      tutorial,
      lessons
    });
  } catch (error) {
    console.error('Error fetching tutorial details:', error);
    res.status(500).json({ error: 'Failed to fetch tutorial details' });
  }
});

// Get a specific lesson by ID
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Add a new tutorial
router.post('/tutorials', async (req, res) => {
  try {
    const { title, description, level, coverImage, position } = req.body;
    
    const tutorial = new Tutorial({
      title,
      description,
      level,
      coverImage,
      position: position || 1
    });
    
    await tutorial.save();
    res.status(201).json(tutorial);
  } catch (error) {
    console.error('Error creating tutorial:', error);
    res.status(500).json({ error: 'Failed to create tutorial' });
  }
});

// Add a new lesson to a tutorial
router.post('/tutorials/:tutorialId/lessons', async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.tutorialId);
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' });
    }
    
    const { title, description, content, position, initialPosition, movesSequence, expectedOutcome } = req.body;
    
    const lesson = new Lesson({
      tutorialId: tutorial._id,
      title,
      description,
      content,
      position: position || 1,
      initialPosition,
      movesSequence,
      expectedOutcome
    });
    
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

module.exports = router;