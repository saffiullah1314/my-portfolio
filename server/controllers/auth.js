const Admin = require('../models/Admin');
const crypto = require('crypto');

// Get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = require('jsonwebtoken').sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(admin, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (err) {
    next(err);
  }
};
