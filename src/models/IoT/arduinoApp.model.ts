import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import Sensor, { sensorInterface } from './Sensors/Sensor';
import { ArduinoDB } from '../../db/arduinoDB';

export interface arduinoAppInterface {
	name: string;
	desc: string;

	own: string;

	token: {
		token: string;
		tokenCreated: number;
	};

	sensors: Array<string>;

	team: Array<{
		userId: string;
		role: 'owner' | 'admin' | 'viewer' | 'blocked';
		receiveNotification: boolean;
	}>;

	visibility: 'public' | 'private';
}

export interface arduinoAppBaseDocument extends arduinoAppInterface, Document {
	data: Types.Array<string>;
	// getApp(): Promise<string>;
}

// Export this for strong typing
export interface sensorsDocument extends arduinoAppBaseDocument {}

// For model
export interface sensorsModel extends Model<arduinoAppBaseDocument> {
	deleteApp(userId: string): Promise<void | Error> | void;
	getAllSensors(appID: string): Promise<sensorInterface[] | undefined>;
}

const ArduinoAppSchema = new Schema<sensorsDocument, sensorsModel>({
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
			role: { type: String, default: 'visitor' },
			receiveNotification: { type: Boolean, default: false },
		},
	],

	visibility: {
		type: String,
		enum: ['public', 'private'],
	},
});

function validateUsername(str: string) {
	if (!str.match(/^[A-Za-z0-9_-]*$/)) {
		return false;
	}

	return true;
}

// ArduinoAppSchema.methods.getApp = async function(this: arduinoAppBaseDocument) {
//   return this;
// };

const ArduinoAppModel = ArduinoDB.model<sensorsDocument, sensorsModel>(
	'ArduinoApp',
	ArduinoAppSchema,
);
ArduinoAppModel.getAllSensors = async function(
	appId: string,
): Promise<sensorInterface[] | undefined> {
	const sensors = await Sensor.find({ appId: appId });

	return sensors;
};
ArduinoAppModel.deleteApp = async function(userId: string) {
	try {
		await ArduinoAppModel.find({ own: userId }).deleteMany();
		await Sensor.find({ own: userId }).deleteMany();
	} catch (err) {
		throw new Error('There was en error');
	}
};
export default ArduinoAppModel;
