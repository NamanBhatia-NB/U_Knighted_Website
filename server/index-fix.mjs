import express from 'express';
import path from 'path';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'chess-society-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');

    // Import routes (using dynamic import for ES modules)
    const routesModule = await import('./routes-mongo.js');
    const routes = routesModule.default;
    
    // Mount the router on the '/api' path
    app.use('/api', routes);
    
    // Create and start server
    const server = http.createServer(app);
    
    // For Replit compatibility - hardcode port 5000
    const PORT = 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[express] Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});