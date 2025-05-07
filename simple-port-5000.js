// A simplified server that only serves static files and listens on port 5000
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Respond to all requests with the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Listen on port 5000 for Replit compatibility
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});