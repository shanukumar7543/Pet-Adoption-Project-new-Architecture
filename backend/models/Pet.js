const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide pet name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  species: {
    type: String,
    required: [true, 'Please specify species'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
  },
  breed: {
    type: String,
    required: [true, 'Please provide breed'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
    min: [0, 'Age cannot be negative']
  },
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['Male', 'Female']
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    required: true
  },
  color: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  medicalHistory: {
    type: String,
    maxlength: [500, 'Medical history cannot be more than 500 characters']
  },
  vaccinated: {
    type: Boolean,
    default: false
  },
  neutered: {
    type: Boolean,
    default: false
  },
  photos: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available'
  },
  adoptionFee: {
    type: Number,
    default: 0,
    min: [0, 'Adoption fee cannot be negative']
  },
  location: {
    type: String,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update the updatedAt timestamp before saving
petSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Pet', petSchema);

