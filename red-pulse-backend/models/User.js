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
  eligibilityAnswers: {
    age: { type: String },
    weight: { type: String },
    hasDisease: { type: Boolean, default: false },
    hadRecentSurgery: { type: Boolean, default: false },
    daysSinceLastDonation: { type: Number, default: 100 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);