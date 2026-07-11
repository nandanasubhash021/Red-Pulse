const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// 1. Connect to MongoDB Atlas Cloud Database
connectDB();

// 2. Middleware Configurations
const allowedOrigins = [
  'http://localhost:5173',
  'https://red-pulse-ivory.vercel.app',
  'https://red-pulse-87c8.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicitly handle preflight OPTIONS requests globally
app.options('*', cors());

app.use(express.json()); // Parses incoming json requests

// 3. Define Main Application Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/admin', require('./routes/admin'));

// 4. Fallback Root Diagnostic Endpoint
app.get('/', (req, res) => {
  res.send('🔴 Red Pulse Active Monitoring System API is Running Online...');
});

// Export the configured app instance
module.exports = app;