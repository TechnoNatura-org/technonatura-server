import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import User, { UserBaseDocument } from '../../models/User/User.model';

const CheckJWTRouter = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

CheckJWTRouter.post('/', async (req, res) => {
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
export default CheckJWTRouter;
