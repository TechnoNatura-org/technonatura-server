import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { Response } from 'express';
import { sensorsDataSchema, sensorsDataInterface } from './SensorsData.model';
import Sensor, { sensorInterface } from './Sensor';

const {
  default: { isEmail, isURL },
} = Validator;

export interface sensorsInterface {
  name: string;
  desc: string;
  own?: string;
  token?: string;
}

export interface sensorsBaseDocument extends sensorsInterface, Document {
  data: Types.Array<string>;
}

// Export this for strong typing
export interface sensorsDocument extends sensorsBaseDocument {}

// For model
export interface sensorsModel extends Model<sensorsBaseDocument> {
  getAllSensors(appID: string): Promise<sensorInterface[] | undefined>;
}

const sensorsSchema = new Schema<sensorsDocument, sensorsModel>({
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
  token: String,
});

function validateUsername(str: string) {
  if (!str.match(/^[A-Za-z0-9_-]*$/)) {
    return false;
  }

  return true;
}

// ArduinoAppModel.methods.getAllSensors = async function (appID: string) {
//   console.log('WOYYWY', appID);
//   const sensors = await Sensor.find({ appID: appID });

//   return;
// };

const ArduinoAppModel = model<sensorsDocument, sensorsModel>(
  'ArduinoApp',
  sensorsSchema,
);
ArduinoAppModel.getAllSensors = async function(
  appID: string,
): Promise<sensorInterface[] | undefined> {
  // console.log('WOYYWY', appID);
  const sensors = await Sensor.find({ appID: appID });

  return sensors;
};
export default ArduinoAppModel;
