const mongoose = require('mongoose');
const {
  default: { isEmail, isURL },
} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  points: {
    type: Number,
    require: true,
    default: 0,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  isAccountVerified: {
    type: Boolean,
    required: true,
    default: false,
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
    lowercase: true,
    unique: true,
    required: [true, 'username cannot be blank'],
  },
  meta: {
    accountCreated: {
      type: Date,
      default: Date.now,
    },
    follows: [String],
  },
  birthDate: {
    type: Date,
  },
  role: [String], // the Object Id of the role
  socialMedias: [
    {
      name: {
        type: String,
        required: [true, 'Please enter social media'],
      },
      url: {
        type: String,
        required: [true, 'Please enter social media'],
        validate: [isURL, 'Please enter a valid url'],
      },
    },
  ],
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async (username, password) => {
  const user = await this.findOne({ username: username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};
const User = mongoose.model('User', userSchema);

module.exports = User;
