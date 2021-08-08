if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

import * as express from 'express';
import User, { UserBaseDocument } from '../../../models/User/User.model';
import { VerifyAuthToken } from '../../checkToken';

import { checkRoles } from '../../checkRoles';

const AuthRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

AuthRouter.post('/deleteuser', VerifyAuthToken, async (req, res) => {
	const { userID } = req.body;
	if (userID) {
		try {
			if (
				req.user &&
				checkRoles(req.user.roles, ['Owner', 'Developer', 'Admin'])
			) {
				const unverifiedusers = await User.findByIdAndDelete(userID);
				res.status(200).json({ message: 'User Deleted', status: 'success' });
			} else {
				res
					.status(200)
					.json({ message: 'access denied for this user', status: 'error' });
			}
		} catch (err) {
			// console.log("err when fetching unverified users", err)
			res.status(200).json({ message: 'error in server', status: 'error' });
		}
	} else {
		res.status(200).json({ message: 'userID not provided', status: 'warning' });
	}
});

// API for Admin
AuthRouter.post('/deleteusers', VerifyAuthToken, async (req, res) => {
	// console.log('========== DELETE SOME USERS BEGINS ==========');
	const { usersId }: { usersId: Array<string> } = req.body;
	if (usersId) {
		if (
			req.user &&
			checkRoles(req.user.roles, ['owner', 'developer', 'admin', 'teacher'])
		) {
			if (Array.isArray(usersId)) {
				for (const userId of usersId) {
					try {
						// console.log(usersId, userId, 'userId');
						const deletedUser = await User.findByIdAndDelete(userId);
						// console.log(verifiedUser);
					} catch (err) {
						// console.log("err when fetching unverified users", err)
						res
							.status(200)
							.json({ message: 'error in server', status: 'error' });
						return;
						break;
					}
				}

				res.status(200).json({ message: 'success', status: 'success' });
				return;
			}

			res
				.status(200)
				.json({ message: 'please provide usersId in Array', status: 'error' });
			return;
		} else {
			res
				.status(200)
				.json({ message: 'access denied for this user', status: 'error' });
			return;
		}
	} else {
		res.status(200).json({ message: 'users not provided', status: 'warning' });

		return;
	}
});

export default AuthRouter;
