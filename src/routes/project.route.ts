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

import * as cors from 'cors';
import { corsOptions } from '../controllers/cors';

import User from '../models/User/User.model';
import ProjectPrivateAPI from '../controllers/project/add';
import whatIsMyGrade from '../utils/myGrade';

const ProjectRouter = express.Router();

ProjectRouter.use('/project/add', cors(corsOptions), ProjectPrivateAPI);

export default ProjectRouter;
