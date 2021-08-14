import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import Sensor, { sensorInterface } from './Sensors/Sensor';
import { ArduinoDB } from '../../db/arduinoDB';

export interface TeammateInterface {
	name: string;
	desc: string;
	sensors: Types.Array<string>;
}

export interface TeammateBaseDocument extends TeammateInterface, Document {
	// getApp(): Promise<string>;
	sensors: Types.Array<string>;
}

// Export this for strong typing
export interface sensorsDocument extends TeammateBaseDocument {}

// For model
export interface sensorsModel extends Model<TeammateBaseDocument> {}

const TeammateSchema = new Schema<sensorsDocument, sensorsModel>({
	receiveNotification: { type: Boolean, default: false },

	name: { type: String },
	desc: { type: String },

	sensors: {
		type: [String],
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
