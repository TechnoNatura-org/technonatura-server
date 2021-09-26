import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import * as cors from 'cors';

import { corsOptions } from '../../controllers/cors';

import User, { UserBaseDocument } from '../../models/User/User.model';
import { VerifyAuthToken } from '../../controllers/checkToken';

import createToken, { tokenForTypes } from '../../controllers/createToken';
import handleErrors from './handleErrors';

import sendRegisterLoginInfo from './sendEmail/registerLogin';
import AuthLogin from './login/login';
import PublicLogin from './login/publicLogin';

import CheckJWT from './checkJWT';
import AuthSignup from './signup';

const AuthRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

AuthRouter.use('/checkJWT', cors(corsOptions), CheckJWT);

AuthRouter.use('/login', cors(corsOptions), AuthLogin);
AuthRouter.use(
	'/publicLogin',
	function(req, res, next) {
		// res.header(
		// 	'Access-Control-Allow-Headers',
		// 	'X-Requested-With, Content-Type, Authorization',
		// );

		// Request headers you wish to allow

		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', '*');

		// Request methods you wish to allow
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, OPTIONS, PUT, PATCH, DELETE',
		);

		// Request headers you wish to allow
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization',
		);

		// // Set to true if you need the website to include cookies in the requests sent
		// // to the API (e.g. in case you use sessions)
		// res.setHeader(
		// 	'Access-Control-Allow-Credentials',
		// 	true,
		// );

		next();
	},
	PublicLogin,
);

AuthRouter.use('/signup', cors(corsOptions), AuthSignup);

AuthRouter.post(
	'/changePassword',
	cors(corsOptions),
	VerifyAuthToken,
	async (req, res) => {
		const { newPassword, currentPassword } = req.body;
		// const { token } = req.headers;
		// console.log(req.headers);

		try {
			// @ts-ignore
			const user = await User.login(req.user.username, currentPassword); // try to login using the given password

			if (user) {
				try {
					//
					const hashedPassword = await user.changePassword(newPassword); // changePassword returns new hashed password

					const token = createToken(
						{
							username: user.username,
							password: hashedPassword,
							_id: user._id,
							email: user.email,
						},
						tokenForTypes.auth,
					);

					res.status(200).json({
						message: 'password changed',
						status: 'success',
						token: token,
					});
					return;
				} catch (err) {
					res.status(200).json({
						message:
							'error when change user password, please checkout our status API',
						status: 'error',
					});
					return;
				}
			}

			res.status(200).json({
				message: 'user not found',
				status: 'error',
			});
			return;
		} catch (err) {
			console.log('ERR! ', err);

			const errors = await handleErrors(Object(err));
			res.status(200).json({
				errors,
				status: 'error',
				message: 'error occured',
			});
		}
	},
);

AuthRouter.post(
	'/deleteAccount',
	cors(corsOptions),
	VerifyAuthToken,
	async (req, res) => {
		const { currentPasswordDeleteAccount } = req.body;
		if (currentPasswordDeleteAccount && req.user) {
			try {
				try {
					await req.user.deleteAccount();
					res.status(200).json({
						message: 'account deleted!',
						status: 'success',
					});
				} catch (err) {
					// console.log("err when fetching unverified users", err)
					res.status(200).json({
						message: 'error when deleting account',
						status: 'error',
						errorMessage: JSON.stringify(err),
					});
					return;
				}
			} catch (err) {
				console.log('ERR! ', err);

				const errors = await handleErrors(Object(err));
				let message = 'error occured';

				// if (!lodash.isEmpty(errors)) {
				//   message = 'password incorrect';
				// }

				res.status(200).json({ errors, status: 'error', message: message });
				return;
			}
		}
		res
			.status(200)
			.json({ message: 'password not provided', status: 'warning' });
	},
);

export default AuthRouter;
