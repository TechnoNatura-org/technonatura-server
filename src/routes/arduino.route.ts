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
import Sensor from '../models/Arduino/Sensors/Sensor';

import User, { UserBaseDocument } from '../models/User.model';
import { VerifyAuthToken } from '../controllers/checkToken';
import createToken, { tokenForTypes } from '../controllers/createToken';
import * as jwt from 'jsonwebtoken';
import SensorsData from '../models/Arduino/Sensors/SensorsData.model';

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

ArduinoRouter.post('/app', VerifyAuthToken, async (req, res) => {
  const { arduinoAppId } = req.body;

  try {
    const app = await ArduinoApp.findById(arduinoAppId);
    res.status(200).send({ app: app });
  } catch (err) {
    res.status(200).send({ message: 'error when fetching apps' });
  }
});
ArduinoRouter.post('/sensor', VerifyAuthToken, async (req, res) => {
  const { sensorId, appId } = req.body;

  if (sensorId) {
    try {
      const sensor = await Sensor.findById(sensorId).findOne({ appID: appId });

      res.status(200).send({ sensor: sensor });
      return;
    } catch (err) {
      res
        .status(200)
        .send({ message: 'error when fetching apps', status: 'error' });
      return;
    }
  }
  res.status(200).send({ message: 'no sensor id provided', status: 'error' });
  return;
});

ArduinoRouter.post(
  '/add/',
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
        App.token = token;
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

ArduinoRouter.post('/add/sensor', VerifyAuthToken, async (req, res) => {
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
        $regex: new RegExp('^' + req.body.sensorName.toLowerCase() + '$', 'i'),
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
});

ArduinoRouter.post(
  '/sensors/',
  VerifyAuthToken,
  /*
   * requires these datas on body:
   * - UserInRequest
   * - authToken
   */

  async (req: UserInRequest, res) => {
    const { arduinoAppId } = req.body;
    const isThereArduinoApp = await ArduinoApp.findById(arduinoAppId);

    if (isThereArduinoApp) {
      try {
        // @ts-ignore
        const sensors = await ArduinoApp.getAllSensors(isThereArduinoApp.id);

        res.status(200).send({ sensors: sensors });
      } catch (err) {
        res
          .status(500)
          .send({ message: 'error when fetching sensors', status: 'error' });
      }
    } else {
      res.status(500).send({ message: 'app not found', status: 'error' });
    }
  },
);

// ===========================================================
// DELETE APP AND SENSORS
// ===========================================================
ArduinoRouter.post('/del/:appID', VerifyAuthToken, async (req, res) => {
  const { appID } = req.params;
  const app = await ArduinoApp.findById(appID);

  // console.log(sensor, req.id);
  if (app && app.own == req.id) {
    try {
      await app.remove();
      await Sensor.find({ appID: appID }).remove();
      res
        .status(200)
        .send({ message: 'arduino app deleted', status: 'success' });
      return;
    } catch (err) {
      res.status(200).send({
        message: 'error when remove app from database',
        status: 'error',
      });
      return;
    }
  } else {
    res.status(200).send({ message: 'app not found', status: 'error' });
    return;
  }
});

ArduinoRouter.post(
  '/del/sensor/:sensorID',
  VerifyAuthToken,
  async (req, res) => {
    const { sensorID } = req.params;
    const sensor = await Sensor.findById(sensorID);

    // console.log(sensor, req.id);
    if (sensor && sensor.own == req.id) {
      try {
        await sensor.remove();
        res.status(200).send({ message: 'success', status: 'success' });
        return;
      } catch (err) {
        res.status(500).send({
          message: 'error when remove sensor from database',
          status: 'success',
        });
        return;
      }
    } else {
      res.status(200).send({ message: 'sensor not found', status: 'warning' });
      return;
    }
  },
);
// ===========================================================
// DELETE APP AND SENSORS
// ===========================================================

// ===========================================================
// UPDATE APP AND SENSORS
// ===========================================================
ArduinoRouter.post('/update/:id', VerifyAuthToken, (req, res) => {});

ArduinoRouter.post(
  '/update/sensor/:sensorID',
  VerifyAuthToken,
  (req, res) => {},
);
ArduinoRouter.post('/add/data/', async (req, res) => {
  const { arduinoAppToken, sensors } = req.body;

  if (!arduinoAppToken) {
    res.status(200).json({ message: 'token not provided', status: 'error' });
    return;
  }

  try {
    // convert jwt
    const verifyToken = await jwt.verify(
      arduinoAppToken,
      process.env.ArduinoApp_SECRET_TOKEN || 'authSecret',
    );

    const arduinoApp = await ArduinoApp.findById(
      // @ts-ignore
      verifyToken.appID,
    );

    if (!arduinoApp) {
      res
        .status(200)
        .json({ message: 'Arduino App Not Found', status: 'error' });
      return;
    }

    if (typeof sensors == 'object') {
      try {
        for (const sensor in sensors) {
          const TypeOfSensorData = Number(sensors[sensor]);

          // console.log(isNaN(TypeOfSensorData));
          if (!isNaN(TypeOfSensorData)) {
            const foundSensor = await Sensor.find({
              appID: arduinoApp._id,
            }).findOne({
              name: sensor,
            });
            // console.log(foundSensor, arduinoApp._id, sensor);

            if (foundSensor) {
              const sensorData = new SensorsData({ data: TypeOfSensorData });

              await foundSensor.updateOne({
                $push: {
                  data: sensorData,
                },
              });
              // console.log('foundSensor', foundSensor);
            }
          }
        }

        // console.log(arduinoApp);
        // console.log(sensors);

        // console.log(verifyToken);
        res
          .status(200)
          .json({ message: 'Success Added Data', status: 'success' });
        return;
      } catch (err) {
        console.log(err);
        res
          .status(200)
          .json({ message: "sensors isn't object", status: 'error' });
        return;
      }
    }
  } catch (err) {
    res.status(200).json({ message: 'token might expired', status: 'error' });
    return;
  }
});

// ===========================================================
// UPDATE APP AND SENSORS
// ===========================================================

// ====================================================

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
