import * as express from 'express';

import User, { UserBaseDocument } from '../../models/User/User.model';

import createToken, { tokenForTypes } from '../../controllers/createToken';
import handleErrors from './handleErrors';

import sendRegisterLoginInfo from './sendEmail/registerLogin';

const SignupAuthRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}
SignupAuthRouter.post('/', async (req, res) => {
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
		staffRole,
		branch,
		system,
		platform,
		date,
	}: {
		email: string;
		password: string;
		username: string;
		fullName: string;
		roleInTechnoNatura: 'student' | 'mentor' | 'staff';
		gender: 'male' | 'female';
		gradeInNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
		startPeriod?: number;

		staffRole: string;

		birthDate: string;
		branch: string;
		system: string;
		platform: { description: string; name: string; os: { family: string } };
		date: string;
	} = req.body;

	// console.log(req.body);

	if (!roleInTechnoNatura || !gradeInNumber) {
		res.status(200).json({
			message: 'Please fill roleInTechnoNatura and grade',
			status: 'error',
		});
		return;
	}

	// @ts-ignore
	if (startPeriod < 1980) {
		res.status(200).json({
			message: 'Invalid Start Period',
			status: 'error',
		});
		return;
		// @ts-ignore
	} else if (startPeriod > new Date().getFullYear()) {
		res.status(200).json({
			message: 'Invalid Start Period',
			status: 'error',
		});
		return;
	}

	try {
		// console.log(birthDate);
		const user = new User({
			email,
			password,
			username: username.toLowerCase(),
			fullName,
			gender,
			birthDate,
			roles: ['user'],
		});

		if (roleInTechnoNatura === 'student') {
			user.roleInTechnoNatura = {
				student: true,
				grade: gradeInNumber,

				// @ts-ignore
				startPeriod,
				branch,
			};
		} else if (roleInTechnoNatura === 'mentor') {
			user.roleInTechnoNatura = {
				teacher: true,
				grade: gradeInNumber,
				isVerified: false,
				branch,
			};
		} else if (roleInTechnoNatura === 'staff') {
			user.roleInTechnoNatura = {
				staff: true,
				role: staffRole,
				isVerified: false,
				branch,
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
		sendRegisterLoginInfo(true, user.email, user.username, system, date);
		res.status(200).json({
			message: 'success',
			status: 'success',

			token: token,
			user: user,
		});
	} catch (err) {
		// console.log(err);
		const errors = await handleErrors(Object(err), {
			email,
			password,
			username,
			fullName,
		});
		res.status(200).json({ errors });
	}

	console.log('========== PASSED SIGN UP =============');
});

export default SignupAuthRouter;
