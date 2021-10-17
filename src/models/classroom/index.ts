import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import * as bcrypt from 'bcrypt';

import { ClassroomInterface } from './index.d';

import ArduinoApp from '../IoT/arduinoApp.model';

// import { encryptEmail as EncryptEmail } from '../../controllers/auth/hashEmail';

export { ClassroomInterface };

export interface ClassroomBaseDocument extends ClassroomInterface, Document {
	// changePassword(password: string): Promise<string>;
	// deleteAccount(): Promise<void>;
	// getStudents(): Promise<ClassroomI>;
}

// Export this for strong typing
export interface ClassroomDocument extends ClassroomBaseDocument {}

// For model
export interface ClassroomModel extends Model<ClassroomBaseDocument> {
	// login(email: string, password: string): Promise<ClassroomBaseDocument>;
}

const classroomSchema = new Schema<ClassroomDocument, ClassroomModel>({
	title: {
		type: String,
		required: [true, 'Please enter your name'],
		minlength: [4, 'Minimum name length is 4 characters'],
	},
	name: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, 'username cannot be blank'],
		validate: [validateClassroomName, 'Only Letters and Numbers are allowed'],
	},
	desc: {
		type: String,
		required: [true, 'desc cannot be blank'],
	},

	category: {
		type: String,
		default: '',
		enum: ['art', 'science', 'engineering', 'social', 'entrepreneur'],
	},

	thumbnail: {
		type: String,
		default: '',
	},

	grade: {
		type: Number,
		enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	},
	gradePeriod: {
		type: Number,
	},

	from: {
		type: Number,
	},
	to: {
		type: Number,
	},

	active: Boolean,

	isTeam: Boolean,
	branchId: String,
});

function validateClassroomName(str: string) {
	if (!str.match(/^[a-zA-Z0-9._-]*$/)) {
		return false;
	}

	return true;
}

// classroomSchema.methods.changePassword = async function(
// 	this: ClassroomBaseDocument,
// 	password: string,
// ) {
// 	// console.log(this.password);
// 	const salt = await bcrypt.genSalt();
// 	const hashedPassword = await bcrypt.hash(password, salt);
// 	await this.updateOne({ password: hashedPassword });
// 	// console.log(this.password);

// 	return hashedPassword;
// };

// classroomSchema.methods.deleteAccount = async function(this: ClassroomBaseDocument) {
// 	try {
// 		await ArduinoApp.deleteApp(this.id);
// 		await this.delete();
// 	} catch (err) {
// 		throw new Error(String(err));
// 	}
// };

// // fire a function before doc saved to db
// classroomSchema.pre('save', async function(next) {
// 	// console.log('hello');
// 	const salt = await bcrypt.genSalt();
// 	this.password = await bcrypt.hash(this.password, salt);
// 	// this.email = await EncryptEmail(this.email);

// 	next();
// });

// // static method to login user
// classroomSchema.statics.login = async function(
// 	this: Model<ClassroomDocument>,
// 	email,
// 	password,
// ) {
// 	const user = await this.findOne({ email });
// 	if (user) {
// 		const auth = await bcrypt.compare(password, user.password);
// 		if (auth) {
// 			return user;
// 		}
// 		throw new Error('incorrect password');
// 	}
// 	throw new Error('incorrect email');
// };

export default model<ClassroomDocument, ClassroomModel>(
	'Classroom',
	classroomSchema,
);
