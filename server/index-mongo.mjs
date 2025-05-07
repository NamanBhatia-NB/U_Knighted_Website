import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../db/mongoose.mjs';
import apiRoutes from './routes-mongo.mjs';

// Convert __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Dynamic port allocation to avoid conflicts
const findFreePort = (startPort) => {
  return new Promise(async (resolve, reject) => {
    const { createServer } = await import('http');
    const server = createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} in use, trying ${startPort + 1}`);
        resolve(findFreePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
};

// Function to handle Vite integration
async function setupVite() {
  try {
    console.log('Using ES modules version of Vite setup');
    // Try to dynamically import Vite
    const { default: Vite } = await import('vite');
    return Vite;
  } catch (error) {
    console.error('Error loading Vite:', error);
    // Fallback to commonjs
    const { createServer } = await import('vite');
    return { createServer };
  }
}

// Function to start the server
async function startServer() {
  // Connect to MongoDB
  await connectDB();
  
  // Use port 5000 (default for Replit)
  const PORT = 5000;

  // Create HTTP server
  const { createServer } = await import('http');
  const server = createServer(app);
  
  // Set up Vite in development mode
  try {
    const Vite = await setupVite();
    if (Vite.createServer) {
      const vite = await Vite.createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        optimizeDeps: {
          entries: ['index.html']
        }
      });
      
      app.use(vite.middlewares);
      
      // Serve index.html for all client routes
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        
        try {
          // Serve root path as static file
          res.sendFile(path.resolve(__dirname, '../client/index.html'));
        } catch (e) {
          next(e);
        }
      });
    }
  } catch (error) {
    console.error('Vite server setup failed:', error);
    
    // Fallback to serving static files
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  
  // Start server
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[express] serving on port ${PORT}`);
  });
}

// Handle errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
startServer();