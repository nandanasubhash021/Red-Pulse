const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const RequestResponse = require('../models/RequestResponse');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Safe function to handle legacy/empty profiles without crashing
const checkEligibility = (user) => {
  if (user.healthStatus && user.healthStatus !== 'Eligible to Donate') return false;
  if (!user.lastDonationDate) return true;

  try {
    const lastDate = new Date(user.lastDonationDate);
    const today = new Date();
    if (isNaN(lastDate.getTime())) return true;

    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const userGender = user.gender ? user.gender.toLowerCase() : 'male';
    const coolingDays = userGender === 'female' ? 120 : 90;
    
    return diffDays >= coolingDays;
  } catch (err) {
    console.error("Error evaluating donor cooling window:", err);
    return true; 
  }
};

// 1. CREATE EMERGENCY REQUEST & ALERT MATCHING DONORS
exports.createRequest = async (req, res) => {
  try {
    const { patientName, phoneNumber, bloodGroup, district, hospitalName, unitsRequired, emergencyLevel, additionalNotes } = req.body;

    // Deep inspect the auth context to extract the exact ID format safely
    let currentPatientId = null;
    if (req.user) {
      if (typeof req.user === 'string') {
        currentPatientId = req.user;
      } else if (req.user.user) {
        currentPatientId = req.user.user.id || req.user.user._id;
      } else {
        currentPatientId = req.user.id || req.user._id;
      }
    }

    if (!currentPatientId) {
      return res.status(401).json({ 
        success: false, 
        msg: "Authentication context failed to parse user identification metrics." 
      });
    }

    // Create and save the primary emergency tracker record
    const newRequest = new BloodRequest({
      patientId: currentPatientId,
      patientName,
      phoneNumber,
      bloodGroup,
      district,
      hospitalName,
      unitsRequired,
      emergencyLevel,
      additionalNotes
    });

    const savedRequest = await newRequest.save();

    // Find donors matching basic structural requirements
    const potentialDonors = await User.find({ bloodGroup, district });
    const eligibleDonors = potentialDonors.filter(checkEligibility);

    if (eligibleDonors.length > 0) {
      /* 🌟 FIX: Added the "message" field required by your Notification schema 
         to prevent the "Path message is required" validation failure.
      */
      const notificationRecords = eligibleDonors.map(donor => ({
        donorId: donor._id,
        requestId: savedRequest._id,
        message: `🚨 Emergency: ${bloodGroup} required urgently at ${hospitalName} (${emergencyLevel} priority).`
      }));
      
      await Notification.insertMany(notificationRecords);

      // Automated External Email Engine wrapped in an isolated non-blocking block
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        for (const donor of eligibleDonors) {
          if (donor.email) {
            const mailOptions = {
              from: `"Red Pulse Emergency" <${process.env.EMAIL_USER}>`,
              to: donor.email,
              subject: `🚨 CRITICAL: Emergency ${bloodGroup} Blood Request in ${district}`,
              html: `
                <h3>Emergency Blood Requirement Alert</h3>
                <p>Hello <strong>${donor.name}</strong>,</p>
                <p>An urgent request for <strong>${bloodGroup}</strong> blood has been raised near your location.</p>
                <ul>
                  <li><strong>Patient:</strong> ${patientName}</li>
                  <li><strong>Hospital:</strong> ${hospitalName}</li>
                  <li><strong>Urgency:</strong> ${emergencyLevel}</li>
                </ul>
                <p>Please log into your Red Pulse Dashboard immediately to respond to this request.</p>
              `
            };
            
            await Promise.race([
              transporter.sendMail(mailOptions),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Mail Timeout')), 4000))
            ]).catch(err => console.log(`Email skipped for ${donor.email}: ${err.message}`));
          }
        }
      } catch (emailSystemError) {
        console.error("⚠️ Email dispatch engine encountered configuration issues:", emailSystemError.message);
      }
    }

    return res.status(201).json({ 
      success: true, 
      msg: "Emergency request broadcast initiated successfully!", 
      request: savedRequest 
    });

  } catch (error) {
    console.error("Fatal routing error inside CreateRequest process:", error);
    return res.status(500).json({ success: false, msg: "Server pipeline process failed completely." });
  }
};

// 2. GET ACTIVE LOGS BROADCAST BY THE CURRENT PATIENT
exports.getPatientLogs = async (req, res) => {
  try {
    let currentPatientId = null;
    if (req.user) {
      currentPatientId = typeof req.user === 'string' ? req.user : (req.user.id || req.user._id || (req.user.user && (req.user.user.id || req.user.user._id)));
    }
    const requests = await BloodRequest.find({ patientId: currentPatientId }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to pull tracking histories." });
  }
};

// 3. GET SYSTEM ALERTS PENDING FOR A CURRENT MATCHING DONOR
exports.getDonorAlerts = async (req, res) => {
  try {
    let currentDonorId = null;
    if (req.user) {
      currentDonorId = typeof req.user === 'string' ? req.user : (req.user.id || req.user._id || (req.user.user && (req.user.user.id || req.user.user._id)));
    }
    const alerts = await Notification.find({ donorId: currentDonorId })
      .populate('requestId')
      .sort({ createdAt: -1 });
    res.json({ success: true, notifications: alerts });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to compile live matching alert lists." });
  }
};

// 4. ACTION INTERACTION ROUTE: RESPOND (ACCEPT / DECLINE)
exports.respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    let currentDonorId = null;
    if (req.user) {
      currentDonorId = typeof req.user === 'string' ? req.user : (req.user.id || req.user._id || (req.user.user && (req.user.user.id || req.user.user._id)));
    }

    if (action === 'Accepted') {
      const liveResponse = new RequestResponse({
        requestId,
        donorId: currentDonorId,
        status: 'Accepted'
      });
      await liveResponse.save();
    }

    await Notification.deleteOne({ donorId: currentDonorId, requestId });
    res.json({ success: true, msg: "Action processed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to record response status." });
  }
};

// 5. GET DETAILS OF RESPONDING DONORS FOR A TRACKED CARD
exports.getAcceptedDonors = async (req, res) => {
  try {
    const responses = await RequestResponse.find({ requestId: req.params.requestId, status: 'Accepted' })
      .populate('donorId', 'name bloodGroup district phone email');
    
    const donors = responses.map(r => r.donorId).filter(Boolean);
    res.json({ success: true, donors });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to extract matching donor arrays." });
  }
};