import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import * as bcrypt from 'bcrypt';

import ArduinoApp from '../models/Arduino/arduinoApp.model';

const {
  default: { isEmail, isURL },
} = Validator;

interface SocialMedia {
  name: string;
  url: string;
}

export type Grades = 7 | 8 | 9;
export interface UserInterface {
  isAccountVerified: boolean;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  banner: string;
  bio: string;
  status: {
    emoji: string;
    text: string;
  };
  follows?: Array<string>;
  roles: Array<string>;
  socialMedias?: Array<SocialMedia>;
  points: number;
  accountCreated: Date;
  birthDate: Date;

  statusInMTsTechnoNatura: {
    techer: boolean;
    student: boolean;
    alumni: boolean;
    period: string; // only for student and alumni
  };
}

export interface UserBaseDocument extends UserInterface, Document {
  roles: Types.Array<string>;
  socialMedias?: Types.Array<SocialMedia>;
  follows?: Types.Array<string>;

  changePassword(password: string): Promise<string>;
  deleteAccount(): Promise<void>;
}

// Export this for strong typing
export interface UserDocument extends UserBaseDocument {}

// For model
export interface UserModel extends Model<UserBaseDocument> {
  login(username: string, password: string): Promise<UserBaseDocument>;
}

const userSchema = new Schema<UserDocument, UserModel>({
  status: new Schema({
    emoji: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  }),
  bio: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  banner: {
    type: String,
    default: '',
  },
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
        enum: [
          'github',
          'gitlab',
          'instagram',
          'facebook',
          'website',
          'youtube',
          'discord',
        ],
        required: [true, 'Please enter social media'],
      },
      url: {
        type: String,
        required: [true, 'Please enter social media'],
        validate: [isURL, 'Please enter a valid url'],
      },
    },
  ],

  statusInMTsTechnoNatura: {
    techer: Boolean,
    student: Boolean,
    alumni: Boolean,
    period: String, // only for student and alumni
  },
});

function validateUsername(str: string) {
  if (!str.match(/^[a-zA-Z0-9]+$/)) {
    return false;
  }

  return true;
}

userSchema.methods.changePassword = async function(
  this: UserBaseDocument,
  password: string,
) {
  // console.log(this.password);
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  await this.updateOne({ password: hashedPassword });
  // console.log(this.password);

  return hashedPassword;
};

userSchema.methods.deleteAccount = async function(this: UserBaseDocument) {
  try {
    await ArduinoApp.deleteApp(this.id);
    await this.delete();
  } catch (err) {
    throw new Error(err);
  }
};

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  // console.log('hello');
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
    throw new Error('incorrect password');
  }
  throw new Error('incorrect username');
};

export default model<UserDocument, UserModel>('User', userSchema);
