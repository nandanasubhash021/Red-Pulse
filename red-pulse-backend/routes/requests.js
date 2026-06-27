const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware'); // Replace with your exact auth middleware file path if named differently

// All emergency routes must be protected behind validation tokens
router.use(authMiddleware);

// 1. Broadcast new request
router.post('/create', requestController.createRequest);

// 2. Fetch log history created by a patient
router.get('/patient-logs', requestController.getPatientLogs);

// 3. Fetch live emergency notifications matching a donor
router.get('/donor-alerts', requestController.getDonorAlerts);

// 4. Submit an operational response action (Accept/Decline)
router.post('/respond', requestController.respondToRequest);

// 5. Check real-time accepted donor list logs for a request card
router.get('/accepted-donors/:requestId', requestController.getAcceptedDonors);

module.exports = router;