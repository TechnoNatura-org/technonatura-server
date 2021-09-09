import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';

import { TeacherStaffI } from './index';

import ArduinoApp from '../IoT/arduinoApp.model';

import { encryptEmail as EncryptEmail } from '../../controllers/auth/hashEmail';

export { TeacherStaffI };

export interface TeacherStaffBaseDocument extends TeacherStaffI, Document {}

// Export this for strong typing
export interface TeacherStaffDocument extends TeacherStaffBaseDocument {}

// For model
export interface TeacherStaffModel extends Model<TeacherStaffBaseDocument> {}

const userSchema = new Schema<TeacherStaffDocument, TeacherStaffModel>({
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
		validate: [
			validateTeacherStaffname,
			'Only Letters and Numbers are allowed',
		],
	},

	role: {
		type: String,
		required: [true, 'Please enter a password'],
		minlength: [6, 'Minimum password length is 6 characters'],
	},
	description: {
		type: String,
		required: [true, 'Please enter a password'],
		minlength: [6, 'Minimum password length is 6 characters'],
	},
});

function validateTeacherStaffname(str: string) {
	if (!str.match(/^[a-zA-Z0-9]+$/)) {
		return false;
	}

	return true;
}

// fire a function before doc saved to db
// userSchema.pre('save', async function(next) {
// 	// console.log('hello');
// 	const salt = await bcrypt.genSalt();
// 	this.password = await bcrypt.hash(this.password, salt);
// 	// this.email = await EncryptEmail(this.email);

// 	next();
// });

export default model<TeacherStaffDocument, TeacherStaffModel>(
	'TeacherStaff',
	userSchema,
);
