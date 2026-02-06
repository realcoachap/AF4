const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const app = express();
const server = createServer(app);

// Import database connection to ensure it's initialized
const db = require('./config/db');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
      fontSrc: ["'self'", "https:", "http:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow all origins for now to fix potential issues
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Trust proxy for Railway
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to requests per windowMs
  trustProxy: true
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve from the correct location
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const healthRoutes = require('./routes/health');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/health', healthRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ascending Fitness v4.1.1 API Server Running',
    version: '4.1.1',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Serve different pages based on route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/profile.html'));
});

app.get('/edit-profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/edit-profile.html'));
});

// Serve login page for any other non-API route that doesn't match static files
app.get('*', (req, res) => {
  // If it's not an API route, serve login page
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
});

const PORT = process.env.PORT || 5000;

// Initialize database tables on startup with retry logic
async function initializeDatabase() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Wait a bit for the database to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test the database connection first
      const db = require('./config/db');
      await db.query('SELECT NOW()');
      console.log('Database connection established successfully');
      
      // Import the initDb function and call it
      const initDb = require('./config/init-db');
      await initDb();
      
      console.log('Database initialization completed');
      break;
    } catch (err) {
      attempts++;
      console.error(`Database initialization attempt ${attempts} failed:`, err.message);
      
      if (attempts >= maxAttempts) {
        console.error('Max database initialization attempts reached');
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

initializeDatabase();

server.listen(PORT, async () => {
  console.log(`Ascending Fitness v4.1.1 server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  
  // Test database connection
  try {
    await db.query('SELECT NOW()');
    console.log('Database connection established successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
});

module.exports = { app, server };