const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate token middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Fetch user from database to ensure they still exist and are active
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      console.error('Token verification error:', error);
      return res.status(500).json({ message: 'Token verification failed' });
    }
  }
};

// Authorize roles middleware
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};