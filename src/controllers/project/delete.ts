import * as express from 'express';

import { VerifyAuthToken } from '../checkToken';

import User, { UserBaseDocument } from '../../models/User/User.model';
import Project from '../../models/Project/index';
import UserProjectModel from '../../models/Project/userProject';

const ProjectRouteDeleteProject = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

ProjectRouteDeleteProject.post('/', VerifyAuthToken, async (req, res) => {
	let {
		projectName,
	}: {
		projectName: string;
	} = req.body;

	if (req.user) {
		try {
			await Project.deleteOne({
				owner: req.user.id,
				name: projectName,
			});
			await UserProjectModel.findOne({
				userId: req.user.id,
			}).updateOne({
				$inc: {
					projects: -1,
				},
			});
			res.send({
				message: 'Successfully Deleted Project!',
				status: 'success',
			});
		} catch (err) {
			res.send({
				message: 'error occured when deleting project',
				status: 'error',
			});
		}
	}
});

export default ProjectRouteDeleteProject;
