import { Schema, Model, Document, model, models } from 'mongoose';

type notificationType = { type: 'follow' } | { type: 'like'; p: string };

export type userProjectNotification = {
	userId: string;
} & notificationType;

export interface UserProjectInterface {
	userId: string;
	likes: Array<string>;
	follows: Array<string>;
	notifications: Array<userProjectNotification>;
	bio: string;
	banner: string;
	projects: number;
}

export interface UserBaseDocument extends UserProjectInterface, Document {
	likes: Array<string>;
	follows: Array<string>;
	notifications: Array<userProjectNotification>;
}

// Export this for strong typing
export interface UserDocument extends UserBaseDocument {}

// For model
export interface UserModel extends Model<UserBaseDocument> {}

const UserSchema = new Schema<UserDocument, UserModel>({
	userId: {
		type: String,
		required: [true, 'Please enter an email'],
		unique: false,
	},

	likes: [String],
	follows: [String],
	notifications: [
		{
			userId: String,
			type: String,
			p: String,
		},
	],
	banner: String,
	bio: String,
	projects: {
		type: Number,
		default: 0,
		min: 0,
	},
});

export default model<UserDocument, UserModel>('UserProject', UserSchema);
