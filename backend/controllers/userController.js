const User = require('../models/User');
const Profile = require('../models/Profile');

// Get all users (admin/trainer only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (role) filters.role = role;
    if (search) filters.searchTerm = search;

    const { users, total } = await User.findAllWithPagination(limit, offset, filters);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalUsers: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id === 'me' ? req.user.id : req.params.id;
    
    // If requesting own profile, allow it
    if (userId === req.user.id) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          verified: user.verified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    }

    // For other users, only return limited information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return limited information for other users
    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// Update user (admin/trainer only)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, role, verified } = req.body;

    // Check if email is being changed and if it's already taken by another user
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== parseInt(userId)) {
        return res.status(400).json({ message: 'Email already in use by another account' });
      }
    }

    const updatedUser = await User.update(userId, { name, email, phone, role, verified });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        verified: updatedUser.verified,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// Update own profile
const updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    // Check if email is being changed and if it's already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Email already in use by another account' });
      }
    }

    const updatedUser = await User.update(userId, { name, email, phone });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Update own profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent users from deleting themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const deletedUser = await User.deleteById(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateOwnProfile
};