import * as express from 'express';
import { Request } from 'express';
import Sensor, {
  sensorsInterface,
} from '../models/Arduino/Sensors/Sensors.model';
import SensorData from '../models/Arduino/Sensors/SensorsData.model';
import User from '../models/User.model';
import VerifyJWT from '../controllers/checkToken';

import * as jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    id: number;
  }
}

const ArduinoRouter = express.Router();

interface COOL {
  ownerID: number;
  sensorID: number;
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

ArduinoRouter.post(
  '/add/',
  async (req, res, next) => {
    //@ts-ignore
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
          //   console.log('hgsufgusy');
          // // @ts-ignore
          // console.log(
          //   verifyToken, // @ts-ignore
          //   verifyToken._id,
          //   // @ts-ignore
          //   user,
          // );

          // @ts-ignore
          if (verifyToken.password != user?.password) {
            // console.log('pass');

            res.status(500).send({
              message: 'invalid password, password might has changed',
            });
            return;
          } else {
            // console.log('neSTx');
            // @ts-ignore
            req.id = user._id;

            return next();
          }
        }
      } catch (err) {
        // console.log('ero');

        res.status(500).send({ message: 'token not provided' });
        return;
      }

      // console.log(token.split(' '));
    }

    res.status(500).send({ message: 'token undefined' });
    return;
  },
  async (req, res) => {
    //@ts-ignore
    const { name, desc } = req.body;
    // const {id}: {id:number} = req

    try {
      // @ts-ignore
      const sensorsByUserId = await Sensor.find({ own: req.id });
      const sensor = new Sensor({
        name: name,
        desc: desc,
        own: req.id,
      });
      // @ts-ignore
      const isThere: number = sensorsByUserId.findIndex(
        (element: sensorsInterface) =>
          // @ts-ignore
          element.name == name,
      );
      //@ts-ignore
      //   console.log('isThere', sensorsByUserId, isThere, name);

      req.isPaused;

      // if there is same sensor name
      if (isThere == -1) {
        await sensor.save();
        const token = createToken({
          // @ts-ignore
          ownerID: req.id,
          sensorID: sensor.id,
        });

        res.status(200).send({ message: 'success', token: token });
        return;
      } else {
        res.status(500).send({ message: 'this name is already registered' });
        return;
      }
    } catch (err) {
      const errors = await handleErrors(err);
      console.log(errors);
      res.status(500).send({ message: 'error', errors });
      return;
    }
  },
);

ArduinoRouter.post('/add/sensorData', VerifyJWT, async (req, res) => {
  if (req.body.name) {
    const sensorData = new SensorData({
      date: Date.now(),
      data: req.body.data,
    });

    const findUser = await User.findById(req.id);
    const sensor = await Sensor.findOne({
      own: findUser?._id,
      name: req.body.name,
    });

    console.log(sensor, findUser?._id);

    await findUser?.updateOne(
      { $push: { log: sensorData } },
      { new: true },
      (error, updatedUser) => {
        console.log('hey');
        if (error) {
          res
            .status(500)
            .send(
              'Make sure you fill out all of the input, and a valid userId',
            );
          return;
        }
        res.status(200).send('sent');
        return;
      },
    );
  }
  res.status(200).send({ message: 'success' });
  return;
});

ArduinoRouter.post('/add/sensor', VerifyJWT, async (req, res) => {
  const sensor = new Sensor({
    name: req.body.name,
  });
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

  console.log(err);
  // validation errors
  if (err._message && err._message.includes('sensors validation failed')) {
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
