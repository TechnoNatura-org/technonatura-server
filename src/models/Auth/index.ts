import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import { AuthAppInterface } from './index.d';

export interface AuthAppBaseDocument extends AuthAppInterface, Document {
	data: Types.Array<string>;
	// getApp(): Promise<string>;
}

// Export this for strong typing
export interface sensorsDocument extends AuthAppBaseDocument {}

// For model
export interface sensorsModel extends Model<AuthAppBaseDocument> {
	// deleteApp(userId: string): Promise<void | Error> | void;
	// getAllSensors(appID: string): Promise<sensorInterface[] | undefined>;
}

const AuthAppSchema = new Schema<sensorsDocument, sensorsModel>({
	name: {
		type: String,
		required: [true, 'Please enter your name'],
		validate: [validateUsername, 'Only characters and numbers are allowed'],
		minlength: [4, 'Minimum name length is 4 characters'],
		lowercase: true,
	},
	desc: {
		type: String,
		required: [true, 'Please enter desc'],
		minlength: [4, 'Minimum desc length is 4 characters'],
		maxLength: [100, 'too long'],
	},
	own: {
		type: String,
		required: [true, 'Please user id'],
	},

	token: {
		token: String,
		tokenCreated: Number,
	},

	team: [
		{
			userId: String,
			role: { type: String, default: 'viewer' },
			receiveNotification: { type: Boolean, default: false },
		},
	],

	users: [String],
	dateAdded: Number,

	rules: {
		email: Boolean,
		project: Boolean,
		IoTApp: Boolean,
		story: Boolean,
		team: Boolean,
	},
});

function validateUsername(str: string) {
	if (!str.match(/^[A-Za-z0-9_-]*$/)) {
		return false;
	}

	return true;
}

// AuthAppSchema.methods.getApp = async function(this: AuthAppBaseDocument) {
//   return this;
// };

const AuthAppModel = model<sensorsDocument, sensorsModel>(
	'AuthApp',
	AuthAppSchema,
);

export default AuthAppModel;
