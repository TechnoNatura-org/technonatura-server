import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { sensorDataSchema, sensorDataInterface } from './SensorsData.model';

const {
  default: { isEmail, isURL },
} = Validator;

export interface sensorInterface {
  name: string;
  appID: string;
  own: string;
  data?: Array<sensorDataInterface>;
}

export interface sensorBaseDocument extends sensorInterface, Document {
  data: Types.Array<sensorDataInterface>;
}

// Export this for strong typing
export interface sensorDocument extends sensorBaseDocument {}

// For model
export interface sensorModel extends Model<sensorBaseDocument> {}

const sensorSchema = new Schema<sensorDocument, sensorModel>({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    validate: [validateUsername, 'Only characters and numbers are allowed'],
    minlength: [4, 'Minimum name length is 4 characters'],
  },

  appID: {
    type: String,
    required: true,
  },
  own: {
    type: String,
    required: true,
  },
  data: [sensorDataSchema],
});

function validateUsername(str: string) {
  if (!str.match(/^[A-Za-z0-9_-]*$/)) {
    return false;
  }

  return true;
}

export default model<sensorDocument, sensorModel>('sensor', sensorSchema);
