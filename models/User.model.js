const mongoose = require('mongoose');
const {
  default: { isEmail },
} = require('validator');

// const path = require('path');
// const coverImageBasePath = 'uploads/bookCovers';

const userSchema = new mongoose.Schema({
  points: {
    type: Number,
    require: true,
    default: 0,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  isAccountVerified: {
    type: Boolean,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    minlength: [4, 'Minimum name length is 4 characters'],
  },
  username: {
    type: String,
    required: [true, 'username cannot be blank'],
  },
  meta: {
    accountCreated: {
      type: Date,
      default: Date.now,
    },
    follows: {
      type: Number,
      require: true,
      default: 0,
    },
    followers: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  birthDate: {
    type: Date,
  },
});

module.exports = mongoose.model('User', userSchema);
