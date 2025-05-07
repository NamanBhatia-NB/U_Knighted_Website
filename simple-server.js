import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB...');
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

// Import and use routes
import routes from './server/routes-mongo.js';
app.use('/api', routes);

// Serve static files
app.use(express.static(path.join(__dirname, 'client/public')));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});