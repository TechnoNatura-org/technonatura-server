import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { sensorsDataSchema, sensorsDataInterface } from './SensorsData.model';

const {
  default: { isEmail, isURL },
} = Validator;

export interface sensorsInterface {
  name: string;
  sensors?: Array<string>;
  desc: string;
  own?: string;
}

export interface sensorsBaseDocument extends sensorsInterface, Document {
  data: Types.Array<string>;
}

// Export this for strong typing
export interface sensorsDocument extends sensorsBaseDocument {}

// For model
export interface sensorsModel extends Model<sensorsBaseDocument> {}

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
    validate: [validateUsername, 'Only characters and numbers are allowed'],
    minlength: [4, 'Minimum name length is 4 characters'],
    maxLength: [100, 'too long'],
  },
  own: {
    type: String,
    required: [true, 'Please enter desc'],
  },
  sensors: [String],
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9]+$/)) {
    return false;
  }

  return true;
}

export default model<sensorsDocument, sensorsModel>(
  'ArduinoApp',
  sensorsSchema,
);
