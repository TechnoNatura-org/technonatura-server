import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { Response } from 'express';

export interface blogTagInterface {
  name: string;
  desc: string;
}

export interface blogTagBaseDocument extends blogTagInterface, Document {}

// Export this for strong typing
export interface blogTagDocument extends blogTagBaseDocument {}

// For model
export interface blogTagModel extends Model<blogTagBaseDocument> {}

const blogTagSchema = new Schema<blogTagDocument, blogTagModel>({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    unique: true,
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
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9._-]+$/)) {
    return false;
  }

  return true;
}

// ArduinoAppModel.methods.getAllblogTag = async function (appID: string) {
//   console.log('WOYYWY', appID);
//   const blogTag = await Sensor.find({ appID: appID });

//   return;
// };

const blogTagModel = model<blogTagDocument, blogTagModel>(
  'blogTag',
  blogTagSchema,
);

export default blogTagModel;
