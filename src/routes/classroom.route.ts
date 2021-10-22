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

import Classroom from '../models/classroom/index';
import Project from '../models/Project/index';

import User from '../models/User/User.model';
import ClassroomPrivateAPI from '../controllers/classroom/index';
import whatIsMyGrade from '../utils/myGrade';

const ClassroomRouter = express.Router();

ClassroomRouter.use('/classroom', ClassroomPrivateAPI);

ClassroomRouter.get<{
	grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}>('/api/classrooms/:grade', async (req, res) => {
	console.log(req.query);

	const classroms = await Classroom.find({ grade: req.params.grade });

	res.json({ message: 'hey!', classroms: classroms });
});

ClassroomRouter.get<{
	grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}>('/api/classrooms/', async (req, res) => {
	console.log('/api/classrooms/ !');

	try {
		if (typeof req.query.username === 'string') {
			const user = await User.findOne({ username: req.query.username });

			// @ts-ignore
			if (user?.roleInTechnoNatura.student) {
				if (
					req.query.grade &&
					typeof Number(req.query.grade) == 'number' &&
					Number(req.query.grade) >= 1 &&
					Number(req.query.grade) <= 12 &&
					whatIsMyGrade(Number(req.query.grade)) ==
						// @ts-ignore
						whatIsMyGrade(Number(user.roleInTechnoNatura.grade)) &&
					// @ts-ignore
					user.roleInTechnoNatura.student
				) {
					// @ts-ignore
					const classrooms = await Classroom.find({
						// @ts-ignore
						grade: Number(req.query.grade),
						gradePeriod: req.query.gradePeriod,
						// @ts-ignore
						branchId: user.roleInTechnoNatura.branch,
					});
					let classroomsRes: object[] = [];

					for (let classroom of classrooms) {
						try {
							const project = await Project.findOne({
								classroomId: classroom.id,
								owner: user.id,
							});

							if (!project) classroomsRes.push(classroom);
						} catch (err) {}
					}

					res.json({
						message: 'success fetched classroom!',
						status: 'success',
						classrooms: classroomsRes,
					});
					return;
				} else {
					res.json({
						message: 'failed to fetched classroom!',
						status: 'error',
					});
					return;
				}
			}
		}
	} catch (err) {
		res.json({
			message: 'error occured when fetching classroom!',
			status: 'error',
		});
		return;
	}

	// const classroms = await Classroom.find({ grade: req.params.grade });

	res.json({ message: 'hello there' });
});

export default ClassroomRouter;
