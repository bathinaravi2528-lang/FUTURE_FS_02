const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

module.exports = router;
