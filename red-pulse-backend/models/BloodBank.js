const mongoose = require('mongoose');

const BloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  contactPersonNumber: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  operatingHours: { type: String, required: true },
  password: { type: String, required: true },
  inventory: {
    'A+': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } },
    'A-': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } },
    'B+': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } },
    'B-': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } },
    'AB+': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } },
    'AB-': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } },
    'O+': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } },
    'O-': { wholeBlood: { type: Number, default: 0 }, prbc: { type: Number, default: 0 }, platelets: { type: Number, default: 0 }, plasma: { type: Number, default: 0 } }
  },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BloodBank', BloodBankSchema);