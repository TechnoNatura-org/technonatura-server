if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User, { UserBaseDocument, UserInterface } from '../models/User.model';
import Role from '../models/Role.model';
import { VerifyAuthToken } from '../controllers/checkToken';

import createToken, { tokenForTypes } from '../controllers/createToken';
import { checkRoles } from '../controllers/checkRoles';

import handleErrors from '../controllers/auth/handleErrors';
import AuthMainController from '../controllers/auth/auth';
const AuthRouter = express.Router();

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
    user?: UserBaseDocument | null;
  }
}
// end of API for Admin
AuthRouter.use('/', AuthMainController);

AuthRouter.get('/unverifiedusers', async (req, res) => {
  try {
    const unverifiedusers = await User.find({ isAccountVerified: false });
    res.status(200).json({
      message: 'success',
      unverified_users: unverifiedusers,
      status: 'sucess',
    });
  } catch (err) {
    console.log(err);
    // console.log("err when fetching unverified users", err)
    res.status(200).json({ message: 'error in server', status: 'error' });
  }
});

// API for Admin
AuthRouter.post('/acceptuser', VerifyAuthToken, async (req, res) => {
  const { userID } = req.body;
  if (userID) {
    try {
      if (
        req.user &&
        checkRoles(req.user.roles, ['Owner', 'Developer', 'Admin'])
      ) {
        const verifiedUser = await User.findByIdAndUpdate(userID, {
          isAccountVerified: true,
          roles: ['member'],
        });
        res.status(200).json({ message: 'success', status: 'success' });
      } else {
        res
          .status(200)
          .json({ message: 'access denied for this user', status: 'error' });
      }
    } catch (err) {
      // console.log("err when fetching unverified users", err)
      res.status(200).json({ message: 'error in server', status: 'error' });
    }
  } else {
    res.status(200).json({ message: 'userID not provided', status: 'warning' });
  }
});

AuthRouter.post('/deleteuser', VerifyAuthToken, async (req, res) => {
  const { userID } = req.body;
  if (userID) {
    try {
      if (
        req.user &&
        checkRoles(req.user.roles, ['Owner', 'Developer', 'Admin'])
      ) {
        const unverifiedusers = await User.findByIdAndDelete(userID);
        res.status(200).json({ message: 'User Deleted', status: 'success' });
      } else {
        res
          .status(200)
          .json({ message: 'access denied for this user', status: 'error' });
      }
    } catch (err) {
      // console.log("err when fetching unverified users", err)
      res.status(200).json({ message: 'error in server', status: 'error' });
    }
  } else {
    res.status(200).json({ message: 'userID not provided', status: 'warning' });
  }
});

AuthRouter.post('/new/role', VerifyAuthToken, async (req, res) => {
  const { rolename } = req.body;
  // const { token } = req.headers;
  // console.log(req.headers);

  try {
    if (
      req.user &&
      checkRoles(req.user.roles, ['Owner', 'Developer', 'Admin'])
    ) {
      const role = new Role({
        name: rolename,
      });
      await role.save();
      res.status(200).json({ message: 'success' });
    } else {
      res.status(200).json({ message: 'access denied for this user' });
      return;
    }
  } catch (err) {
    console.log('ERR! ', err);

    const errors = await handleErrors(err);
    console.log(errors);
    res.status(200).json({ errors });
  }
});

export default AuthRouter;
