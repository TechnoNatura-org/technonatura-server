import * as express from 'express';

import * as cors from 'cors';
import { corsOptions } from '../cors';

import AddClass from './add';

const ClassroomRouter = express.Router();

ClassroomRouter.use('/add', cors(corsOptions), AddClass);

export default ClassroomRouter;
