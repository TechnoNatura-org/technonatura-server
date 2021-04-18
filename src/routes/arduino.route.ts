import * as express from 'express';
import SensorData from '../models/Sensors/SensorsData.model';
import Sensor, { sensorsInterface } from '../models/Sensors/Sensors.model';
import User, { UserBaseDocument, UserInterface } from '../models/User.model';
import * as jwt from 'jsonwebtoken';

const ArduinoRouter = express.Router();

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

    try {
      // @ts-ignore
      const sensorsByUserId = await Sensor.find({ own: req.id });
      const sensor = new Sensor({
        name: name,
        desc: desc,
        // @ts-ignore
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

      // if there is same sensor name
      if (isThere == -1) {
        await sensor.save();
        res.status(200).send({ message: 'success' });
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
