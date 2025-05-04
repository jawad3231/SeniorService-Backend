const express = require('express');
const router = express.Router();
const JobPost = require("../models/job-posting"); // Correct model import


// ✅ GET JOBS of Logged-in Employer
router.get('/employer/:employerId', async (req, res) => {
  try {
    const jobs = await JobPost.find({ employerId: req.params.employerId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
});

// ✅ GET JOBS of Logged-in User
router.get('/user/:userId', async (req, res) => {
  console.log("✅ Route hit! userId:", req.params.userId);

  try {
    // Query job posts for the user
    const jobs = await JobPost.find({ userId: req.params.userId });

    console.log("📦 Jobs found:", jobs.length);
    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error("❌ Find error:", err, "\nStack:\n", err.stack);
    return res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
});


// ✅ POST: Create a Job Posting
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      serviceType,
      jobDetails,
      location,
      patient,
      jobDescription,
      image
    } = req.body;

    // List of required fields and their labels
    const requiredFields = {
      userId,
      serviceType,
      jobDetails,
      location,
      jobDescription
    };

    // Check for missing fields
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(', ')}`
      });
    }

    const job = new JobPost({
      userId,
      serviceType,
      jobDetails,
      location,
      patient,
      jobDescription,
      image
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job posting', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const jobs = await JobPost.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all job postings', error });
  }
});

// ✅ GET: Job Posting by ID
router.get('/:jobId', async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job details', error });
  }
});


module.exports = router;

