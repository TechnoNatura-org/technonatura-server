import * as express from 'express';
import { Request } from 'express';
import ArduinoApp, {
  sensorsInterface,
} from '../models/Arduino/Sensors/Sensors.model';
import SensorData from '../models/Arduino/Sensors/SensorsData.model';
import Sensor from '../models/Arduino/Sensors/Sensor';
import { UserBaseDocument } from '../models/User.model';

import User from '../models/User.model';
import VerifyJWT from '../controllers/checkToken';

import * as jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
  }
}

interface UserInRequest extends Request {
  user?: UserBaseDocument | null;
}

const ArduinoRouter = express.Router();

interface COOL {
  ownerID: number;
  appID: number;
}
// max age
const maxAge = 3 * 24 * 60 * 60 * 60;
const createToken = (sensor: COOL) => {
  return jwt.sign(
    { ...sensor },
    'arduinoToken230489udwjfioj38924ur89uedfiwjnsfnweiuhriuh23',
    {
      expiresIn: '100y',
    },
  );
};

ArduinoRouter.get('/apps', VerifyJWT, async (req, res) => {
  try {
    const apps = await ArduinoApp.find({ own: req.id });
    res.status(200).send({ apps: apps });
  } catch (err) {
    res.status(500).send({ message: 'error when fetching apps' });
  }
});

ArduinoRouter.post('/add/', VerifyJWT, async (req: UserInRequest, res) => {
  //@ts-ignore
  const { arduinoAppName, desc } = req.body;
  // const {id}: {id:number} = req

  try {
    // @ts-ignore
    const sensorsByUserId = await ArduinoApp.find({ own: req.id });
    const App = new ArduinoApp({
      name: arduinoAppName,
      desc: desc,
      own: req.id,
    });
    // @ts-ignore
    const isThere: number = sensorsByUserId.findIndex(
      (element: sensorsInterface) =>
        // @ts-ignore
        element.name == arduinoAppName,
    );
    //@ts-ignore
    //   console.log('isThere', sensorsByUserId, isThere, name);

    // if there is same sensor name
    if (isThere == -1) {
      await App.save();
      const token = createToken({
        // @ts-ignore
        ownerID: req.id,
        appID: App.id,
      });
      await req.user?.updateOne({ $inc: { points: 50 } });
      // user

      res.status(200).send({ message: 'success', arduinoAppToken: token });
      return;
    } else {
      res.status(500).send({ message: 'this name is already registered' });
      return;
    }
  } catch (err) {
    const errors = await handleErrors(err);
    res.status(500).send({ message: 'error', errors });
    return;
  }
});

ArduinoRouter.post('/add/sensor', VerifyJWT, async (req, res) => {
  const findUser = await User.findById(req.id);
  const arduinoApp = await ArduinoApp.findOne({
    own: findUser?._id,
  }).findOne({
    name: req.body.arduinoAppName,
  });
  const isThereSensorNameLikeThis = await Sensor.findOne({
    appID: arduinoApp?.id,
  })
    .findOne({ own: findUser?._id })
    .findOne({
      name: req.body.sensorName,
    });
  const sensor = new Sensor({
    name: req.body.sensorName,
    own: findUser?.id,
    appID: arduinoApp?.id,
  });

  // console.log(isThereSensorNameLikeThis);
  if (arduinoApp) {
    // if there is not sensor name
    if (!isThereSensorNameLikeThis) {
      console.log(sensor, findUser?._id);
      try {
        // push sensor id
        await arduinoApp?.updateOne({
          $push: {
            sensors: sensor.id,
          },
        });
        // increments user point
        await findUser?.updateOne({ $inc: { points: 10 } });

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

ArduinoRouter.post('/sensors/', VerifyJWT, async (req: UserInRequest, res) => {
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
});

ArduinoRouter.post('/del/:appID', VerifyJWT, async (req, res) => {
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
ArduinoRouter.post('/del/sensor/:sensorID', VerifyJWT, async (req, res) => {
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
});

ArduinoRouter.post('/update/:id', (req, res) => {});

ArduinoRouter.post('/updateSensor/:id', (req, res) => {});

ArduinoRouter.post('/delete/:id', (req, res) => {});

interface SignupBody {
  email: string;
  password: string;
  username: string;
  name: string;
}

interface Errors {
  desc: string;
  name: string;
}

// handle errors
async function handleErrors(
  err: {
    message: string;
    code: number;
    _message: string;
    keyValue: {
      name?: string;
      email?: string;
    };
  },
  SignupBody?: SignupBody,
) {
  // @ts-ignore
  let errors: Errors = {};

  if (err.message == 'Only Letters and Numbers are allowed') {
    errors.name = err.message;
  }

  // @ts-ignore
  // console.log(err.keyValue);

  // duplicate username error
  if (err.code === 11000 && err.keyValue.name) {
    errors.name = 'that username is already registered';
  }

  // console.log(err);
  // validation errors
  if (
    err._message &&
    (err._message.includes('ArduinoApp validation failed') ||
      err._message.includes('sensor validation failed'))
  ) {
    // console.log(err);

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
