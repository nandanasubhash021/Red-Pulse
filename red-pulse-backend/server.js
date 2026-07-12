const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://red-pulse-87c8.vercel.app"
];

// CORS
app.use(cors({
  origin: function (origin, callback) {

    // Allow Postman, curl etc.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

// Parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/admin", require("./routes/admin"));

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Red Pulse Backend Running Successfully"
  });
});

module.exports = app;