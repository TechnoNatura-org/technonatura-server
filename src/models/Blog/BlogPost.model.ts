import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { Response } from 'express';

const {
  default: { isEmail, isURL },
} = Validator;

interface blogTag {
  name: String;
  blogTagID: String;
}

export interface blogTagInterface {
  title: string;
  tags?: Array<blogTag>;
  content: string;
  author: string;
  publishDate: string;
  thumbnail: string;
}

export interface blogTagBaseDocument extends blogTagInterface, Document {
  tags: Types.Array<blogTag>;
}

// Export this for strong typing
export interface blogTagDocument extends blogTagBaseDocument {}

// For model
export interface blogTagModel extends Model<blogTagBaseDocument> {}

const blogTagSchema = new Schema<blogTagDocument, blogTagModel>({
  title: {
    type: String,
    required: [true, 'Please enter blog title'],
    validate: [validateUsername, 'Only characters and numbers are allowed'],
    minlength: [4, 'Minimum title length is 4 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please enter post content'],
    minlength: [4, 'Minimum name length is 4 characters'],
    maxLength: [5000, 'too long'],
  },
  publishDate: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tags: [{ name: String, blogTagID: String }],
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9._-]+$/)) {
    return false;
  }

  return true;
}

const blogTagModel = model<blogTagDocument, blogTagModel>(
  'blogTag',
  blogTagSchema,
);

export default blogTagModel;
