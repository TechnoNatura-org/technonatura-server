import { Schema, Model, Document, model, Types, Query, Error } from 'mongoose';

import { TechnonaturaBranchI } from './index';

export { TechnonaturaBranchI };

export interface TechnonaturaBranchBaseDocument
	extends TechnonaturaBranchI,
		Document {}

// Export this for strong typing
export interface TechnonaturaBranchDocument
	extends TechnonaturaBranchBaseDocument {}

// For model
export interface TechnonaturaBranchModel
	extends Model<TechnonaturaBranchBaseDocument> {}

const userSchema = new Schema<
	TechnonaturaBranchDocument,
	TechnonaturaBranchModel
>({
	title: {
		type: String,
		required: [true, 'Please enter your name'],
		minlength: [4, 'Minimum name length is 4 characters'],
	},
	active: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, 'username cannot be blank'],
		validate: [
			validateTechnonaturaBranchname,
			'Only Letters and Numbers are allowed',
		],
	},
});

function validateTechnonaturaBranchname(str: string) {
	if (!str.match(/^[A-Za-z0-9_-]*$/)) {
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

export default model<TechnonaturaBranchDocument, TechnonaturaBranchModel>(
	'TechnoNaturaBranch',
	userSchema,
);
