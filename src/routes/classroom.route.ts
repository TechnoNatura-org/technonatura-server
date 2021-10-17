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
import { Request } from 'express';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { corsOptions } from '../controllers/cors';

import Classroom from '../models/classroom/index';
import ClassroomPrivateAPI from '../controllers/classroom/index';

const ClassroomRouter = express.Router();

ClassroomRouter.use('/classroom', ClassroomPrivateAPI);

ClassroomRouter.get<{
	grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}>('/api/classrooms/:grade', async (req, res) => {
	console.log(req.query);

	const classroms = await Classroom.find({ grade: req.params.grade });

	res.json({ message: 'hey!', classroms: classroms });
});

export default ClassroomRouter;
