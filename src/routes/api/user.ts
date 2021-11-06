import * as express from 'express';

import User from '../../models/User/User.model';
import { UserInterface } from '../../models/User/index';

const UserPublicAPI_Router = express.Router();

UserPublicAPI_Router.get('/:username', async (req, res) => {
	// const App = await AppDoc?.getApp();
	// @ts-ignore
	let user: UserInterface & { password: never } = {
		username: '',
		fullName: '',
		isAccountVerified: false,
		avatar: '',
		roles: [],
	};
	try {
		const userRes = await User.findOne({
			username: req.params.username,
		});

		res.send({
			message: `Users ${userRes ? 'Found!' : 'Not Found!'}`,
			status: 'success',
			user: userRes,
		});
		return;
	} catch (err) {
		res.send({
			message: `error occured`,
			status: 'error',
		});
		return;
	}

	res.send({
		message: 'sensor not found',
		status: 'warning',
	});
});

export default UserPublicAPI_Router;
