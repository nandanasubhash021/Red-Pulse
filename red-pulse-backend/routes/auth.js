const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User'); 
const BloodBank = require('../models/BloodBank'); 

// --- Helper: Centralized Donor Eligibility ---
const calculateDonorStatus = (user) => {
  if (!user.isAvailable) return { statusText: user.healthStatus || 'Medical Restriction', isEligible: false };
  if (!user.lastDonationDate) return { statusText: 'Eligible to Donate', isEligible: true };

  const lastDate = new Date(user.lastDonationDate);
  const diffDays = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
  const coolingPeriod = user.gender === 'male' ? 90 : 120;

  if (diffDays >= 0 && diffDays < coolingPeriod) {
    return { statusText: `Cooling Period (${coolingPeriod - diffDays} days remaining)`, isEligible: false };
  }
  return { statusText: 'Eligible to Donate', isEligible: true };
};

// --- USER ROUTES ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, bloodGroup, district, address } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, phone, bloodGroup, district, address, password });
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'redpulse_secret_key', { expiresIn: '3h' });
    res.status(200).json({ token, user: { id: user.id, name: user.name } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'redpulse_secret_key', { expiresIn: '3h' });
    res.status(200).json({ token, user: { id: user.id, name: user.name } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    const user = await User.findById(decoded.user.id).select('-password');
    res.status(200).json({ success: true, user, computedStatus: calculateDonorStatus(user).statusText });
  } catch (err) { res.status(401).json({ msg: 'Invalid token' }); }
});

// --- FILTERED SEARCH ---
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, district } = req.query;
    const today = new Date();
    const maleCutoff = new Date(today - 90 * 24 * 60 * 60 * 1000);
    const femaleCutoff = new Date(today - 120 * 24 * 60 * 60 * 1000);

    const donors = await User.find({
      bloodGroup,
      district: { $regex: district, $options: 'i' },
      isAvailable: true,
      $or: [
        { lastDonationDate: null },
        { gender: 'male', lastDonationDate: { $lte: maleCutoff } },
        { gender: 'female', lastDonationDate: { $lte: femaleCutoff } }
      ]
    }).select('-password');
    res.status(200).json(donors);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// --- NEW ADDED ROUTE: SEARCH BLOOD BANKS BY INVENTORY CAPACITY ---
router.get('/search-blood-banks', async (req, res) => {
  try {
    const { bloodGroup, component, units, district } = req.query;
    const unitsNeeded = Number(units);

    // Dynamically maps values to match your schema path hierarchy (e.g., inventory.A+.platelets)
    const inventoryPath = `inventory.${bloodGroup}.${component}`;

    const query = {
      district: { $regex: district, $options: 'i' },
      [inventoryPath]: { $gte: unitsNeeded }
    };

    const bloodBanks = await BloodBank.find(query).select('-password');
    res.status(200).json(bloodBanks);
  } catch (err) { 
    res.status(500).json({ msg: 'Search processing error: ' + err.message }); 
  }
});

// --- ADDED: MEDICAL UPDATE ROUTE (Fixes Timeout) ---
router.put('/update-medical', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    const user = await User.findById(decoded.user.id);
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const { gender, lastDonationDate, healthStatus } = req.body;
    user.gender = gender;
    user.lastDonationDate = lastDonationDate || null;
    user.healthStatus = healthStatus || 'Eligible to Donate';
    user.isAvailable = (healthStatus === 'Eligible to Donate');
    
    user.markModified('lastDonationDate');
    user.markModified('isAvailable');
    
    await user.save();
    res.status(200).json({ success: true, user, computedStatus: calculateDonorStatus(user).statusText });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// --- BLOOD BANK ROUTES ---
router.post('/bloodbank/register', async (req, res) => {
  try {
    const bloodBank = new BloodBank({ ...req.body, password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)) });
    await bloodBank.save();
    const token = jwt.sign({ user: { id: bloodBank.id, role: 'bloodbank' } }, process.env.JWT_SECRET || 'redpulse_secret_key', { expiresIn: '3h' });
    res.status(201).json({ token, user: { id: bloodBank.id, name: bloodBank.name } });
  } catch (err) { res.status(400).json({ msg: err.message }); }
});

router.post('/bloodbank/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const bb = await BloodBank.findOne({ email });
    if (!bb) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, bb.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ user: { id: bb.id, role: 'bloodbank' } }, process.env.JWT_SECRET || 'redpulse_secret_key', { expiresIn: '3h' });
    res.status(200).json({ token, user: { id: bb.id, name: bb.name } });
  } catch (err) { res.status(500).json({ msg: 'Login failed: ' + err.message }); }
});

router.get('/bloodbank/me', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    const bloodBank = await BloodBank.findById(decoded.user.id).select('-password');
    res.status(200).json({ success: true, bloodBank });
  } catch (err) { res.status(401).json({ msg: 'Unauthorized' }); }
});

router.put('/bloodbank/profile', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    
    const { name, operatingHours, contactPersonName, contactPersonNumber, address, password } = req.body;
    const updateData = { name, operatingHours, contactPersonName, contactPersonNumber, address };
    
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    }

    const bloodBank = await BloodBank.findByIdAndUpdate(decoded.user.id, updateData, { new: true }).select('-password');
    res.status(200).json({ success: true, bloodBank });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed: ' + err.message });
  }
});

router.put('/bloodbank/inventory', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    const { bloodGroup, component, units, action } = req.body;

    const bb = await BloodBank.findById(decoded.user.id);
    if (!bb.inventory) bb.inventory = {};
    if (!bb.inventory[bloodGroup]) bb.inventory[bloodGroup] = { wholeBlood:0, prbc:0, platelets:0, plasma:0 };

    const val = Number(bb.inventory[bloodGroup][component] || 0);
    bb.inventory[bloodGroup][component] = action === 'add' ? val + Number(units) : Math.max(0, val - Number(units));
    
    bb.markModified('inventory');
    await bb.save();
    res.status(200).json({ success: true, bloodBank: bb });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;