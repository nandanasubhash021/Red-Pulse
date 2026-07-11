const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware'); 

// All emergency routes must be protected behind validation tokens
router.use(authMiddleware);

// 1. Broadcast new request
router.post('/create', requestController.createRequest);

// 2. Fetch log history created by a patient (FIXED: Aligned with getActiveRequests)
router.get('/patient-logs', requestController.getActiveRequests);

// 3. Fetch live emergency notifications matching a donor (FIXED: Aligned with getDonorNotifications)
router.get('/donor-alerts', requestController.getDonorNotifications);

// 4. Submit an operational response action (Accept/Decline)
router.post('/respond', requestController.respondToRequest);

// 5. Check real-time accepted donor list logs for a request card
router.get('/accepted-donors/:requestId', requestController.getAcceptedDonors);

module.exports = router;