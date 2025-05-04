const express = require('express');
const router = express.Router();
const Job = require('../models/job');

// Create a Job Posting
router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Jobs (Public Only) with Filters (Search & Location)
router.get('/', async (req, res) => {
  try {
    const { search, postalCode, city } = req.query;
    let filter = { isPublic: true };

    if (search) {
      filter["description.headline"] = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (postalCode) {
      filter["personalInfo.location.postalCode"] = postalCode;
    }

    if (city) {
      filter["personalInfo.location.city"] = { $regex: city, $options: "i" };
    }

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a Single Job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Job Posting
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Job Posting
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
