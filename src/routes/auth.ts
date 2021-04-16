import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import User, { UserBaseDocument, UserInterface } from '../models/User.model';

const AuthRouter = express.Router();

interface COOL {
  username: string;
  password: string;
  _id: string;
}
// max age
const maxAge = 3 * 24 * 60 * 60 * 60;
const createToken = (user: COOL) => {
  return jwt.sign({ ...user }, 'asodjijiej3q9iej93qjeiqwijdnasdini', {
    expiresIn: '1y',
  });
};

AuthRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // const { token } = req.headers;
  // console.log(req.headers);

  try {
    const user = await User.login(username, password);
    // const token = createToken(user);

    // try {
    //   // if (token && !Array.isArray(token)) {
    //     // const verifyToken = jwt.verify(
    //     //   token,
    //     //   'asodjijiej3q9iej93qjeiqwijdnasdini',
    //     // );
    //     res.status(200).json({ message: 'success' });
    //   // } else {
    //   //   throw Error('authorization undefined');
    //   // }
    // } catch (err) {
    //   res.status(400).json({ message: 'token might expired' });
    // }
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.log('ERR! ', err);

    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

AuthRouter.post('/signup', async (req, res) => {
  console.log(req.body);
  const { email, password, username, name } = req.body;

  try {
    const user = new User({ email, password, username, name });
    await user.save();

    const token = createToken({
      username: user.username,
      password: user.password,
      _id: user._id,
    });
    // const p = jwt.verify(token, 'asodjijiej3q9iej93qjeiqwijdnasdini');
    // console.log(p._doc);

    /*
      {
        meta: { follows: [], accountCreated: '2021-04-11T15:02:40.836Z' },
        points: 0,
        isAccountVerified: false,
        role: [],
        _id: '60730f900a6ecb2a4ccbe984',
        email: 'sad@gmail.com',
        password: oops,
        username: 'aldhanekaa',
        name: 'Aldhaneka',
        socialMedias: [],
        __v: 0
      }
    */

    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ message: 'success', token: token });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
});

interface Errors {
  email: string;
  password: string;
}

// handle errors
function handleErrors(err: {
  message: string;
  code: number;
  _message: string;
}) {
  console.log('ERRRRORORR', err);
  // @ts-ignore
  let errors: Errors = {};

  // incorrect email
  if (err.message === 'incorrect username') {
    errors.email = 'That username is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that username is already registered';
    return errors;
  }

  // validation errors
  // if (err._message.includes('User validation failed')) {
  //   // console.log(err);

  //   // @ts-ignore
  //   Object.values(err.errors).forEach(({ properties }) => {
  //     // console.log(val);
  //     // console.log(properties);
  //     console.log(properties.path);
  //     if (properties.message != '') {
  //       // @ts-ignore
  //       errors[properties.path] = properties.message;
  //     }
  //   });
  // }

  return errors;
}

export default AuthRouter;
