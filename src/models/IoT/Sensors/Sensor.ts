import { Schema, Model, Document, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { sensorDataSchema, sensorDataInterfaceI } from './SensorsData.model';
import { ArduinoDB } from '../../../db/arduinoDB';

const {
	default: { isEmail, isURL },
} = Validator;

export interface sensorInterfaceI<A> {
	name: string;
	desc: string;

	appId: string;
	userId: string;

	datas?: Array<sensorDataInterfaceI<A>>;
	realtimeData: {
		data: A;
		dateAdded: number;
	};
	dataType: 'number' | 'boolean';
}

export type sensorInterface = sensorInterfaceI<number | boolean>;

export interface sensorBaseDocument extends sensorInterface, Document {
	datas: Types.Array<sensorDataInterfaceI<number | boolean>>;
}

// Export this for strong typing
export interface sensorDocument extends sensorBaseDocument {}
// For model
export interface sensorModel extends Model<sensorBaseDocument> {}

const sensorSchema = new Schema<sensorDocument, sensorModel>({
	name: {
		type: String,
		required: [true, 'Please enter your name'],
		validate: [validateUsername, 'Only characters and numbers are allowed'],
		minlength: [4, 'Minimum name length is 4 characters'],
	},
	desc: {
		type: String,
		required: [true, 'The sensor desc please'],
		minlength: [4, 'Minimum name length is 4 characters'],
	},
	appId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},

	datas: [sensorDataSchema],
	realtimeData: {
		data: Number,
		dateAdded: Number,
	},

	dataType: {
		type: String,
		enum: ['number', 'boolean'],

		required: [true, 'Please enter the data type'],
	},
});

function validateUsername(str: string) {
	if (!str.match(/^[A-Za-z0-9_-]*$/)) {
		return false;
	}

	return true;
}

export default ArduinoDB.model<sensorDocument, sensorModel>(
	'sensor',
	sensorSchema,
);
