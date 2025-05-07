import 'dotenv/config';
import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import connectDB from '../db/mongoose.js';
import routes from './routes-mongo.js';

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main async function
const main = async () => {
  await connectDB();

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/api', routes);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    const PORT = 5000; // Fixed port for Replit
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[express] serving on port ${PORT}`);
    });
  } else {
    const { setupVite } = await import('./vite.js');
    const server = http.createServer(app);
    setupVite(app, server);

    const PORT = 5000; // Fixed port for Replit
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[express] serving on port ${PORT}`);
    });
  }

  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
};

main().catch(err => {
  console.error('Startup error:', err);
});
