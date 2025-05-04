const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linking profile to user
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  serviceType: { type: [String], required: true },
  availability: { type: [String], enum: ['Full Time', 'Part Time'], required: true },
  rate: { type: String, required: true },
  isShortAvailability: { type: Boolean, default: false },
  education: { type: String },
  qualifications: [{ type: String }],
  languages: [{ type: String }],
  description: { type: String },
  location: {
    postalCode: { type: String },
    city: { type: String }
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date },
  membershipType: { type: String, required: true },
  isVisible: { type: Boolean, default: true },
  otherDetails: {
    referenceAvailability: { type: Boolean, default: false },
    driverLicense: { type: Boolean, default: false },
    carAvailability: { type: Boolean, default: false },
    experience: { type: String }
  },
  photo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);