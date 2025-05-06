const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { createServer: createViteServer } = require('vite');

// Define alternative ports to try
const PORTS = [3000, 39876, 8000, 5173, 64738];

async function startServer() {
  const app = express();
  
  // Configure Vite in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  
  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // API routes for static data
  app.get('/api/events', (req, res) => {
    try {
      const eventsData = fs.readFileSync(path.join(__dirname, '../client/src/data/events.json'), 'utf8');
      res.json(JSON.parse(eventsData));
    } catch (error) {
      console.error('Error reading events data:', error);
      res.status(500).json({ error: 'Failed to load events data' });
    }
  });
  
  app.get('/api/news', (req, res) => {
    try {
      const newsData = fs.readFileSync(path.join(__dirname, '../client/src/data/news.json'), 'utf8');
      res.json(JSON.parse(newsData));
    } catch (error) {
      console.error('Error reading news data:', error);
      res.status(500).json({ error: 'Failed to load news data' });
    }
  });
  
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
  
  // Try each port in sequence
  tryPort(0);
  
  function tryPort(index) {
    if (index >= PORTS.length) {
      console.error('All ports are in use. Could not start server.');
      process.exit(1);
      return;
    }
    
    const port = PORTS[index];
    const server = http.createServer(app);
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Trying next port...`);
        server.close();
        tryPort(index + 1);
      } else {
        console.error('Server error:', err);
      }
    });
    
    server.listen(port, '0.0.0.0', () => {
      console.log(`[Chess Society] Server running on http://localhost:${port}`);
    });
  }
}

startServer();