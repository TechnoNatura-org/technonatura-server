import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import * as bcrypt from 'bcrypt';

import { ProjectPostInterface } from './index.d';

import ArduinoApp from '../IoT/arduinoApp.model';

// import { encryptEmail as EncryptEmail } from '../../controllers/auth/hashEmail';

export { ProjectPostInterface };

export interface ProjectBaseDocument extends ProjectPostInterface, Document {
	// changePassword(password: string): Promise<string>;
	// deleteAccount(): Promise<void>;
	// getStudents(): Promise<ProjectI>;
}

// Export this for strong typing
export interface ProjectDocument extends ProjectBaseDocument {}

// For model
export interface ProjectModel extends Model<ProjectBaseDocument> {
	// login(email: string, password: string): Promise<ProjectBaseDocument>;
}

const userSchema = new Schema<ProjectDocument, ProjectModel>({
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
		validate: [validateProjectname, 'Only Letters and Numbers are allowed'],
	},

	owner: {
		type: String,
		default: '',
	},

	content: {
		type: String,
		default: '',
	},
	category: {
		type: String,
		default: '',
	},
	tags: [String], // the role name, the role name must be unique

	thumbnail: {
		type: String,
		default: '',
	},
	assets: [String], // the role name, the role name must be unique

	classroomId: {
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

	isTeam: Boolean,
	teamId: Number,
});

function validateProjectname(str: string) {
	if (!str.match(/^[a-zA-Z0-9]+$/)) {
		return false;
	}

	return true;
}

// userSchema.methods.changePassword = async function(
// 	this: ProjectBaseDocument,
// 	password: string,
// ) {
// 	// console.log(this.password);
// 	const salt = await bcrypt.genSalt();
// 	const hashedPassword = await bcrypt.hash(password, salt);
// 	await this.updateOne({ password: hashedPassword });
// 	// console.log(this.password);

// 	return hashedPassword;
// };

// userSchema.methods.deleteAccount = async function(this: ProjectBaseDocument) {
// 	try {
// 		await ArduinoApp.deleteApp(this.id);
// 		await this.delete();
// 	} catch (err) {
// 		throw new Error(String(err));
// 	}
// };

// // fire a function before doc saved to db
// userSchema.pre('save', async function(next) {
// 	// console.log('hello');
// 	const salt = await bcrypt.genSalt();
// 	this.password = await bcrypt.hash(this.password, salt);
// 	// this.email = await EncryptEmail(this.email);

// 	next();
// });

// // static method to login user
// userSchema.statics.login = async function(
// 	this: Model<ProjectDocument>,
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

export default model<ProjectDocument, ProjectModel>('Project', userSchema);
