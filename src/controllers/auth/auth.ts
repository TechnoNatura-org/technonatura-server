import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User, { UserBaseDocument } from '../../models/User/User.model';
import { VerifyAuthToken } from '../../controllers/checkToken';

import createToken, { tokenForTypes } from '../../controllers/createToken';
import { checkRoles } from '../../controllers/checkRoles';
import handleErrors from './handleErrors';

const AuthRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

AuthRouter.post('/checkJWT', async (req, res) => {
	// const token = req.headers.authorizations;
	if (req.body.token) {
		try {
			const verifyToken = await jwt.verify(
				req.body.token,
				process.env.AUTH_SECRET_TOKEN || 'authSecret',
			);

			// @ts-ignore
			if (typeof verifyToken != 'string' && verifyToken.password) {
				// @ts-ignore
				const user = await User.findById(verifyToken._id);

				// @ts-ignore
				if (verifyToken.password != user?.password) {
					res.status(200).json({
						status: 'error',
						message: 'invalid password, password might has changed',
					});
					return;
				} else {
					res.status(200).json({
						message: 'success login',
						status: 'success',
						user: user,
					});
					return;
				}
			}
		} catch (err) {
			console.log(err);
			res.status(200).json({ status: 'error', message: 'invalid token' });
			return;
		}

		// console.log(token.split(' '));
	}

	res.json({ status: 'warning', message: 'token undefined' });
	return;
});

AuthRouter.post('/login', async (req, res) => {
	const { email, password } = req.body;
	// const { token } = req.headers;
	// console.log(req.headers);

	try {
		const user = await User.login(email, password);
		const token = createToken(
			{
				password: user.password,
				_id: user._id,
			},
			tokenForTypes.auth,
		);

		res.status(200).json({
			status: 'success',
			message: 'success',
			token: token,
			user: user,
		});
	} catch (err) {
		console.log('ERR! ', err);

		const errors = await handleErrors(err);
		console.log(errors);
		res.status(200).json({ status: 'error', errors });
	}
});

AuthRouter.post('/signup', async (req, res) => {
	console.log('========== GET INTO SIGN UP =============');
	const {
		email,
		password,
		username,
		fullName,
		roleInTechnoNatura,
		gradeInNumber,
		startPeriod,
		gender,
		birthDate,
	}: {
		email: string;
		password: string;
		username: string;
		fullName: string;
		roleInTechnoNatura: 'student' | 'mentor';
		gender: 'male' | 'female';
		gradeInNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
		startPeriod: number;

		birthDate: string;
	} = req.body;

	// console.log(req.body);

	if (!roleInTechnoNatura || !gradeInNumber) {
		res.status(200).json({
			message: 'Please fill roleInTechnoNatura and grade',
			status: 'error',
		});
		return;
	}

	if (startPeriod < 1980) {
		res.status(200).json({
			message: 'Invalid Start Period',
			status: 'error',
		});
		return;
	} else if (startPeriod > new Date().getFullYear()) {
		res.status(200).json({
			message: 'Invalid Start Period',
			status: 'error',
		});
		return;
	}

	try {
		console.log(birthDate);
		const user = new User({
			email,
			password,
			username,
			fullName,
			gender,
			birthDate,
			roles: ['user'],
		});

		if (roleInTechnoNatura === 'student') {
			user.roleInTechnoNatura = {
				student: true,
				grade: gradeInNumber,
			};
		} else if (roleInTechnoNatura === 'mentor') {
			user.roleInTechnoNatura = {
				teacher: true,
				grade: gradeInNumber,
				active: true,
				isVerified: false,
			};
		}

		await user.save();

		// console.log(user);

		const token = createToken(
			{
				password: user.password,
				_id: user._id,
			},
			tokenForTypes.auth,
		);
		res.status(200).json({
			message: 'success',
			status: 'success',

			token: token,
			user: user,
		});
	} catch (err) {
		// console.log(err);
		const errors = await handleErrors(err, {
			email,
			password,
			username,
			fullName,
		});
		res.status(200).json({ errors });
	}

	console.log('========== PASSED SIGN UP =============');
});

AuthRouter.post('/changePassword', VerifyAuthToken, async (req, res) => {
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

		const errors = await handleErrors(err);
		res.status(200).json({ errors, status: 'error', message: 'error occured' });
	}
});

AuthRouter.post('/deleteAccount', VerifyAuthToken, async (req, res) => {
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

			const errors = await handleErrors(err);
			let message = 'error occured';

			// if (!lodash.isEmpty(errors)) {
			//   message = 'password incorrect';
			// }

			res.status(200).json({ errors, status: 'error', message: message });
			return;
		}
	}
	res.status(200).json({ message: 'password not provided', status: 'warning' });
});

export default AuthRouter;
