import * as express from 'express';
import User, { UserBaseDocument } from '../../../models/User/User.model';

import createToken, { tokenForTypes } from '../../../controllers/createToken';
import handleErrors from '../handleErrors';

import sendRegisterLoginInfo from '../sendEmail/registerLogin';

export default async function LoginFunction(
	email: string,
	password: string,
	system: string,
	date: string,
	res: express.Response,
) {
	try {
		const user = await User.login(email, password);
		const token = createToken(
			{
				password: user.password,
				_id: user._id,
			},
			tokenForTypes.auth,
		);

		sendRegisterLoginInfo(true, user.email, user.username, system, date);

		res.status(200).json({
			status: 'success',
			message: 'success',
			token: token,
			user: user,
		});
		return;
	} catch (err) {
		console.log('ERR! ', err);
		const errors = await handleErrors(Object(err));
		console.log(errors);
		res.status(200).json({ status: 'error', errors });
		return;
	}
}
