/**
 * =================== TECHNONATURA SERVER =================
 *
 * This API Script under MIT LICENSE
 * What is this for ? This is REST API for MTS Technonatura arduino database, user make app and saved the app to db.
 *
 * @license MIT
 *
 * (c) 2021 by Aldhanekaa
 * =============================================================
 */

import * as express from 'express';

import Project from '../models/Project/index';
import User from '../models/User/User.model';

import * as cors from 'cors';
import { corsOptions } from '../controllers/cors';

import AddProjectAPI from '../controllers/project/add';
import EditProjectAPI from '../controllers/project/edit';
import DeleteProjectAPI from '../controllers/project/delete';

const ProjectRouter = express.Router();

ProjectRouter.use('/project/add', cors(corsOptions), AddProjectAPI);
ProjectRouter.use('/project/edit', cors(corsOptions), EditProjectAPI);
ProjectRouter.use('/project/delete', cors(corsOptions), DeleteProjectAPI);

ProjectRouter.get('/projects/:username', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username });

		if (user) {
			const projects = await Project.find({ owner: user.id });

			if (projects) {
				res.send({
					message: 'Projects found!',
					projects: projects,
					status: 'success',
				});
				return;
			} else {
				res.send({
					message: 'Project not found!',
					status: 'info',
				});
				return;
			}
		}

		res.send({
			message: 'user not found!',
			status: 'error',
		});
		return;
	} catch (err) {
		res.send({
			message: 'Error occured when trying to fetch project.',
			status: 'error',
		});
		return;
	}
});
ProjectRouter.get('/project/:name', async (req, res) => {
	// console.log('req.params.name', req.params.name);

	try {
		const project = await Project.findOne({ name: req.params.name });

		if (project) {
			// console.log(project);
			res.send({
				message: 'Project found!',
				project: project,
				status: 'success',
			});
			return;
		} else {
			res.send({
				message: 'Project not found!',
				status: 'info',
			});
			return;
		}
	} catch (err) {
		res.send({
			message: 'Error occured when trying to fetch project.',
			status: 'error',
		});
		return;
	}
});

export default ProjectRouter;
