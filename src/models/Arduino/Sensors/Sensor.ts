import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { sensorsDataSchema, sensorsDataInterface } from './SensorsData.model';

const {
  default: { isEmail, isURL },
} = Validator;

export interface sensorInterface {
  name: string;
  data?: Array<sensorsDataInterface>;
  own?: string;
}

export interface sensorBaseDocument extends sensorInterface, Document {
  data: Types.Array<sensorsDataInterface>;
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
  own: {
    type: String,
    required: true,
  },
  data: [sensorsDataSchema],
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9]+$/)) {
    return false;
  }

  return true;
}

export default model<sensorDocument, sensorModel>('sensor', sensorSchema);
