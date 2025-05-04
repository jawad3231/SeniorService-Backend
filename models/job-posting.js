const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linking profile to user
 
  // other fields like serviceType, jobDetails, etc.

  // employerId: String,

  serviceType: [String],

  jobDetails: {
    employmentType: String,
    workStart: {
      type: {
        type: String
      },
      fromDate: Date
    },
    availability: {
      slots: [
        {
          day: String,
          times: {
            morning: Boolean,
            afternoon: Boolean,
            evening: Boolean,
            night: Boolean
          }
        }
      ]
    },
    workingHours: {
      expectedHours: String,
      billingType: String
    }
  },

  location: {
    postalCode: String,
    city: String
  },

  patient: {
    salutation: String,
    firstName: String,
    lastName: String,
    representsCompany: Boolean
  },

  jobDescription: {
    headline: String,
    details: String
  },

  image: String
}, { timestamps: true });

module.exports = mongoose.model('job-posting', jobPostingSchema);
