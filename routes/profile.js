const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const mongoose = require("mongoose");
const Profile = require('../models/Profile');  // Adjust the path as necessary

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// @route   POST /api/profile
// @desc    Create a new profile
// router.post('/', upload.single('photo'), async (req, res) => {
//   try {
//     const parsedData = {
//       ...req.body,
//       availability: JSON.parse(req.body.availability || '{}'),
//       otherDetails: JSON.parse(req.body.otherDetails || '{}'),
//       serviceType: JSON.parse(req.body.serviceType || '[]'),
//       qualifications: JSON.parse(req.body.qualifications || '[]'),
//       languages: JSON.parse(req.body.languages || '[]'),
//       location: JSON.parse(req.body.location || '{}'),
//       photo: req.file ? req.file.path.replace('public', '') : ''
//     };

//     const newProfile = new Profile(parsedData);
//     const savedProfile = await newProfile.save();
//     res.status(201).json(savedProfile);
//   } catch (error) {
//     console.error('Error creating profile:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const parsedData = {
      ...req.body,
      userId: req.body.userId ? new mongoose.Types.ObjectId(req.body.userId) : null, // Corrected
      // userId: req.user.id, // Extract from JWT
      availability: JSON.parse(req.body.availability || '{}'),
      otherDetails: JSON.parse(req.body.otherDetails || '{}'),
      serviceType: JSON.parse(req.body.serviceType || '[]'),
      qualifications: JSON.parse(req.body.qualifications || '[]'),
      languages: JSON.parse(req.body.languages || '[]'),
      location: JSON.parse(req.body.location || '{}'),
      photo: req.file ? req.file.path.replace('public', '') : ''
    };

    const newProfile = new Profile(parsedData);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error creating profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// @route   GET /api/profile/:id
// @desc    Get profile by UserID
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });

    if (!profile) return res.status(404).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// @route   GET /api/profile/:id
// @desc    Get profile by ID
router.get('/api/profile/:id', async (req, res) => {
  try {
      console.log("Fetching profile for ID:", req.params.id); // Debugging

      // Ensure ID is valid
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          console.log("Invalid ObjectId format");
          return res.status(400).json({ message: "Invalid profile ID" });
      }

      const profile = await Profile.findById(req.params.id);

      if (!profile) {
          console.log("Profile not found in DB");
          return res.status(404).json({ message: "Profile not found" });
      }

      console.log("Profile found:", profile);
      res.json(profile);
  } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


// @route   PUT /api/profile/:id
// @desc    Update profile
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      availability: JSON.parse(req.body.availability || '{}'),
      otherDetails: JSON.parse(req.body.otherDetails || '{}'),
      serviceType: JSON.parse(req.body.serviceType || '[]'),
      qualifications: JSON.parse(req.body.qualifications || '[]'),
      languages: JSON.parse(req.body.languages || '[]'),
      location: JSON.parse(req.body.location || '{}')
    };

    if (req.file) {
      updatedData.photo = req.file.path.replace('public', '');
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedProfile) return res.status(404).json({ msg: 'Profile not found' });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/profile/:id
// @desc    Delete profile
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) return res.status(404).json({ msg: 'Profile not found' });

    res.json({ msg: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/profiles
// @desc    Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/profiles/search
// @desc    Get all profiles with filters
router.get('/search', async (req, res) => {
  try {
    let { postalCode, city, range, lat, lng } = req.query;
    let query = {};

    if (postalCode) {
      query['location.postalCode'] = postalCode;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i'); // Case-insensitive city search
    }

    if (range && lat && lng) {
      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(range) / 6378.1 // Convert KM to radians
          ]
        }
      };
    }

    const profiles = await Profile.find(query);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PATCH /api/profile/:id/visibility
// @desc    Toggle profile visibility
// @route   PATCH /api/profile/:userId/visibility
// @desc    Toggle profile visibility by UserId
router.patch('/:id/visibility', async (req, res) => {
  const { id } = req.params; // This is now userId
  console.log("✅ Received User ID:", id);

  try {
    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found for this user" });
    }

    profile.isVisible = !profile.isVisible;
    await profile.save();

    res.json({ isVisible: profile.isVisible });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:id/favorite", async (req, res) => {
  try {
      const userId = req.user.id; // Extract user ID from JWT
      const profileId = req.params.id;

      // Validate profile exists
      const profile = await Profile.findById(profileId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });

      // Find the user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check if profile is already in favorites
      const isAlreadyFavorite = user.favorites.includes(profileId);

      if (isAlreadyFavorite) {
          // Remove from favorites
          user.favorites = user.favorites.filter(fav => fav.toString() !== profileId);
          await user.save();
          return res.json({ message: "Removed from favorites", isFavorite: false });
      } else {
          // Add to favorites
          user.favorites.push(profileId);
          await user.save();
          return res.json({ message: "Added to favorites", isFavorite: true });
      }
  } catch (error) {
      console.error("Error updating favorite status:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
