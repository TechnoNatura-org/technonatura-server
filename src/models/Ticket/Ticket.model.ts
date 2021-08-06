// import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';
// import * as Validator from 'validator';
// import * as bcrypt from 'bcrypt';

// import { TicketInterface } from './index';
// import ArduinoApp from '../Arduino/arduinoApp.model';

// const {
// 	default: { isEmail, isURL },
// } = Validator;

// export { TicketInterface, };

// export interface TicketBaseDocument extends TicketInterface, Document {

// 	changePassword(password: string): Promise<string>;
// 	deleteAccount(): Promise<void>;
// }

// // Export this for strong typing
// export interface TicketDocument extends TicketBaseDocument {}

// // For model
// export interface TicketModel extends Model<TicketBaseDocument> {
// 	login(username: string, password: string): Promise<TicketBaseDocument>;
// }

// const userSchema = new Schema<TicketDocument, TicketModel>({
// 	fullName: {
// 		type: String,
// 		required: [true, 'Please enter your name'],
// 		minlength: [4, 'Minimum name length is 4 characters'],
// 	},
// 	username: {
// 		type: String,
// 		lowercase: true,
// 		unique: true,
// 		required: [true, 'username cannot be blank'],
// 		validate: [validateTicketname, 'Only Letters and Numbers are allowed'],
// 	},

// 	email: {
// 		type: String,
// 		required: [true, 'Please enter an email'],
// 		lowercase: true,
// 		unique: true,
// 		validate: [isEmail, 'Please enter a valid email'],
// 	},
// 	password: {
// 		type: String,
// 		required: [true, 'Please enter a password'],
// 		minlength: [6, 'Minimum password length is 6 characters'],
// 	},

// 	isAccountVerified: {
// 		type: Boolean,
// 		required: true,
// 		default: false,
// 	},
// 	active: {
// 		type: Boolean,
// 		required: true,
// 		default: false,
// 	},

// 	status: new Schema({
// 		emoji: {
// 			type: String,
// 			default: '',
// 		},
// 		text: {
// 			type: String,
// 			default: '',
// 		},
// 	}),

// 	bio: {
// 		type: String,
// 		default: '',
// 	},

// 	avatar: {
// 		type: String,
// 		default: '',
// 	},
// 	banner: {
// 		type: String,
// 		default: '',
// 	},

// 	points: {
// 		type: Number,
// 		require: true,
// 		default: 0,
// 	},

// 	accountCreated: {
// 		type: Date,
// 		default: Date.now,
// 	},

// 	follows: [String],
// 	followers: [String],

// 	birthDate: {
// 		type: Date,
// 	},

// 	roles: [String], // the role name, the role name must be unique

// 	socialMedias: [
// 		{
// 			name: {
// 				type: String,
// 				enum: [
// 					'github',
// 					'gitlab',
// 					'instagram',
// 					'facebook',
// 					'website',
// 					'youtube',
// 					'discord',
// 					'twitch',
// 					'twitter',
// 				],
// 				required: [true, 'Please enter social media'],
// 			},
// 			url: {
// 				type: String,
// 				required: [true, 'Please enter social media'],
// 				validate: [isURL, 'Please enter a valid url'],
// 			},
// 		},
// 	],

// 	roleInTechnoNatura: {
// 		type: Object,
// 		enum: [
// 			{
// 				teacher: Boolean,
// 				grade: Number,
// 				startPeriod: Number,
// 				finishPeriod: Number,
// 			},
// 			{
// 				student: Boolean,
// 				grade: Number,
// 				startPeriod: Number,
// 				finishPeriod: Number,
// 			},
// 			{
// 				alumni: Boolean,
// 				grades: [{ grade: String, startPeriod: Number, finishPeriod: Number }],
// 			},
// 		],
// 	},
// 	alumni: {
// 		alumni: Boolean,
// 		grades: [{ grade: String, startPeriod: Number, finishPeriod: Number }],
// 	},

// 	badges: [String],
// 	hobbies: [String],
// 	dream: String,
// });

// function validateTicketname(str: string) {
// 	if (!str.match(/^[a-zA-Z0-9]+$/)) {
// 		return false;
// 	}

// 	return true;
// }

// userSchema.methods.changePassword = async function(
// 	this: TicketBaseDocument,
// 	password: string,
// ) {
// 	// console.log(this.password);
// 	const salt = await bcrypt.genSalt();
// 	const hashedPassword = await bcrypt.hash(password, salt);
// 	await this.updateOne({ password: hashedPassword });
// 	// console.log(this.password);

// 	return hashedPassword;
// };

// userSchema.methods.deleteAccount = async function(this: TicketBaseDocument) {
// 	try {
// 		await ArduinoApp.deleteApp(this.id);
// 		await this.delete();
// 	} catch (err) {
// 		throw new Error(err);
// 	}
// };

// // fire a function before doc saved to db
// userSchema.pre('save', async function(next) {
// 	// console.log('hello');
// 	const salt = await bcrypt.genSalt();
// 	this.password = await bcrypt.hash(this.password, salt);

// 	// if (!this.email.match(/^[a-zA-Z0-9]+$/)) {

// 	// }
// 	next();
// });

// // static method to login user
// userSchema.statics.login = async function(
// 	this: Model<TicketDocument>,
// 	username,
// 	password,
// ) {
// 	const user = await this.findOne({ username: username });
// 	if (user) {
// 		const auth = await bcrypt.compare(password, user.password);
// 		if (auth) {
// 			return user;
// 		}
// 		throw new Error('incorrect password');
// 	}
// 	throw new Error('incorrect username');
// };

// export default model<TicketDocument, TicketModel>('Ticket', userSchema);
