import * as express from 'express';

import User, { UserBaseDocument } from '../../../models/User/User.model';
import { VerifyAuthToken } from '../../../controllers/checkToken';

import createToken, { tokenForTypes } from '../../../controllers/createToken';
import handleErrors from './../handleErrors';

import sendRegisterLoginInfo from '../sendEmail/registerLogin';
import LoginFunction from './loginFunction';

const LoginAuthRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

LoginAuthRouter.post(
	'/',

	async (req, res) => {
		const { email, password, system, platform, date } = req.body;
		// const { token } = req.headers;
		// console.log(req.headers);

		return LoginFunction(email, password, system, date, res);
	},
);

export default LoginAuthRouter;
