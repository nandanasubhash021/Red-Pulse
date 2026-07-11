const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// 1. Connect to MongoDB Atlas Cloud Database
connectDB();

// 2. Middleware Configurations
app.use(cors({
  origin: ['http://localhost:5173', 'https://red-pulse-beige.vercel.app'], // Permits both local development and your production build
  credentials: true
}));
app.use(express.json()); // Parses incoming json requests

// 3. Define Main Application Routes
app.use('/api/auth', require('./routes/auth'));

// 🌟 Emergency Blood Request & Notification System Routes Engine
app.use('/api/requests', require('./routes/requests'));

// 👑 Administrative Dashboard System Gateway Pipeline
app.use('/api/admin', require('./routes/admin'));

// 4. Fallback Root Diagnostic Endpoint
app.get('/', (req, res) => {
  res.send('🔴 Red Pulse Active Monitoring System API is Running Online...');
});

// Export the configured app instance
module.exports = app;