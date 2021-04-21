import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User, { UserBaseDocument, UserInterface } from '../models/User.model';

declare module 'express-serve-static-core' {
  interface Request {
    id: number;
  }
}

const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.authToken) {
    try {
      const verifyToken = await jwt.verify(
        req.body.authToken,
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
        req.id = verifyToken._id;
        // req._id =
        return next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'your token might expired or wrong' });
      return;
    }

    // console.log(token.split(' '));
  }

  res.json({ message: 'token undefined' });
  return;
};

export default VerifyToken;
