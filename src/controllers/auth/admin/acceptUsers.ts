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

// API for Admin
AuthRouter.post('/acceptuser', VerifyAuthToken, async (req, res) => {
	const { userID } = req.body;
	if (userID) {
		try {
			if (
				req.user &&
				checkRoles(req.user.roles, ['owner', 'developer', 'admin'])
			) {
				const verifiedUser = await User.findByIdAndUpdate(userID, {
					isAccountVerified: true,
					roles: ['member'],
				});
				res.status(200).json({ message: 'success', status: 'success' });
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
AuthRouter.post('/acceptusers', VerifyAuthToken, async (req, res) => {
	// console.log('========== ACC SOME USERS BEGINS ==========');
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
						const verifiedUser = await User.findById(userId);

						// @ts-ignore
						if (verifiedUser?.roleInTechnoNatura.teacher) {
							if (!verifiedUser.roles.includes('teacher')) {
								verifiedUser.roles.push('teacher');
							}
							await verifiedUser.updateOne({
								isAccountVerified: true,
								roles: [...verifiedUser.roles],
								$set: {
									// @ts-ignore
									roleInTechnoNatura: {
										...verifiedUser.roleInTechnoNatura,
										isVerified: true,
									},
								},
							});
							// @ts-ignore
						} else if (verifiedUser?.roleInTechnoNatura.staff) {
							if (!verifiedUser.roles.includes('staff')) {
								verifiedUser.roles.push('staff');
							}
							await verifiedUser.updateOne({
								isAccountVerified: true,
								roles: [...verifiedUser.roles],
								$set: {
									// @ts-ignore
									roleInTechnoNatura: {
										...verifiedUser.roleInTechnoNatura,
										isVerified: true,
									},
								},
							});
						} else if (verifiedUser) {
							await verifiedUser.updateOne({
								isAccountVerified: true,
							});
						}

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
