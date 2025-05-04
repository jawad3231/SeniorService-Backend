const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/usermodel');
const Profile = require('../models/Profile');

// @route   POST /api/users
// @desc    Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role, profileId } = req.body;

    const newUser = new User({ username, email, password, role, profileId });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('profileId', 'firstName lastName');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('profileId');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, profileId } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password, role, profileId },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// @route   PATCH /api/users/:id/block
// @desc    Block/Unblock a user
router.patch('/:id/block', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isBlocked = !user.isBlocked; // Toggle block status
    await user.save();

    res.json({ isBlocked: user.isBlocked });
  } catch (error) {
    console.error('Error blocking/unblocking user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
