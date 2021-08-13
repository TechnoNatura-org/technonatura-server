import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import Sensor, { sensorInterface } from './Sensors/Sensor';
import { ArduinoDB } from '../../db/arduinoDB';

export interface TeammateInterface {
	userId: string;
	role: 'owner' | 'admin' | 'viewer' | 'blocked';
	receiveNotification: boolean;
}

export interface TeammateBaseDocument extends TeammateInterface, Document {
	// getApp(): Promise<string>;
}

// Export this for strong typing
export interface sensorsDocument extends TeammateBaseDocument {}

// For model
export interface sensorsModel extends Model<TeammateBaseDocument> {}

const TeammateSchema = new Schema<sensorsDocument, sensorsModel>({
	receiveNotification: { type: Boolean, default: false },

	role: { type: String, default: 'visitor' },

	userId: {
		type: String,
		required: [true, 'Please user id'],
	},
});

// TeammateSchema.methods.getApp = async function(this: TeammateBaseDocument) {
//   return this;
// };

const TeammateModel = ArduinoDB.model<sensorsDocument, sensorsModel>(
	'Teammate',
	TeammateSchema,
);

export default TeammateModel;
