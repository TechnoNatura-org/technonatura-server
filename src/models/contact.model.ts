import { Schema, Model, Document, model, Types, Query } from 'mongoose';
import * as Validator from 'validator';

const {
	default: { isEmail, isURL },
} = Validator;

export interface contactInterface {
	email: string;
	name: string;
	message: string;
	type: 'project' | 'dashboard' | 'cloud' | 'general';
}

export interface ContactBaseDocument extends contactInterface, Document {}

// Export this for strong typing
export interface ContactDocument extends ContactBaseDocument {}

// For model
export interface contactModel extends Model<ContactBaseDocument> {}

const contactSchema = new Schema<ContactDocument, contactModel>({
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		unique: false,
		validate: [isEmail, 'Please enter a valid email'],
	},
	name: {
		type: String,
		required: [true, 'Please enter your name'],
		validate: [validateUsername, 'Only characters and numbers are allowed'],
		minlength: [4, 'Minimum name length is 4 characters'],
	},
	message: {
		type: String,
		required: [true, 'Message Cannot Blank'],
		minlength: [10, 'Too short'],
	},
	type: {
		type: String,
		enum: ['project', 'dashboard', 'cloud', 'general'],
		default: 'general',
	},
});

function validateUsername(str: string) {
	if (!str.match(/^[a-zA-Z0-9]+$/)) {
		return false;
	}

	return true;
}

export default model<ContactDocument, contactModel>('Contact', contactSchema);
