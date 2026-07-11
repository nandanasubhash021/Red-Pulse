const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  // 👑 NEW: SYSTEM ACCESS CONTROL CONFIGURATION 
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  eligibilityAnswers: {
    age: { type: String },
    weight: { type: String },
    hasDisease: { type: Boolean, default: false },
    hadRecentSurgery: { type: Boolean, default: false },
    daysSinceLastDonation: { type: Number, default: 100 }
  },
  gender: { 
    type: String, 
    enum: ['male', 'female'], 
    default: 'female' 
  },
  lastDonationDate: { 
    type: Date, 
    default: null 
  },
  healthStatus: {
    type: String,
    enum: ['Eligible to Donate', 'Recent Surgery', 'Medical Condition', 'Temporarily Unavailable'],
    default: 'Eligible to Donate'
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  medicalReason: { 
    type: String, 
    default: "" 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);