const express = require('express');
const router = express.Router();
const JobPost = require('../models/job-posting'); // Ensure this is correct
const JobOffer = require('../models/job-offer');

// router.get('/employer-proposals/:userId', async (req, res) => {
//   const userId = req.params.userId;

//   // Validate userId format (optional)
//   if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
//     return res.status(400).json({ message: 'Invalid User ID format.' });
//   }

//   try {
//     const jobs = await JobPost.find({ userId }).select('_id');
//     if (jobs.length === 0) {
//       return res.status(404).json({ message: 'No jobs found for this employer.' });
//     }

//     const jobIds = jobs.map(job => job._id);

//     const offers = await JobOffer.find({ jobId: { $in: jobIds } })
//       .populate('userId', 'firstName lastName email')
//       .populate('jobId', 'jobDescription.headline');

//     res.status(200).json({ success: true, offers });
//   } catch (error) {
//     console.error("❌ Error fetching proposals:", error.message, error.stack);
//     res.status(500).json({ message: 'Failed to fetch proposals', error: error.message });
//   }
// });

router.get('/employer-proposals/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const jobs = await JobPost.find({ userId }).select('_id');
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this employer.' });
    }

    const jobIds = jobs.map(job => job._id);

    const offers = await JobOffer.find({ jobId: { $in: jobIds } })
      .populate('userId', 'firstName lastName email')
      .populate('jobId', 'jobDescription.headline');

    console.log("Fetched Offers:", offers); // Debugging log

    if (offers.length === 0) {
      return res.status(404).json({ message: 'No proposals found for this employer.' });
    }

    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("❌ Error fetching proposals:", error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch proposals', error: error.message });
  }
});

module.exports = router;
