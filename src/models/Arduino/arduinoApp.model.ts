import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import Sensor, { sensorInterface } from './Sensors/Sensor';
import { ArduinoDB } from '../../db/arduinoDB';

export interface arduinoAppInterface {
  name: string;
  desc: string;
  own: string;
  token: {
    token: string;
    tokenCreated: number;
  };
  sensors: Array<string>;
}

export interface arduinoAppBaseDocument extends arduinoAppInterface, Document {
  data: Types.Array<string>;
  // getApp(): Promise<string>;
}

// Export this for strong typing
export interface sensorsDocument extends arduinoAppBaseDocument {}

// For model
export interface sensorsModel extends Model<arduinoAppBaseDocument> {
  deleteApp(userId: string): Promise<void | Error> | void;
  getAllSensors(appID: string): Promise<sensorInterface[] | undefined>;
}

const ArduinoAppSchema = new Schema<sensorsDocument, sensorsModel>({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    validate: [validateUsername, 'Only characters and numbers are allowed'],
    minlength: [4, 'Minimum name length is 4 characters'],
  },
  desc: {
    type: String,
    required: [true, 'Please enter desc'],
    minlength: [4, 'Minimum desc length is 4 characters'],
    maxLength: [20, 'too long'],
  },
  own: {
    type: String,
    required: [true, 'Please enter desc'],
  },
  sensors: [String],
  token: {
    token: String,
    tokenCreated: Number,
  },
});

function validateUsername(str: string) {
  if (!str.match(/^[A-Za-z0-9_-]*$/)) {
    return false;
  }

  return true;
}

// ArduinoAppSchema.methods.getApp = async function(this: arduinoAppBaseDocument) {
//   return this;
// };

const ArduinoAppModel = ArduinoDB.model<sensorsDocument, sensorsModel>(
  'ArduinoApp',
  ArduinoAppSchema,
);
ArduinoAppModel.getAllSensors = async function(
  appID: string,
): Promise<sensorInterface[] | undefined> {
  const sensors = await Sensor.find({ appID: appID });

  return sensors;
};
ArduinoAppModel.deleteApp = async function(userId: string) {
  try {
    await ArduinoAppModel.find({ own: userId }).deleteMany();
    await Sensor.find({ own: userId }).deleteMany();
  } catch (err) {
    throw new Error('There was en error');
  }
};
export default ArduinoAppModel;
