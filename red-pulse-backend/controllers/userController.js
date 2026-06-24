const User = require('../models/User');
const { calculateDonorStatus } = require('../utils/eligibility');

// @desc    Update Medical & Availability settings from User Dashboard Profile
// @route   PUT /api/auth/update-medical
// @access  Private
exports.updateMedicalProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From your JWT auth middleware
    const { gender, lastDonationDate, healthStatus } = req.body;

    // Apply conditional rules based on requirements
    let isAvailable = true;
    let medicalReason = "";

    if (healthStatus !== "Eligible to Donate") {
      isAvailable = false;
      medicalReason = healthStatus; // Captures 'Recent Surgery', 'Medical Condition', etc.
    }

    // Update fields in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        gender,
        lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
        healthStatus,
        isAvailable,
        medicalReason
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Dynamic state recalculation
    const eligibility = calculateDonorStatus(updatedUser);

    res.status(200).json({
      success: true,
      message: "Profile and eligibility updated successfully.",
      user: updatedUser,
      computedStatus: eligibility.statusText
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current User Profile with Computed Dashboard Status Layout Strings
// @route   GET /api/auth/me
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const eligibility = calculateDonorStatus(user);

    res.status(200).json({
      success: true,
      user,
      computedStatus: eligibility.statusText
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find Eligible Donors matching explicit filter criteria
// @route   GET /api/donors/search
// @access  Private/Public (depending on configuration)
exports.findEligibleDonors = async (req, res) => {
  try {
    const { bloodGroup, district } = req.query;

    if (!bloodGroup || !district) {
      return res.status(400).json({ success: false, message: "Blood group and district are required parameters." });
    }

    // Determine the exact calendar cutoff times relative to right now
    const today = new Date();
    
    const maleCutoffDate = new Date(today);
    maleCutoffDate.setDate(maleCutoffDate.getDate() - 90);

    const femaleCutoffDate = new Date(today);
    femaleCutoffDate.setDate(femaleCutoffDate.getDate() - 120);

    // High-performance search index query architecture
    const eligibleDonors = await User.find({
      bloodGroup: bloodGroup,
      district: district,
      isAvailable: true, // Drops surgeries, medical conditions, and manual blocks instantly
      $or: [
        { lastDonationDate: null }, // Never donated before
        { gender: 'male', lastDonationDate: { $lte: maleCutoffDate } }, // Male past cooling threshold
        { gender: 'female', lastDonationDate: { $lte: femaleCutoffDate } } // Female past cooling threshold
      ]
    }).select("name email bloodGroup district healthStatus gender"); // Redact passwords and tokens

    res.status(200).json({
      success: true,
      count: eligibleDonors.length,
      donors: eligibleDonors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};