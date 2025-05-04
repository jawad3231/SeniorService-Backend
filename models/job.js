const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  typesOfCare: { type: [String], required: true }, // Multi-select checkbox
  frequency: { type: String, enum: ['One Time', 'Regularly', 'Occasional'], required: true }, // Dropdown
  workStart: { type: String, enum: ['As soon as possible'], required: true }, // Radio Button
  startDate: { type: Date, required: function() { return this.workStart !== 'As soon as possible'; } }, // Calendar Date if 'Select Date' is chosen
  expectedHours: { type: String, required: true }, // Dropdown (e.g., '2 hours - 16 hours')
  
  description: {
    headline: { type: String, required: true },
    jobDetails: { type: String, required: true }
  },
  
  personalInfo: {
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: {
      postalCode: { type: String, required: true },
      city: { type: String, required: true }
    }
  },
  
  isCompany: { type: Boolean, default: false }, // Checkbox
//   photo: { type: String }, // File upload
  isPublic: { type: Boolean, default: true }, // Enable/Disable job
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);