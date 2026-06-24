const express = require('express');
const router = express.Router();
const { findEligibleDonors } = require('../controllers/userController');

router.get('/search', findEligibleDonors);

module.exports = router;