import { Schema, Model, Document, model, Types, Query } from 'mongoose';

export interface blogPostInterface {
  title: string;
  tags?: Array<string>;
  content: string;
  author: string;
  publishDate: string;
  lastEdit: string;
  thumbnail: string;
  published: boolean;
}

export interface blogPostBaseDocument extends blogPostInterface, Document {
  tags: Types.Array<string>;
}

// Export this for strong typing
export interface blogPostDocument extends blogPostBaseDocument {}

// For model
export interface blogPostModel extends Model<blogPostBaseDocument> {}

const blogPostSchema = new Schema<blogPostDocument, blogPostModel>({
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
    default: Date.now,
  },
  lastEdit: {
    type: String,
    required: true,
    default: Date.now,
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
  published: {
    type: Boolean,
    default: false,
  },
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9._-]+$/)) {
    return false;
  }

  return true;
}

const blogTagModel = model<blogPostDocument, blogPostModel>(
  'blogPost',
  blogPostSchema,
);

export default blogTagModel;
