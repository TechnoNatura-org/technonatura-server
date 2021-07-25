if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import User from '../../models/User.model';

import lodash from 'lodash';

interface SignupBody {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

interface Errors {
  email: string;
  password: string;
  username: string;
}

// handle errors
async function handleErrors(
  err: {
    message: string;
    code: number;
    _message: string;
    keyValue: {
      username?: string;
      email?: string;
    };
  },
  SignupBody?: SignupBody,
) {
  console.log('ERRRRORORR', err.message);
  // @ts-ignore
  let errors: Errors = {};

  if (err.message == 'Only Letters and Numbers are allowed') {
    errors.username = err.message;
  }
  if (err.message === 'incorrect username') {
    // incorrect email
    errors.username = 'That username is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // @ts-ignore
  // console.log(err.keyValue);

  // duplicate username error
  if (err.code === 11000 && err.keyValue.username) {
    errors.username = 'that username is already registered';
  }

  if (errors.username && SignupBody && SignupBody.email) {
    const similarUser = await User.findOne({ email: SignupBody.email });
    if (similarUser) {
      errors.email = 'that email is already registered';
    }
  }
  // User.findOne({email: })

  // duplicate email error
  if (err.code === 11000 && err.keyValue.email) {
    errors.email = 'that email is already registered';
  }

  if (errors.email && SignupBody && SignupBody.username) {
    const similarUser = await User.findOne({ username: SignupBody.username });
    if (similarUser) {
      errors.username = 'that username is already registered';
    }
  }

  // validation errors
  if (
    err._message &&
    (err._message.includes('User validation failed') ||
      err._message.includes('Role validation failed'))
  ) {
    // console.log(err);

    // @ts-ignore
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      console.log(properties.path);
      if (properties.message != '') {
        // @ts-ignore
        errors[properties.path] = properties.message;
      }
    });
  }

  return errors;
}

export default handleErrors;
