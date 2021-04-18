import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import User, { UserBaseDocument, UserInterface } from '../models/User.model';

const AuthRouter = express.Router();

interface COOL {
  points: number;
  email: string;
  name: string;
  username: string;
  isAccountVerified: boolean;
  password: string;
  roles: Array<string>;
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
    const token = createToken({
      username: user.username,
      password: user.password,
      _id: user._id,
      points: user.points,
      name: user.name,
      isAccountVerified: user.isAccountVerified,
      email: user.email,
      roles: user.roles,
    });

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
    res.status(200).json({ message: 'success', token: token });
  } catch (err) {
    console.log('ERR! ', err);

    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

AuthRouter.post('/checkJWT', async (req, res) => {
  // const token = req.headers.authorizations;
  interface B {
    password: string;
  }
  if (req.body.token) {
    try {
      const verifyToken = await jwt.verify(
        req.body.token,
        'asodjijiej3q9iej93qjeiqwijdnasdini',
      );

      // @ts-ignore
      if (typeof verifyToken != 'string' && verifyToken.password) {
        // @ts-ignore
        const user = await User.findById(verifyToken._id);

        // // @ts-ignore
        // console.log(
        //   verifyToken, // @ts-ignore
        //   verifyToken._id,
        //   // @ts-ignore
        //   user,
        // );

        // @ts-ignore
        if (verifyToken.password != user?.password) {
          res
            .status(200)
            .json({ message: 'invalid password, password might has changed' });
          return;
        } else {
          res.status(200).json({ message: 'success' });
          return;
        }
      }
    } catch (err) {
      res.status(500).json({ message: 'invalid token' });
      return;
    }

    // console.log(token.split(' '));
  }

  res.json({ message: 'token undefined' });
  return;
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
      points: user.points,
      name: user.name,
      isAccountVerified: user.isAccountVerified,
      email: user.email,
      roles: user.roles,
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
    const errors = await handleErrors(err, { email, password, username, name });
    console.log(errors);
    res.status(400).json({ errors });
  }
});

interface SignupBody {
  email: string;
  password: string;
  username: string;
  name: string;
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
    errors.email = 'That username is not registered';
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
  if (err._message && err._message.includes('User validation failed')) {
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

export default AuthRouter;
