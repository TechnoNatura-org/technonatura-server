if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User, { UserBaseDocument } from '../../models/User.model';
import { VerifyAuthToken } from '../../controllers/checkToken';

import createToken, { tokenForTypes } from '../../controllers/createToken';
import { checkRoles } from '../../controllers/checkRoles';
import handleErrors from './handleErrors';

const AuthRouter = express.Router();

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
    user?: UserBaseDocument | null;
  }
}

AuthRouter.post('/checkJWT', async (req, res) => {
  // const token = req.headers.authorizations;
  if (req.body.token) {
    try {
      const verifyToken = await jwt.verify(
        req.body.token,
        process.env.AUTH_SECRET_TOKEN || 'authSecret',
      );

      // @ts-ignore
      if (typeof verifyToken != 'string' && verifyToken.password) {
        // @ts-ignore
        const user = await User.findById(verifyToken._id);

        // @ts-ignore
        if (verifyToken.password != user?.password) {
          res
            .status(200)
            .json({ message: 'invalid password, password might has changed' });
          return;
        } else {
          res.status(200).json({
            message: 'success',
            user: {
              follows: user?.follows,
              name: user?.name,
              username: user?.username,
              email: user?.email,
              accountCreated: user?.accountCreated,
              isAccountVerified: user?.isAccountVerified,
              roles: user?.roles,
              socialMedias: user?.socialMedias,
              bio: user?.bio,
              avatar: user?.avatar,
              banner: user?.banner,
            },
          });
          return;
        }
      }
    } catch (err) {
      res.status(200).json({ message: 'invalid token' });
      return;
    }

    // console.log(token.split(' '));
  }

  res.json({ message: 'token undefined' });
  return;
});

AuthRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // const { token } = req.headers;
  // console.log(req.headers);

  try {
    const user = await User.login(username, password);
    const token = createToken(
      {
        username: user.username,
        password: user.password,
        _id: user._id,
        email: user.email,
      },
      tokenForTypes.auth,
    );

    res.status(200).json({
      message: 'success',
      token: token,
      user: {
        name: user.name,
        username: user.username,
        password: user.password,
        email: user.email,
        _id: user._id,
        follows: user.follows,
        roles: user.roles,
        isAccountVerified: user.isAccountVerified,
        socialMedias: user.socialMedias,
      },
    });
  } catch (err) {
    console.log('ERR! ', err);

    const errors = await handleErrors(err);
    console.log(errors);
    res.status(200).json({ errors });
  }
});

AuthRouter.post('/signup', async (req, res) => {
  // console.log(req.body);
  const { email, password, username, name } = req.body;

  try {
    const user = new User({ email, password, username, name });
    await user.save();

    // console.log(user);

    const token = createToken(
      {
        username: user.username,
        password: user.password,
        _id: user._id,
        email: user.email,
      },
      tokenForTypes.auth,
    );
    res.status(200).json({
      message: 'success',
      token: token,
      user: {
        name: user.name,
        username: user.username,
        password: user.password,
        email: user.email,
        _id: user._id,
        follows: user.follows,
        roles: user.roles,
        isAccountVerified: user.isAccountVerified,
        socialMedias: user.socialMedias,
      },
    });
  } catch (err) {
    const errors = await handleErrors(err, { email, password, username, name });
    res.status(200).json({ errors });
  }
});

AuthRouter.post('/changePassword', VerifyAuthToken, async (req, res) => {
  const { newPassword, currentPassword } = req.body;
  // const { token } = req.headers;
  // console.log(req.headers);

  try {
    // @ts-ignore
    const user = await User.login(req.user.username, currentPassword); // try to login using the given password

    if (user) {
      try {
        //
        const hashedPassword = await user.changePassword(newPassword); // changePassword returns new hashed password

        const token = createToken(
          {
            username: user.username,
            password: hashedPassword,
            _id: user._id,
            email: user.email,
          },
          tokenForTypes.auth,
        );

        res.status(200).json({
          message: 'password changed',
          status: 'success',
          token: token,
        });
        return;
      } catch (err) {
        res.status(200).json({
          message:
            'error when change user password, please checkout our status API',
          status: 'error',
        });
        return;
      }
    }

    res.status(200).json({
      message: 'user not found',
      status: 'error',
    });
    return;
  } catch (err) {
    console.log('ERR! ', err);

    const errors = await handleErrors(err);
    res.status(200).json({ errors, status: 'error', message: 'error occured' });
  }
});

AuthRouter.post('/deleteAccount', VerifyAuthToken, async (req, res) => {
  const { currentPasswordDeleteAccount } = req.body;
  if (currentPasswordDeleteAccount && req.user) {
    try {
      try {
        await req.user.deleteAccount();
        res.status(200).json({
          message: 'account deleted!',
          status: 'success',
        });
      } catch (err) {
        // console.log("err when fetching unverified users", err)
        res.status(200).json({
          message: 'error when deleting account',
          status: 'error',
          errorMessage: JSON.stringify(err),
        });
        return;
      }
    } catch (err) {
      console.log('ERR! ', err);

      const errors = await handleErrors(err);
      let message = 'error occured';

      // if (!lodash.isEmpty(errors)) {
      //   message = 'password incorrect';
      // }

      res.status(200).json({ errors, status: 'error', message: message });
      return;
    }
  }
  res.status(200).json({ message: 'password not provided', status: 'warning' });
});

export default AuthRouter;
