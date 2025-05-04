const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost', // Reference to the JobPost model
    required: true
  },
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOffer',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // The default status will be 'pending'
  }
});

module.exports = mongoose.model('Chat', chatSchema);
