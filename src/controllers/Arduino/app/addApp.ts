/*
 * =================== MTS TECHNONATURA SERVER =================
 *
 * This API Script under MIT LICENSE
 * What is this for ? This is REST API for MTS Technonatura arduino database, user make app and saved the app to db.
 *
 * (c) 2021 by MTS-Technonatura, made with 💖 by Aldhan
 * =============================================================
 */

import * as express from 'express';
import { Request } from 'express';

import ArduinoApp from '../../../models/Arduino/arduinoApp.model';
import { UserBaseDocument } from '../../../models/User.model';

import { VerifyAuthToken } from '../../checkToken';
import createToken, { tokenForTypes } from '../../createToken';
import handleErrors from '../handleErrors';

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
    user?: UserBaseDocument | null;
  }
}

interface UserInRequest extends Request {
  user?: UserBaseDocument | null;
}

const ArduinoAppAddRouter = express.Router();

ArduinoAppAddRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

ArduinoAppAddRouter.post(
  '/',
  VerifyAuthToken,
  async (req: UserInRequest, res) => {
    /*
     *
     * 1. Verify JWT
     * 2. Check if the arduino app name already exist or not
     * 3. Create Token For Arduino App
     * 4. Save Arduino App to Database
     * 5. Send response
     */

    //@ts-ignore
    const { arduinoAppName, desc } = req.body;

    const isThere = await ArduinoApp.find({
      own: req.id,
    }).findOne({
      name: {
        $regex: new RegExp('^' + arduinoAppName.toLowerCase() + '$', 'i'),
      },
    });

    // if there is same sensor name
    if (!isThere) {
      const App = new ArduinoApp({
        name: arduinoAppName,
        desc: desc,
        own: req.id,
      });

      try {
        const token = createToken(
          {
            // @ts-ignore
            ownerID: req.id,
            appID: App.id,
          },
          tokenForTypes.arduinoApp,
        );
        // @ts-ignore
        App.token.token = token;
        App.token.tokenCreated = Date.now();

        await App.save();

        await req.user?.updateOne({
          $inc: {
            points: 50,
          },
        });
        // user

        res.status(200).send({
          message: 'App Created',
          arduinoAppToken: token,
          status: 'success',
          arduinoAppID: App._id,
        });
        return;
      } catch (err) {
        const errors = await handleErrors(err);
        res.status(200).send({
          message: 'error',
          errors,
          status: 'error',
        });
        return;
      }
    } else {
      res.status(200).send({
        message: 'this name is already registered',
        status: 'warning',
      });
      return;
    }
  },
);

export default ArduinoAppAddRouter;
