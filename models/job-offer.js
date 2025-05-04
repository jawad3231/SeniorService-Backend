const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job-posting',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  offeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobOffer', jobOfferSchema);
