import { Schema, Model, Document, model, Types, Query } from 'mongoose';

export interface blogPostInterface {
  title: string;
  tags?: Array<string>;
  content: string;
  desc: string;
  author: string;
  publishDate: string;
  lastEdit: string;
  thumbnail: {
    src: string;
    alt: string;
    option: 'unsplash' | 'local';
    unsplash: {
      author: string;
      src: string;
    };
  };
  published: boolean;
  category: string;
  views: number;

  likes: Array<string>; //list of users ID
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
    maxLength: [20, 'Story content should be of maxinum 40 letter length'],
  },
  desc: {
    type: String,
    required: [true, 'Please enter post content'],
    minlength: [10, 'Minimum name length is 10 characters'],
    maxLength: [100, 'too long'],
  },
  content: {
    type: String,
    required: [true, 'Please enter post content'],
    minlength: [30, 'Minimum name length is 4 characters'],
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
    src: String,
    alt: String,
    option: {
      type: String,
      enum: ['unsplash', 'local'],
    },
    unsplash: {
      author: String,
      src: String,
    },
  },
  author: {
    type: String,
    required: true,
  },
  tags: [String],
  likes: [String],
  published: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  views: Number,
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
