// Super simplified server to get the app working
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

// Create Express app for API
const app = express();

// Enable JSON parsing for API requests
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Basic API routes
app.get('/api/society/stats', (req, res) => {
  // Return hardcoded stats for now
  res.json({
    members: 120,
    tournaments: 15,
    championships: 8
  });
});

// Add more API endpoints as needed
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.status(200).json({ message: 'Contact form received successfully' });
});

app.post('/api/join', (req, res) => {
  console.log('Join form submission:', req.body);
  res.status(200).json({ message: 'Join request received successfully' });
});

// API error handling
app.use('/api', (err, req, res, next) => {
  console.error('API error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Vite dev server for the frontend
function startViteDevServer() {
  console.log('Starting Vite dev server...');
  const vite = spawn('npx', ['vite'], {
    cwd: path.join(__dirname),
    stdio: 'inherit',
    shell: true
  });

  vite.on('error', (error) => {
    console.error('Failed to start Vite dev server:', error);
  });

  vite.on('close', (code) => {
    if (code !== 0) {
      console.log(`Vite dev server exited with code ${code}`);
    }
  });
}

// Use port 5000 for API server
const PORT = process.env.PORT || 5000;

// Start the API server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://localhost:${PORT}`);
  
  // Start Vite dev server for frontend
  startViteDevServer();
});