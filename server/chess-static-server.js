const express = require('express');
const path = require('path');
const fs = require('fs');

// Use environment variable for port or a fallback
const PORT = process.env.PORT || 64738;

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// API route for events
app.get('/api/events', (req, res) => {
  try {
    const eventsData = fs.readFileSync(path.join(__dirname, '../client/src/data/events.json'), 'utf8');
    res.json(JSON.parse(eventsData));
  } catch (error) {
    console.error('Error reading events data:', error);
    res.status(500).json({ error: 'Failed to load events data' });
  }
});

// API route for news
app.get('/api/news', (req, res) => {
  try {
    const newsData = fs.readFileSync(path.join(__dirname, '../client/src/data/news.json'), 'utf8');
    res.json(JSON.parse(newsData));
  } catch (error) {
    console.error('Error reading news data:', error);
    res.status(500).json({ error: 'Failed to load news data' });
  }
});

// API route for members
app.get('/api/members', (req, res) => {
  try {
    const membersData = fs.readFileSync(path.join(__dirname, '../client/src/data/members.json'), 'utf8');
    res.json(JSON.parse(membersData));
  } catch (error) {
    console.error('Error reading members data:', error);
    res.status(500).json({ error: 'Failed to load members data' });
  }
});

// Handle form submissions
app.post('/api/contact', (req, res) => {
  res.json({ success: true, message: 'Contact form received' });
});

app.post('/api/join', (req, res) => {
  res.json({ success: true, message: 'Membership application received' });
});

app.post('/api/newsletter', (req, res) => {
  res.json({ success: true, message: 'Newsletter subscription received' });
});

// Serve index.html for all other routes (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Chess Society] Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
