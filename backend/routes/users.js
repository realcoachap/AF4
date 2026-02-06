const express = require('express');
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  updateOwnProfile 
} = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route for user lookup (limited information)
router.get('/public/:id', getUserById);

// Protected routes for authenticated users
router.get('/me', authenticateToken, getUserById);
router.put('/me', authenticateToken, updateOwnProfile);

// Admin routes
router.get('/', authenticateToken, authorizeRoles(['admin', 'trainer']), getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles(['admin', 'trainer']), getUserById);
router.put('/:id', authenticateToken, authorizeRoles(['admin', 'trainer']), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteUser);

module.exports = router;