if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

import * as express from 'express';
import User, { UserBaseDocument } from '../models/User/User.model';
import Role from '../models/Role.model';
import { VerifyAuthToken } from '../controllers/checkToken';

import createToken, { tokenForTypes } from '../controllers/createToken';
import { checkRoles } from '../controllers/checkRoles';

import handleErrors from '../controllers/auth/handleErrors';
import AuthMainController from '../controllers/auth/auth';
import AcceptUsersController from '../controllers/auth/admin/acceptUsers';
import DeleteUsersController from '../controllers/auth/admin/deleteUsers';

const AuthRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

// end of API for Admin
AuthRouter.use('/', AuthMainController);

AuthRouter.get('/unverifyusers', async (req, res) => {
	try {
		const unverifiedusers = await User.find({ isAccountVerified: false });
		res.status(200).json({
			message: 'success',
			unverified_users: unverifiedusers,
			status: 'sucess',
		});
	} catch (err) {
		console.log(err);
		// console.log("err when fetching unverified users", err)
		res.status(200).json({ message: 'error in server', status: 'error' });
	}
});

AuthRouter.use('/', AcceptUsersController);

AuthRouter.use('/', DeleteUsersController);

AuthRouter.post('/new/role', VerifyAuthToken, async (req, res) => {
	const { rolename } = req.body;
	// const { token } = req.headers;
	// console.log(req.headers);

	try {
		if (
			req.user &&
			checkRoles(req.user.roles, ['Owner', 'Developer', 'Admin'])
		) {
			const role = new Role({
				name: rolename,
			});
			await role.save();
			res.status(200).json({ message: 'success' });
		} else {
			res.status(200).json({ message: 'access denied for this user' });
			return;
		}
	} catch (err) {
		console.log('ERR! ', err);

		const errors = await handleErrors(Object(err));
		console.log(errors);
		res.status(200).json({ errors });
	}
});

export default AuthRouter;
