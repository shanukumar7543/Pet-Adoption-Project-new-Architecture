const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  applicantInfo: {
    phone: {
      type: String,
      required: [true, 'Please provide phone number']
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    housingType: {
      type: String,
      required: true,
      enum: ['House', 'Apartment', 'Condo', 'Other']
    },
    hasYard: {
      type: Boolean,
      default: false
    },
    hasPets: {
      type: Boolean,
      default: false
    },
    petsDescription: {
      type: String
    },
    experience: {
      type: String,
      required: [true, 'Please describe your experience with pets']
    },
    reason: {
      type: String,
      required: [true, 'Please provide reason for adoption'],
      maxlength: [500, 'Reason cannot be more than 500 characters']
    }
  },
  notes: {
    type: String
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate applications
applicationSchema.index({ pet: 1, applicant: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);

