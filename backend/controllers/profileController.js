const Profile = require('../models/Profile');
const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await Profile.getByUserId(userId);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Get own profile
const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.getByUserId(userId);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get own profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Create profile
const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Check if profile already exists
    const existingProfile = await Profile.getByUserId(userId);
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const newProfile = await Profile.create({ userId, ...profileData });

    res.status(201).json({
      message: 'Profile created successfully',
      profile: newProfile
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Server error creating profile' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profileData = req.body;

    const updatedProfile = await Profile.update(userId, profileData);

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Update own profile
const updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const updatedProfile = await Profile.update(userId, profileData);

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update own profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  createProfile,
  getOwnProfile,
  updateOwnProfile
};