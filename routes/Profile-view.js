const express = require("express");
const router = express.Router();
const ProfileView = require("../models/ProfileView");

// Track profile view
router.post("/track-view", async (req, res) => {
  try {
    const { viewerId, profileId } = req.body;

    if (!viewerId || !profileId) {
      return res.status(400).json({ error: "viewerId and profileId are required" });
    }

    await ProfileView.create({ viewerId, profileId });

    res.status(200).json({ message: "Profile view recorded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get views in last 8 days
router.get("/profile-views/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const views = await ProfileView.find({
      profileId,
      viewedAt: { $gte: eightDaysAgo }
    }).populate("viewerId", "firstName lastName email"); // Fetch viewer details

    res.status(200).json(views);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
