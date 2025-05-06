const express = require('express');
const router = express.Router();

// Dummy success response for any form submissions
router.post('/events', (req, res) => {
  console.log('Event form submission received:', req.body);
  // Just return success with the data they submitted
  res.status(200).json({ success: true, message: "Event submission received", data: req.body });
});

router.post('/contact', (req, res) => {
  console.log('Contact form submission received:', req.body);
  res.status(200).json({ success: true, message: "Contact form received", data: req.body });
});

router.post('/join', (req, res) => {
  console.log('Join form submission received:', req.body);
  res.status(200).json({ success: true, message: "Join request received", data: req.body });
});

router.post('/subscribe', (req, res) => {
  console.log('Newsletter subscription received:', req.body);
  res.status(200).json({ success: true, message: "Subscription successful", data: req.body });
});

// Generic catch-all GET handler for any other API endpoints
router.get('*', (req, res) => {
  res.status(200).json({ message: "Static API endpoint. Using JSON data files for content." });
});

// Generic catch-all POST handler for any other API endpoints
router.post('*', (req, res) => {
  console.log('Form submission received:', req.body);
  res.status(200).json({ success: true, message: "Form submission received", data: req.body });
});

module.exports = router;