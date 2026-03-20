const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const Lead = require('../models/leadModel');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(res.statusCode || 500);
    res.json({ message: error.message });
  }
};

// @desc    Register a new user & auto-add as lead
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findByEmail(email);

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (userId) {
      // Automatically add as a new lead
      await Lead.create({
        name,
        email,
        source: 'Self-Registration',
        status: 'new', // Requirement: added as a new lead
      });

      res.status(201).json({
        id: userId,
        name,
        email,
        token: generateToken(userId),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode || 500);
    res.json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = { loginUser, registerUser };
