const express = require('express');
const router = express.Router();
const Chat = require('../models/message'); // Assuming your Chat model is defined in '../models/Chat'

// Create a new chat message
router.post('/', async (req, res) => {
  try {
    const { jobId, senderId,proposalId, receiverId, message } = req.body;
    
    const newMessage = new Chat({
      jobId,
      senderId,
      receiverId,
      proposalId,
      message,
      sentAt: new Date(),
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get chat history between two users for a specific job
router.get('/:jobId/:senderId/:receiverId', async (req, res) => {
  try {
    const { jobId, senderId, receiverId } = req.params;

    const chatHistory = await Chat.find({
      jobId: jobId,
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ sentAt: 1 }); // Sort by the time message was sent

    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/candidate-messages/:userId', async (req, res) => {
  const userId = req.params.userId;
  const messages = await Chat.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  }).populate('senderId receiverId', 'firstName lastName');

  res.status(200).json({ messages });
});

router.get('/by-proposal/:proposalId', async (req, res) => {
  try {
    const { proposalId } = req.params;
    const messages = await Chat.find({ proposalId })
      .sort({ sentAt: 1 }) // Optional: sort by sent time
      .populate('senderId receiverId', 'firstName lastName');

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
