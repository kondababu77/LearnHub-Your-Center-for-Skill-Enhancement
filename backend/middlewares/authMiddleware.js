const jwt = require('jsonwebtoken');
const User = require('../schemas/userModel');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.type === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Teacher only middleware
const teacherOnly = (req, res, next) => {
  if (req.user && (req.user.type === 'Teacher' || req.user.type === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Teacher only.' });
  }
};

// Student only middleware
const studentOnly = (req, res, next) => {
  if (req.user && req.user.type === 'Student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Student only.' });
  }
};

module.exports = { protect, adminOnly, teacherOnly, studentOnly };
