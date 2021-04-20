import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';

const {
  default: { isNumeric },
} = Validator;

export interface sensorsDataInterface {
  date: number;
  data: number;
}

export interface sensorsDataBaseDocument
  extends sensorsDataInterface,
    Document {}

// Export this for strong typing
export interface sensorsDataDocument extends sensorsDataBaseDocument {}

// For model
export interface sensorsDataModel extends Model<sensorsDataBaseDocument> {}

export const sensorsDataSchema = new Schema<
  sensorsDataDocument,
  sensorsDataModel
>({
  date: {
    type: Number,
    required: true,
    validate: [isNumeric, 'Please enter a valid email'],
    default: Date.now,
  },
  data: {
    type: Number,
    required: [true, 'Please enter the data'],
    validate: [isNumeric, 'Please enter a valid email'],
  },
});

export default model<sensorsDataDocument, sensorsDataModel>(
  'sensorsData',
  sensorsDataSchema,
);
