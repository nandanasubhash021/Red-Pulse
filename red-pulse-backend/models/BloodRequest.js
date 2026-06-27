const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  district: { type: String, required: true },
  hospitalName: { type: String, required: true },
  unitsRequired: { type: Number, required: true, default: 1 },
  emergencyLevel: { type: String, enum: ['Normal', 'Urgent', 'Critical'], default: 'Urgent' },
  additionalNotes: { type: String },
  status: { type: String, enum: ['Searching', 'Completed', 'Cancelled'], default: 'Searching' }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);