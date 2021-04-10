const mongoose = require('mongoose');
// const path = require('path');
// const coverImageBasePath = 'uploads/bookCovers';

const AdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title Cannot Be Blank'],
  },
  content: {
    type: String,
    required: [true, 'Please Fill Content'],
  },
  publishDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  adType: {
    type: String,
    required: true,
    default: 'image',
  },
  imageAd: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Ad', AdSchema);
