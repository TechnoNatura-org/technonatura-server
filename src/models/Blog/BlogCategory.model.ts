import { Schema, Model, Document, model, Types, Query } from 'mongoose';

export interface blogCategoryInterface {
  title: string;
  banner: string;
}

export interface blogCategoryBaseDocument
  extends blogCategoryInterface,
    Document {}

// Export this for strong typing
export interface blogCategoryDocument extends blogCategoryBaseDocument {}

// For model
export interface blogCategoryModel extends Model<blogCategoryBaseDocument> {}

const blogCategorySchema = new Schema<blogCategoryDocument, blogCategoryModel>({
  title: {
    type: String,
    required: [true, 'Please enter blog title'],
    validate: [validateTitle, 'Only characters and numbers are allowed'],
    minlength: [4, 'Minimum title length is 4 characters'],
    maxLength: [20, 'Story content should be of maxinum 40 letter length'],
  },
  banner: {
    type: String,
  },
});

function validateTitle(str: string) {
  if (!str.match(/^[A-Za-z0-9_-]*$/)) {
    return false;
  }

  return true;
}

const blogTagModel = model<blogCategoryDocument, blogCategoryModel>(
  'blogCategory',
  blogCategorySchema,
);

export default blogTagModel;
