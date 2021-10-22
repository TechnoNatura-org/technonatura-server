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
		if (userRes) {
			user.username = userRes.username;
			user.fullName = userRes.fullName;
			user.isAccountVerified = userRes.isAccountVerified;
			// @ts-ignore
			user.id = userRes.id;
			user.roleInTechnoNatura = userRes.roleInTechnoNatura;
			user.roles = userRes.roles;
			user.status = userRes.status;
			user.points = userRes.points;
			user.accountCreated = userRes.accountCreated;
			user.socialMedias = userRes.socialMedias;
			user.gender = userRes.gender;
			user.bio = user.bio;
		}

		res.send({
			message: `Users ${user ? 'Found!' : 'Not Found!'}`,
			status: 'success',
			user: user,
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
