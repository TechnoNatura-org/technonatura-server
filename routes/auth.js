const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const AuthRouter = express.Router();

const login = (req, res, next) => {
  console.log('====== user try to log in ======');
  passport.authenticate('local', (err, user, info) => {
    console.log('Requesting User: ', user);
    if (err) throw err;
    if (!user) res.send('No User Exists');
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send('Successfully Authenticated');
      });
    }
  })(req, res, next);
};

AuthRouter.post('/login', (req, res) => {
  res.send('hey');
});

AuthRouter.post('/signup', (req, res) => {
  res.send('hey');
});

module.exports = AuthRouter;
