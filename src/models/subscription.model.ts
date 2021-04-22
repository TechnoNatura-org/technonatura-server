import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import * as bcrypt from 'bcrypt';

const {
  default: { isEmail, isURL },
} = Validator;

export interface SubscriptionInterface {
  email: string;
  name: string;
}

export interface SubscriptionBaseDocument
  extends SubscriptionInterface,
    Document {}

// Export this for strong typing
export interface SubscriptionDocument extends SubscriptionBaseDocument {}

// For model
export interface SubscriptionModel extends Model<SubscriptionBaseDocument> {}

const SubscriptionSchema = new Schema<SubscriptionDocument, SubscriptionModel>({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    lowercase: true,
    unique: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  name: {
    type: String,
    lowercase: true,
    required: [true, 'Subscription name cannot be blank'],
    validate: [validateUsername, 'Only Letters and Numbers are allowed'],
  },
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9]+$/)) {
    return false;
  }

  return true;
}

export default model<SubscriptionDocument, SubscriptionModel>(
  'Subscription',
  SubscriptionSchema,
);
