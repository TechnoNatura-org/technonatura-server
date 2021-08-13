import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';
import { ArduinoDB } from '../../../db/arduinoDB';

const {
	default: { isNumeric },
} = Validator;

export interface sensorDataInterfaceI<A, B> {
	date: number;
	data: A | B;
}

export type sensorDataInterface = sensorDataInterfaceI<number, boolean>;

export interface sensorDataBaseDocument extends sensorDataInterface, Document {}

// Export this for strong typing
export interface sensorDataDocument extends sensorDataBaseDocument {}

// For model
export interface sensorDataModel extends Model<sensorDataBaseDocument> {}

export const sensorDataSchema = new Schema<sensorDataDocument, sensorDataModel>(
	{
		date: {
			type: Number,
			required: true,
			validate: [isNumeric, 'Please enter a valid email'],
			default: Date.now,
		},
		data: {
			type: [Boolean, Number],
			required: [true, 'Please enter the data'],
		},
	},
);

export default ArduinoDB.model<sensorDataDocument, sensorDataModel>(
	'sensorData',
	sensorDataSchema,
);
