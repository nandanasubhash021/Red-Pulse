const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// 🌟 CENTRALIZED DONATION ELIGIBILITY CALCULATION ENGINE
const calculateDonorStatus = (user) => {
  // 1. Evaluate Explicit Unavailability first (Surgery, Medical Condition, etc.)
  if (!user.isAvailable) {
    if (user.healthStatus === 'Temporarily Unavailable') {
      return { statusText: 'Temporarily Unavailable', isEligible: false };
    }
    return { statusText: 'Medical Restriction', isEligible: false };
  }

  // 2. If the user has never donated, or field is empty/null, they are immediately eligible
  if (!user.lastDonationDate || user.lastDonationDate === "") {
    return { statusText: 'Eligible to Donate', isEligible: true };
  }

  const lastDate = new Date(user.lastDonationDate);
  
  // Fallback: If the DB has a malformed date string, treat as eligible
  if (isNaN(lastDate.getTime())) {
    return { statusText: 'Eligible to Donate', isEligible: true };
  }

  // 3. Evaluate the Cooling Period (Zero out hours for pure calendar-day comparison)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Rule matrix: Male = 90 days, Female = 120 days
  const coolingPeriodRequired = user.gender === 'male' ? 90 : 120;

  if (diffDays >= 0 && diffDays < coolingPeriodRequired) {
    const daysRemaining = coolingPeriodRequired - diffDays;
    return { 
      statusText: `Cooling Period (${daysRemaining} days remaining)`, 
      isEligible: false 
    };
  }

  return { statusText: 'Eligible to Donate', isEligible: true };
};

// @route   POST api/auth/register
// @desc    Register a new blood donor user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, address, district, password, eligibilityAnswers } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already registered with this email ID' });
    }

    // EXPLICIT REQUIREMENT: New users must be eligible by default
    user = new User({
      name,
      email,
      phone,
      bloodGroup,
      address,
      district,
      password,
      eligibilityAnswers: eligibilityAnswers || {},
      isAvailable: true,
      healthStatus: 'Eligible to Donate',
      lastDonationDate: null // Explicitly enforce null for newly registered users
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'redpulse_secret_key', 
      { expiresIn: '3h' }, 
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: { id: user.id, name: user.name, email: user.email }
        });
      }
    );

  } catch (err) {
    console.error("Backend Registration Error:", err.message);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Email ID or Password' });
    }

    // 2. Compare entered password with the encrypted password in MongoDB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Email ID or Password' });
    }

    // 3. Generate a fresh JWT session token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'redpulse_secret_key',
      { expiresIn: '3h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );

  } catch (err) {
    console.error("Backend Login Error:", err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// 🌟 MODIFIED: HIGH-PERFORMANCE ELIGIBLE DONOR SEARCH ROUTE
// @route   GET api/auth/search
// @desc    Search for available and medically eligible blood donors
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, district } = req.query;
    
    if (!bloodGroup || !district) {
      return res.status(400).json({ msg: "Blood group and district parameters are required." });
    }

    // Calculate maximum cutoff points in time relative to midnight today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time to prevent timezone/hour shifting bugs
    
    const maleCutoffDate = new Date(today);
    maleCutoffDate.setDate(maleCutoffDate.getDate() - 90);

    const femaleCutoffDate = new Date(today);
    femaleCutoffDate.setDate(femaleCutoffDate.getDate() - 120);

    // Apply rigorous filtration variables down on the MongoDB query layer
    let query = {
      bloodGroup: bloodGroup,
      district: { $regex: district, $options: 'i' }, // Preserved your case-insensitive match
      isAvailable: true, // Drops surgeries, conditions, and manual blocks instantly
      $or: [
        { lastDonationDate: null }, // Never donated before
        { lastDonationDate: { $exists: false } }, // Catches fields that don't exist at all
        { lastDonationDate: "" }, // Catches empty strings if accidentally saved
        { gender: 'male', lastDonationDate: { $lte: maleCutoffDate } }, // Male past 90 days cooling period
        { gender: 'female', lastDonationDate: { $lte: femaleCutoffDate } }, // Female past 120 days cooling period
        { gender: { $nin: ['male', 'female'] }, lastDonationDate: { $lte: femaleCutoffDate } } // Fallback safety for unselected gender
      ]
    };

    const donors = await User.find(query).select('-password');
    res.status(200).json(donors);
  } catch (err) {
    console.error("Search API Error:", err.message);
    res.status(500).send('Server Error: ' + err.message);
  }
});

// 🌟 MODIFIED: ROUTE EXTENDED TO RECALCULATE & RETURN COMPLEX PROFILE STATUSES
// @route   GET api/auth/me
// @desc    Get currently logged-in donor profile details along with dynamic computations
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'No token found, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User profile does not exist in database' });
    }

    // Process dynamic medical engine status mapping
    const eligibility = calculateDonorStatus(user);

    // Format structure response precisely to complement UserDashboard.jsx states
    res.status(200).json({
      success: true,
      user,
      computedStatus: eligibility.statusText
    });
  } catch (err) {
    console.error("Profile API Fetch Error:", err.message);
    res.status(401).json({ msg: 'Token validation failed or expired' });
  }
});

// 🌟 NEWLY ADDED: MEDICAL UPDATE STRATEGIC SAVE ENDPOINT
// @route   PUT api/auth/update-medical
// @desc    Update medical tracking metrics, compute eligibility states and save
// @access  Private
router.put('/update-medical', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'No token found, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    const { gender, lastDonationDate, healthStatus } = req.body;

    // Enforce business rules logic for availability switches
    let isAvailable = true;
    let medicalReason = "";

    if (healthStatus !== "Eligible to Donate") {
      isAvailable = false;
      medicalReason = healthStatus; 
    }

    // Safely parse the date, or map empty strings back to null securely
    const validDate = (lastDonationDate && lastDonationDate.trim() !== "") 
      ? new Date(lastDonationDate) 
      : null;

    // Persist changes directly into database document
    const updatedUser = await User.findByIdAndUpdate(
      decoded.user.id,
      {
        gender,
        lastDonationDate: validDate,
        healthStatus,
        isAvailable,
        medicalReason
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User profile does not exist' });
    }

    // Recalculate dynamic tracking tags post-mutation
    const eligibility = calculateDonorStatus(updatedUser);

    res.status(200).json({
      success: true,
      user: updatedUser,
      computedStatus: eligibility.statusText
    });
  } catch (err) {
    console.error("Profile API Update Error:", err.message);
    res.status(500).json({ msg: 'Server Error: Could not save profile metrics' });
  }
});

module.exports = router;