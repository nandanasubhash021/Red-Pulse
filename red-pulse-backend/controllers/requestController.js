const BloodRequest = require('../models/BloodRequest');
const RequestResponse = require('../models/RequestResponse');
const Notification = require('../models/Notification');

// 1. CREATE EMERGENCY REQUEST 
exports.createRequest = async (req, res) => {
  try {
    const { bloodGroup, unitsRequired, emergencyLevel, hospitalName, district, additionalNotes } = req.body;
    
    let requesterId = null;
    if (req.user) {
      requesterId = typeof req.user === 'string' ? req.user : (req.user._id || req.user.id || (req.user.user && (req.user.user._id || req.user.user.id)));
    }

    const newRequest = new BloodRequest({
      userId: requesterId,
      bloodGroup,
      unitsRequired,
      emergencyLevel,
      hospitalName,
      district,
      additionalNotes,
      status: 'Active'
    });

    await newRequest.save();
    res.status(201).json({ success: true, request: newRequest });
  } catch (err) {
    console.error("Error creating blood request:", err);
    res.status(500).json({ success: false, msg: "Failed to broadcast request." });
  }
};

// 2. FETCH ACTIVE LOG HISTORY
exports.getActiveRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    console.error("Error fetching active requests:", err);
    res.status(500).json({ success: false, msg: "Failed to fetch live requests." });
  }
};

// 3. FETCH LIVE MATCH ALERTS MATCHING DONOR
exports.getDonorNotifications = async (req, res) => {
  try {
    let currentDonorId = null;
    if (req.user) {
      currentDonorId = typeof req.user === 'string' ? req.user : (req.user._id || req.user.id || (req.user.user && (req.user.user._id || req.user.user.id)));
    }

    const notifications = await Notification.find({ donorId: currentDonorId })
      .populate('requestId')
      .sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ success: false, msg: "Failed to load notifications." });
  }
};

// 4. SUBMIT OPERATIONAL RESPONSE ACTION (FIXED ACCEPTER DISPATCH SYSTEM)
exports.respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    let currentDonorId = null;
    
    // Safety token decoder tree
    if (req.user) {
      if (typeof req.user === 'string') {
        currentDonorId = req.user;
      } else {
        currentDonorId = req.user._id || req.user.id || 
                         (req.user.user && (req.user.user._id || req.user.user.id));
      }
    }

    if (!currentDonorId) {
      return res.status(401).json({ 
        success: false, 
        msg: "Unauthorized: Missing core token identification variables." 
      });
    }

    // Standardize text strings mapping rules
    const localizedAction = (action === 'Accepted' || action === 'Accept') ? 'Accepted' : 'Rejected';
    let patientDetails = null;

    if (localizedAction === 'Accepted') {
      // Clean up previous conflicting entries first to ensure fresh validation writes
      await RequestResponse.deleteOne({ requestId, donorId: currentDonorId });
      
      const newResponseRecord = new RequestResponse({
        requestId,
        donorId: currentDonorId,
        response: 'Accepted'
      });
      await newResponseRecord.save();

      // Extract details about the original target blood request for frontend popup
      const targetRequest = await BloodRequest.findById(requestId);
      if (targetRequest) {
        patientDetails = {
          patientName: targetRequest.patientName || "Emergency Case",
          contactNumber: targetRequest.phoneNumber || "Unavailable",
          bloodGroup: targetRequest.bloodGroup,
          unitsNeeded: targetRequest.unitsRequired,
          hospitalName: targetRequest.hospitalName
        };
      }
    }

    // Clean up matching alert notification from donor view panel
    await Notification.deleteOne({ donorId: currentDonorId, requestId });
    
    return res.json({ 
      success: true, 
      msg: `Response successfully processed as ${localizedAction}`,
      patientDetails 
    });
  } catch (err) {
    console.error("❌ CRITICAL BACKEND ACTION LOOP FAIL:", err.message);
    return res.status(500).json({ 
      success: false, 
      msg: "Internal database server constraint crash. Review terminal logs.",
      error: err.message 
    });
  }
};

// 5. CHECK REAL-TIME ACCEPTED DONORS LISTINGS FOR THE REQUESTER TAB
exports.getAcceptedDonors = async (req, res) => {
  try {
    const responses = await RequestResponse.find({ 
      requestId: req.params.requestId, 
      response: 'Accepted' 
    }).populate('donorId', 'name phone bloodGroup email district');
    
    // Map array elements down to match flat object layouts smoothly
    const donors = responses.map(r => r.donorId).filter(Boolean);
    res.json({ success: true, donors });
  } catch (err) {
    console.error("Error matching tracking arrays:", err);
    res.status(500).json({ success: false, msg: "Failed parsing tracked responder data lists." });
  }
};