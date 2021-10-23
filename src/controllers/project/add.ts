import * as express from 'express';

import { VerifyAuthToken } from '../checkToken';

import User, { UserBaseDocument } from '../../models/User/User.model';
import Project from '../../models/Project/index';
import HandleError from './handleErrors';
const ClassroomRouterAddClass = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

ClassroomRouterAddClass.post('/', VerifyAuthToken, async (req, res) => {
	const {
		draft,
		thumbnail,
		category,
		title,
		name,
		desc,

		assets,
		classroomId,
		content,
		tags,
	}: {
		draft: boolean;
		thumbnail: string | null;
		assets: Array<{ url: string; desc: string }>;
		tags: string;

		category: string;
		title: string;
		name: string;
		desc: string;

		// isTeam: boolean;
		classroomId: string;
		content: string;
	} = req.body;

	if (req.user) {
		const isthere = await Project.findOne({
			owner: req.user.id,
			classroomId,
		});

		if (!isthere) {
			try {
				const project = new Project({
					owner: req.user.id,
					// @ts-ignore
					grade: req.user.roleInTechnoNatura.grade,
					// @ts-ignore
					gradePeriod: req.user.roleInTechnoNatura.startPeriod,
					name,
					title,
					draft: false,
					category,
					desc,
					content,
					// @ts-ignore
					branch: req.user.roleInTechnoNatura.branch,
					assets,
					classroomId,
					tags,
				});

				if (thumbnail) {
					project.thumbnail = thumbnail;
				}

				await project.save();

				res.json({
					status: 'success',
					message: 'project successfully created!',
					project: project,
				});
				return;
			} catch (err) {
				const errors = await HandleError(Object(err), req.body);
				res.json({
					status: 'error',
					message:
						Object.keys(errors).length == 0
							? 'Error occured'
							: 'Error occured on input validation.',
					errMessage: String(err),
					errors: errors,
				});
				return;
			}
		} else {
			res.json({
				status: 'error',
				message: 'You already had project with this classroom assignment.',
			});
		}
	}
});

export default ClassroomRouterAddClass;
