const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username already in use' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save User
    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,     // Ensure JWT_SECRET is in your .env file
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, message: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },  // ✅ Include role in token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Send user data along with token
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role // ✅ Ensure role is returned
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getUserByUsername/:username', async (req, res) => {
  try {
    const { username } = req.params;  // Get username from request params

    // Find user by username and populate profileId if needed
    const user = await User.findOne({ username }).populate('profileId'); // Adjust according to your schema
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user ID and profile ID
    res.status(200).json({ userId: user._id, profileId: user.profileId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
