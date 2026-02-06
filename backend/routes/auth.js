const express = require('express');
const { register, login, logout, getCurrentUser, refreshToken } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

// Admin routes (for trainer management)
router.post('/register-trainer', authenticateToken, authorizeRoles(['admin']), register);

module.exports = router;