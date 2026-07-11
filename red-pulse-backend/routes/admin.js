const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');

// --- Middleware Guard: Secure Authorization Verification ---
const adminGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);
    
    if (!token) {
      return res.status(401).json({ success: false, msg: 'Access validation token is missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'redpulse_secret_key');
    
    // Validate role assignments safely
    if (decoded.user && decoded.user.role === 'admin') {
      req.adminId = decoded.user.id;
      return next();
    }
    
    return res.status(403).json({ success: false, msg: 'Access Denied: Administrative permissions required.' });
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Session expired or token authentication failed.' });
  }
};

// 📊 GET OVERALL SYSTEM METRICS AND REPORT STATS
router.get('/stats', adminGuard, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRequests = await BloodRequest.countDocuments({});
    const urgentRequests = await BloodRequest.countDocuments({ isUrgent: true });

    // Aggregate user base grouped by their corresponding blood group tags
    const bloodGroupStats = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRequests,
        urgentRequests,
        bloodGroupStats
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Database calculation error: ' + err.message });
  }
});

// 👥 GET LIST OF REGISTERED DONORS
router.get('/users', adminGuard, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Failed to extract database logs: ' + err.message });
  }
});

// 🗑️ PURGE TARGET DONOR DOCUMENT PROFILE
router.delete('/users/:id', adminGuard, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, msg: 'Profile registry record not found.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: 'Target profile permanently purged from records.' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Failed to complete execution: ' + err.message });
  }
});

module.exports = router;