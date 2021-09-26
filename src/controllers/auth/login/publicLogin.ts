import * as express from 'express';

import User, { UserBaseDocument } from '../../../models/User/User.model';
import { VerifyAuthToken } from '../../checkToken';

import createToken, { tokenForTypes } from '../../createToken';
import handleErrors from '../handleErrors';

import sendRegisterLoginInfo from '../sendEmail/registerLogin';
import LoginFunction from './loginFunction';

const PublicLoginAuthRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

PublicLoginAuthRouter.post(
	'/',

	async (req, res) => {
		const token = req.headers.authorization;
		// console.log(token);
		// console.log(process.env.AUTH_BEARER_TOKEN);
		if (
			token &&
			token.startsWith('Bearer') &&
			token.split(' ')[1] === process.env.AUTH_BEARER_TOKEN
		) {
			const { email, password, system, platform, date } = req.body;
			// const { token } = req.headers;
			// console.log(req.headers);

			return LoginFunction(email, password, system, date, res);
		}

		// console.log('forbidden!');
		res.json({ message: 'forbidden', status: 'error' });
		return;
	},
);

export default PublicLoginAuthRouter;
