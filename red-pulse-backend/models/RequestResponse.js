const mongoose = require('mongoose');

const RequestResponseSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
  response: { type: String, enum: ['Accepted', 'Rejected'], required: true }
}, { timestamps: true });

// Prevent a donor from responding to the same request multiple times
RequestResponseSchema.index({ donorId: 1, requestId: 1 }, { unique: true });

module.exports = mongoose.model('RequestResponse', RequestResponseSchema);