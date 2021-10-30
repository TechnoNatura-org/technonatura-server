import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';

import { ProjectPostInterface } from './index.d';

import ArduinoApp from '../IoT/arduinoApp.model';

// import { encryptEmail as EncryptEmail } from '../../controllers/auth/hashEmail';

export { ProjectPostInterface };

export interface ProjectBaseDocument extends ProjectPostInterface, Document {
	// changePassword(password: string): Promise<string>;
	// deleteAccount(): Promise<void>;
	// getStudents(): Promise<ProjectI>;
	assets: Types.Array<{ url: string; desc: string }>;

	stars: Types.Array<string>;
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
		required: [true, 'name cannot be blank'],
		validate: [validateProjectname, 'Only Letters and Numbers are allowed'],
	},

	owner: {
		type: String,
		default: '',
	},
	desc: {
		type: String,
		default: '',
	},
	branch: {
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
	assets: [
		{
			url: String,
			desc: String,
		},
	], // the role name, the role name must be unique
	stars: [String], // the role name, the role name must be unique

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
	teamId: String,

	created: {
		type: Date,
		default: Date.now,
	},

	// draft: Boolean,
});

function validateProjectname(str: string) {
	if (!str.match(/^[a-zA-Z0-9._-]*$/)) {
		return false;
	}

	return true;
}

export default model<ProjectDocument, ProjectModel>('Project', userSchema);
