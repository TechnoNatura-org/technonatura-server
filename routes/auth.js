const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const AuthRouter = express.Router();

// max age
const maxAge = 3 * 24 * 60 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'asodjijiej3q9iej93qjeiqwijdnasdini', {
    expiresIn: maxAge,
  });
};

AuthRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    console.log(token);
    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ jwt: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

AuthRouter.post('/signup', async (req, res) => {
  console.log(req.body);
  const { email, password, username, name } = req.body;

  try {
    const user = await User.create({ email, password, username, name });
    const token = createToken(user._id);
    console.log(token);
    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ token: token });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
});

module.exports = AuthRouter;

// handle errors
function handleErrors(err) {
  console.log(err.message, err);
  let errors = {};

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err._message.includes('User validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      console.log(properties.path);
      if (properties.message != '') {
        errors[properties.path] = properties.message;
      }
    });
  }

  return errors;
}
