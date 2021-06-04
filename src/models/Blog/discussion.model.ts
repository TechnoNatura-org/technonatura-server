import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';

export interface DiscussionInterface {
  text: string;
  blogId: string;
  userId: string;
  replyTo: string;
}

export interface DiscussionBaseDocument extends DiscussionInterface, Document {}

// Export this for strong typing
export interface DiscussionDocument extends DiscussionBaseDocument {}

// For model
export interface DiscussionModel extends Model<DiscussionBaseDocument> {}

const DiscussionSchema = new Schema<DiscussionDocument, DiscussionModel>({
  text: {
    type: String,
    required: [true, 'Please enter blog title'],
    minlength: [4, 'Minimum title length is 4 characters'],
  },
  blogId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  replyTo: {
    type: String,
  },
});

const blogTagModel = model<DiscussionDocument, DiscussionModel>(
  'Discussion',
  DiscussionSchema,
);

export default blogTagModel;
