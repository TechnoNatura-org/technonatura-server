import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
import * as Validator from 'validator';
import * as bcrypt from 'bcrypt';

import { UserInterface, SocialMedia } from './index';

import ArduinoApp from '../../models/Arduino/arduinoApp.model';

import { encryptEmail as EncryptEmail } from '../../controllers/auth/hashEmail';

const {
	default: { isEmail, isURL },
} = Validator;

export { UserInterface, SocialMedia };

export interface UserBaseDocument extends UserInterface, Document {
	roles: Types.Array<string>;
	badges: Types.Array<string>;
	hobbies: Types.Array<string>;

	socialMedias: Types.Array<SocialMedia>;
	follows: Types.Array<string>;
	followers: Types.Array<string>;

	changePassword(password: string): Promise<string>;
	deleteAccount(): Promise<void>;
}

// Export this for strong typing
export interface UserDocument extends UserBaseDocument {}

// For model
export interface UserModel extends Model<UserBaseDocument> {
	login(email: string, password: string): Promise<UserBaseDocument>;
}

const userSchema = new Schema<UserDocument, UserModel>({
	fullName: {
		type: String,
		required: [true, 'Please enter your name'],
		minlength: [4, 'Minimum name length is 4 characters'],
	},
	username: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, 'username cannot be blank'],
		validate: [validateUsername, 'Only Letters and Numbers are allowed'],
	},

	email: {
		type: String,
		required: [true, 'Please enter an email'],
		lowercase: true,
		unique: true,
		validate: [isEmail, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		minlength: [6, 'Minimum password length is 6 characters'],
	},

	isAccountVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
	active: {
		type: Boolean,
		required: true,
		default: false,
	},

	status: new Schema({
		emoji: {
			type: String,
			default: '',
		},
		text: {
			type: String,
			default: '',
		},
	}),

	bio: {
		type: String,
		default: '',
	},

	avatar: {
		type: String,
		default: '',
	},
	banner: {
		type: String,
		default: '',
	},

	points: {
		type: Number,
		require: true,
		default: 0,
	},

	accountCreated: {
		type: Date,
		default: Date.now,
	},

	follows: [String],
	followers: [String],

	birthDate: {
		type: Number,
		required: [true, 'Please enter your birthDate'],
	},

	roles: [String], // the role name, the role name must be unique

	socialMedias: [
		{
			name: {
				type: String,
				enum: [
					'github',
					'gitlab',
					'instagram',
					'facebook',
					'website',
					'youtube',
					'discord',
					'twitch',
					'twitter',
				],
				required: [true, 'Please enter social media'],
			},
			url: {
				type: String,
				required: [true, 'Please enter social media'],
				validate: [isURL, 'Please enter a valid url'],
			},
		},
	],

	roleInTechnoNatura: {
		type: Object,
		enum: [
			{
				teacher: Boolean,
				grade: Number,
				isVerified: Boolean,
			},
			{
				staff: Boolean,
				role: String,
				isVerified: Boolean,
			},
			{
				student: Boolean,
				grade: Number,
				startPeriod: Number,
			},
			{
				alumni: Boolean,
				grades: [
					{
						grade: {
							type: String,
							enum: ['mi', 'mts', 'ma'],
						},
						startPeriod: Number,
					},
				],
			},
		],
	},
	alumni: [{ grade: String, startPeriod: Number, finishPeriod: Number }],

	badges: [String],

	hobbies: [String],
	dream: String,

	gender: {
		type: String,
		enum: ['male', 'female'],
	},
});

function validateUsername(str: string) {
	if (!str.match(/^[a-zA-Z0-9]+$/)) {
		return false;
	}

	return true;
}

userSchema.methods.changePassword = async function(
	this: UserBaseDocument,
	password: string,
) {
	// console.log(this.password);
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);
	await this.updateOne({ password: hashedPassword });
	// console.log(this.password);

	return hashedPassword;
};

userSchema.methods.deleteAccount = async function(this: UserBaseDocument) {
	try {
		await ArduinoApp.deleteApp(this.id);
		await this.delete();
	} catch (err) {
		throw new Error(err);
	}
};

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
	// console.log('hello');
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	// this.email = await EncryptEmail(this.email);

	next();
});

// static method to login user
userSchema.statics.login = async function(
	this: Model<UserDocument>,
	email,
	password,
) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw new Error('incorrect password');
	}
	throw new Error('incorrect email');
};

export default model<UserDocument, UserModel>('User', userSchema);
