const express = require("express");
const router = express.Router();
const City = require("../models/cities");

// Search for cities based on user input
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query; // Get user input from query params

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Search by city name or postal code (case-insensitive)
    const results = await City.find({
      $or: [
        { city: { $regex: query, $options: "i" } }, // Search city name
        { postalCode: { $regex: query, $options: "i" } }, // Search postal code
      ],
    }).limit(10); // Limit results

    res.json(results);
  } catch (error) {
    console.error("Error searching cities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
