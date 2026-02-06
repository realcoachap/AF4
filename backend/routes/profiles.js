const express = require('express');
const { 
  getProfile, 
  updateProfile, 
  createProfile,
  getOwnProfile,
  updateOwnProfile 
} = require('../controllers/profileController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for authenticated users
router.get('/me', authenticateToken, getOwnProfile);
router.post('/me', authenticateToken, createProfile);
router.put('/me', authenticateToken, updateOwnProfile);

// Admin/Trainer routes
router.get('/:userId', authenticateToken, authorizeRoles(['admin', 'trainer']), getProfile);
router.put('/:userId', authenticateToken, authorizeRoles(['admin', 'trainer']), updateProfile);

module.exports = router;