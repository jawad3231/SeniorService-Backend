const express = require('express');
const router = express.Router();
const JobOffer = require('../models/job-offer');
const JobPost = require('../models/job-posting'); // or correct path if different
const mongoose = require('mongoose');
const Chat = require('../models/message'); // Ensure this is the correct path to your Chat model

router.post('/', async (req, res) => {
  try {
    const { jobId, userId, message } = req.body;

    const offer = new JobOffer({ jobId, userId, message });
    const saved = await offer.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit job offer', error });
  }
});

// job-posts.js

router.get('/proposals/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Step 1: Get all jobs posted by this user
    const jobs = await JobPost.find({ userId }).select('_id');

    const jobIds = jobs.map(job => job._id);

    // Step 2: Get all job offers (proposals) on those jobs
    const offers = await JobOffer.find({ jobId: { $in: jobIds } })
      .populate('userId', 'firstName lastName email')
      .populate('jobId', 'jobDescription');

    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("❌ Error fetching proposals:", error);
    res.status(500).json({ message: 'Failed to fetch proposals', error });
  }
});

// new Version of Proposal Getting

router.get('/candidate-proposals/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const proposals = await JobOffer.find({ userId })
      .populate('jobId', 'jobDescription location') // include job details if needed
      .populate('userId', 'firstName lastName'); // optional

    res.status(200).json({ success: true, proposals });
  } catch (error) {
    console.error("❌ Error fetching candidate proposals:", error);
    res.status(500).json({ message: 'Failed to fetch candidate proposals', error });
  }
});

// router.get('/proposals/:userId', async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     // Step 1: Get all jobs posted by this user
//     const jobs = await JobPost.find({ userId }).select('_id');
//     console.log("Jobs for user:", jobs); // Log to verify

//     if (!jobs.length) {
//       return res.status(404).json({ message: 'No jobs found for this user' });
//     }

//     const jobIds = jobs.map(job => job._id);
//     console.log("Job IDs:", jobIds); // Log to verify

//     // Step 2: Get all job offers (proposals) on those jobs
//     const offers = await JobOffer.find({ jobId: { $in: jobIds } })
//       .populate('userId', 'firstName lastName email')
//       .populate('jobId', 'jobDescription');

//     if (!offers.length) {
//       return res.status(404).json({ message: 'No proposals found for these jobs' });
//     }

//     res.status(200).json({ success: true, offers });
//   } catch (error) {
//     console.error("❌ Error fetching proposals:", error);
//     res.status(500).json({ message: 'Failed to fetch proposals', error });
//   }
// });


// Update application status for a message (approve/reject/archive)
router.put('/update-status', async (req, res) => {
  try {
    console.log('Payload:', req.body);
  
    const { proposalId, status } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return res.status(400).json({ error: 'Invalid proposalId format' });
    }
  
    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status },
      { new: true }
    );
  
    if (!updatedProposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
  
    await Chat.updateMany({ proposalId }, { applicationStatus: status });
  
    res.json({
      message: `Proposal updated to '${status}'`,
      updatedProposal
    });
  
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});  
  
  


module.exports = router;
