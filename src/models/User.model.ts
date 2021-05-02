import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import * as bcrypt from 'bcrypt';

const {
  default: { isEmail, isURL },
} = Validator;

interface SocialMedia {
  name: string;
  url: string;
}

export interface UserInterface {
  points: number;
  email: string;
  name: string;
  username: string;
  isAccountVerified: boolean;
  password: string;
  accountCreated: Date;
  follows?: Array<string>;
  birthDate: Date;
  roles: Array<string>;
  socialMedias?: Array<SocialMedia>;
}

export interface UserBaseDocument extends UserInterface, Document {
  roles: Types.Array<string>;
  socialMedias?: Types.Array<SocialMedia>;
  follows?: Types.Array<string>;
}

// Export this for strong typing
export interface UserDocument extends UserBaseDocument {}

// For model
export interface UserModel extends Model<UserBaseDocument> {
  login(username: string, password: string): Promise<UserBaseDocument>;
}

const userSchema = new Schema<UserDocument, UserModel>({
  points: {
    type: Number,
    require: true,
    default: 0,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    lowercase: true,
    unique: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  isAccountVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    minlength: [4, 'Minimum name length is 4 characters'],
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'username cannot be blank'],
    validate: [validateUsername, 'Only Letters and Numbers are allowed'],
  },
  accountCreated: {
    type: Date,
    default: Date.now,
  },
  follows: [String],
  birthDate: {
    type: Date,
  },
  roles: [String], // the role name, the role name must be unique
  socialMedias: [
    {
      name: {
        type: String,
        required: [true, 'Please enter social media'],
      },
      url: {
        type: String,
        required: [true, 'Please enter social media'],
        validate: [isURL, 'Please enter a valid url'],
      },
    },
  ],
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9]+$/)) {
    return false;
  }

  return true;
}

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  // if (!this.email.match(/^[a-zA-Z0-9]+$/)) {

  // }
  next();
});

// static method to login user
userSchema.statics.login = async function(
  this: Model<UserDocument>,
  username,
  password,
) {
  const user = await this.findOne({ username: username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect username');
};

export default model<UserDocument, UserModel>('User', userSchema);
