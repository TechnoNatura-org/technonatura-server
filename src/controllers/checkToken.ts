import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User, {
	UserBaseDocument,
	UserInterface,
} from '../models/User/User.model';

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
	}
}

interface UserInRequest extends Request {
	user?: UserBaseDocument | null;
}

const VerifyAuthToken = async (
	req: UserInRequest,
	res: Response,
	next: NextFunction,
) => {
	//@ts-ignore
	if (req.body.authToken) {
		try {
			// convert jwt
			const verifyToken = await jwt.verify(
				req.body.authToken,
				process.env.AUTH_SECRET_TOKEN || 'authSecret',
			);

			// @ts-ignore
			if (typeof verifyToken != 'string' && verifyToken.password) {
				// @ts-ignore
				const user = await User.findById(verifyToken._id);

				if (user) {
					// verify token
					// @ts-ignore
					if (verifyToken.password != user?.password) {
						// console.log('pass');

						res.status(200).send({
							message: 'password has changed',
						});
						return;
					} else {
						// console.log('neSTx');
						// @ts-ignore
						req.id = user._id;
						req.user = user;

						return next();
					}
				} else {
					res.status(200).send({ message: 'user not found!' });
					return;
				}
			}
		} catch (err) {
			// console.log('ero');

			res.status(200).send({ message: 'error occured' });
			return;
		}

		// console.log(token.split(' '));
	}

	res.status(200).send({ message: 'token undefined' });
	return;
};
export { VerifyAuthToken };
