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
import ArduinoApp, {
  sensorsInterface,
} from '../models/Arduino/Sensors/arduinoApp.model';
import SensorData from '../models/Arduino/Sensors/SensorsData.model';
import Sensor from '../models/Arduino/Sensors/Sensor';

import User, { UserBaseDocument } from '../models/User.model';
import { VerifyAuthToken } from '../controllers/checkToken';
import createToken, { tokenForTypes } from '../controllers/createToken';

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
    user?: UserBaseDocument | null;
  }
}

interface UserInRequest extends Request {
  user?: UserBaseDocument | null;
}

const ArduinoRouter = express.Router();

ArduinoRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

ArduinoRouter.post('/apps', VerifyAuthToken, async (req, res) => {
  try {
    const apps = await ArduinoApp.find({ own: req.id });
    res.status(200).send({ apps: apps });
  } catch (err) {
    res.status(200).send({ message: 'error when fetching apps' });
  }
});

ArduinoRouter.post(
  '/add/',
  VerifyAuthToken,
  async (req: UserInRequest, res) => {
    /*
     *
     * 1. Verify JWT
     *
     *
     *
     *
     */

    //@ts-ignore
    const { arduinoAppName, desc } = req.body;
    // const {id}: {id:number} = req

    // @ts-ignore
    const isThere = await ArduinoApp.find({
      own: req.id,
    }).findOne({
      name: arduinoAppName,
    });
    //@ts-ignore
    //   console.log('isThere', sensorsByUserId, isThere, name);

    console.log(isThere);

    // if there is same sensor name
    if (!isThere) {
      const App = new ArduinoApp({
        name: arduinoAppName,
        desc: desc,
        own: req.id,
      });

      try {
        await App.save();
        const token = createToken(
          {
            // @ts-ignore
            ownerID: req.id,
            appID: App.id,
          },
          tokenForTypes.arduinoApp,
        );
        await App.updateOne({ token: token });
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

ArduinoRouter.post('/add/sensor', VerifyAuthToken, async (req, res) => {
  const arduinoApp = await ArduinoApp.findOne({
    own: req?.id,
  }).findOne({
    name: req.body.arduinoAppName,
  });
  const isThereSensorNameLikeThis = await Sensor.findOne({
    appID: arduinoApp?.id,
  })
    .findOne({ own: req.id })
    .findOne({
      name: req.body.sensorName,
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
        // push sensor id
        await arduinoApp?.updateOne({
          $push: {
            sensors: sensor.id,
          },
        });
        // increments user point
        await req.user?.updateOne({ $inc: { points: 10 } });

        // save sensor
        await sensor.save();
        res.status(200).send({ message: 'success saved to db' });
      } catch (err) {
        console.log('ERROR WHEN ADD SENSOR', err);
        const errors = await handleErrors(err);

        res.status(200).send({
          message:
            'enter sensor name, and make sure sensor name only contains letters and numbers.',
          errors: errors,
        });
        return;
      }
    } else {
      res.status(200).send({ message: 'this sensor name already taken' });
      return;
    }
  } else {
    res.status(200).send({ message: 'app is not registered' });
  }
});

ArduinoRouter.post(
  '/sensors/',
  VerifyAuthToken,
  async (req: UserInRequest, res) => {
    const { arduinoAppName } = req.body;
    const isThereArduinoApp = await ArduinoApp.find({
      own: req.id,
    }).findOne({ name: arduinoAppName });

    if (isThereArduinoApp) {
      try {
        // @ts-ignore
        const sensors = await ArduinoApp.getAllSensors(isThereArduinoApp.id);

        // arduinoApp?.sensors
        // arduinoApp?.getAllSensors()

        res.status(200).send({ sensors: sensors });
      } catch (err) {
        res.status(500).send({ message: 'error when fetching sensors' });
      }
    } else {
      res.status(500).send({ message: 'app not found' });
    }
  },
);

ArduinoRouter.post('/del/:appID', VerifyAuthToken, async (req, res) => {
  const { appID } = req.params;
  const app = await ArduinoApp.findById(appID);

  // console.log(sensor, req.id);
  if (app && app.own == req.id) {
    try {
      await app.remove();
      await Sensor.find({ appID: appID }).remove();
      res.status(200).send({ message: 'success' });
      return;
    } catch (err) {
      res.status(500).send({ message: 'error when remove app from database' });
      return;
    }
  } else {
    res.status(200).send({ message: 'app not found' });
    return;
  }
});
ArduinoRouter.post(
  '/del/sensor/:sensorID',
  VerifyAuthToken,
  async (req, res) => {
    const { sensorID } = req.params;
    const sensor = await Sensor.findById(sensorID);
    const app = await ArduinoApp.findById(sensor?.appID);

    // console.log(sensor, req.id);
    if (sensor && sensor.own == req.id) {
      try {
        await sensor.remove();
        await app?.updateOne({
          $pull: {
            sensors: sensor.id,
          },
        });
        res.status(200).send({ message: 'success' });
        return;
      } catch (err) {
        res
          .status(500)
          .send({ message: 'error when remove sensor from database' });
        return;
      }
    } else {
      res.status(200).send({ message: 'sensor not found' });
      return;
    }
  },
);

ArduinoRouter.post('/update/:id', (req, res) => {});

ArduinoRouter.post('/update/sensor/', (req, res) => {});

interface Errors {
  desc: string;
  name: string;
}

// handle errors
async function handleErrors(err: {
  message: string;
  code: number;
  _message: string;
  keyValue: {
    name?: string;
    email?: string;
  };
}) {
  // @ts-ignore
  let errors: Errors = {};

  if (err.message == 'Only Letters and Numbers are allowed') {
    errors.name = err.message;
  }

  // duplicate username error
  if (err.code === 11000 && err.keyValue.name) {
    errors.name = 'that username is already registered';
  }

  // validation errors
  if (
    err._message &&
    (err._message.includes('ArduinoApp validation failed') ||
      err._message.includes('sensor validation failed'))
  ) {
    // @ts-ignore
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      if (properties.message) {
        // @ts-ignore
        errors[properties.path] = properties.message;
      }
    });
  }

  return errors;
}

export default ArduinoRouter;
