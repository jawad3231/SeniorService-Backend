const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'candidate'],
    default: 'candidate' // Default role is candidate
  },
  password: {
    type: String,
    required: true
  },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' } // Linking user to their profile
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
