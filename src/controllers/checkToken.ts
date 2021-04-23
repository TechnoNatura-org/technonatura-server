import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User, { UserBaseDocument, UserInterface } from '../models/User.model';

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
  }
}

interface UserInRequest extends Request {
  user?: UserBaseDocument | null;
}

const VerifyToken = async (
  req: UserInRequest,
  res: Response,
  next: NextFunction,
) => {
  //@ts-ignore
  if (req.body.authToken) {
    try {
      // convert jwt
      const verifyToken = await jwt.verify(
        req.body.authToken,
        'asodjijiej3q9iej93qjeiqwijdnasdini',
      );

      // @ts-ignore
      if (typeof verifyToken != 'string' && verifyToken.password) {
        // @ts-ignore
        const user = await User.findById(verifyToken._id);
        //   console.log('hgsufgusy');
        // // @ts-ignore
        // console.log(
        //   verifyToken, // @ts-ignore
        //   verifyToken._id,
        //   // @ts-ignore
        //   user,
        // );
        // console.log('verifyToken', verifyToken, '\nuser', user); // for debuging

        if (user) {
          // verify token
          // @ts-ignore
          if (verifyToken.password != user?.password) {
            // console.log('pass');

            res.status(500).send({
              message: 'password has changed',
            });
            return;
          } else {
            // console.log('neSTx');
            // @ts-ignore
            req.id = user._id;
            req.user = user;

            return next();
          }
        } else {
          res.status(500).send({ message: 'user not found!' });
          return;
        }
      }
    } catch (err) {
      // console.log('ero');

      res.status(500).send({ message: 'error occured' });
      return;
    }

    // console.log(token.split(' '));
  }

  res.status(500).send({ message: 'token undefined' });
  return;
};
export default VerifyToken;
