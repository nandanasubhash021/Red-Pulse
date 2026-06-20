const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

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

    user = new User({
      name,
      email,
      phone,
      bloodGroup,
      address,
      district,
      password,
      eligibilityAnswers: eligibilityAnswers || {} 
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });

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
      process.env.JWT_SECRET,
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

module.exports = router;