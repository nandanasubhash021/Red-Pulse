const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// 1. Connect to MongoDB Atlas Cloud Database
connectDB();

// 2. Middleware Configurations
app.use(cors()); // Enables cross-origin fetching between front & back ends
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

// 5. Fire up Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});