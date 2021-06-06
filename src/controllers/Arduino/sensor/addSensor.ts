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
import Sensor from '../../../models/Arduino/Sensors/Sensor';

import { VerifyAuthToken } from '../../checkToken';
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

const ArduinoAppAddSensorRouter = express.Router();

ArduinoAppAddSensorRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

ArduinoAppAddSensorRouter.post(
  '/',
  VerifyAuthToken,
  async (req, res) => {
    /*
     * requires these datas on body:
     * - arduinoAppName
     * - sensorName
     */
    const arduinoApp = await ArduinoApp.findById(req.body.arduinoAppId);
    const isThereSensorNameLikeThis = await Sensor.findOne({
      appID: arduinoApp?.id,
    })
      .findOne({
        own: req.id,
      })
      .findOne({
        name: {
          $regex: new RegExp(
            '^' + req.body.sensorName.toLowerCase() + '$',
            'i',
          ),
        },
      });
    const sensor = new Sensor({
      name: req.body.sensorName,
      own: req.id,
      appID: arduinoApp?.id,
    });

    // console.log(isThereSensorNameLikeThis);
    if (arduinoApp) {
      // if there is not sensor name
      if (!isThereSensorNameLikeThis) {
        console.log(sensor, req.id);
        try {
          // increments user point
          await req.user?.updateOne({
            $inc: {
              points: 10,
            },
          });

          // save sensor
          await sensor.save();

          res.status(200).send({
            message: 'success saved to db',
            sensorId: sensor._id,
            status: 'success',
          });
        } catch (err) {
          // console.log('ERROR WHEN ADD SENSOR', err);
          const errors = await handleErrors(err);

          res.status(200).send({
            message:
              'enter sensor name, and make sure sensor name only contains letters and numbers.',
            errors: errors,
          });
          return;
        }
      } else {
        res.status(200).send({
          message: 'this sensor name already taken',
          status: 'error',
        });
        return;
      }
    } else {
      res.status(200).send({
        message: 'app is not registered',
        status: 'error',
      });
    }
  },
);

export default ArduinoAppAddSensorRouter;
