import * as express from 'express';

import { VerifyAuthToken } from '../checkToken';

import ClassroomModel from '../../models/classroom/index';
import HandleError from './handleErrors';
const ClassroomRouterAddClass = express.Router();

ClassroomRouterAddClass.post('/', VerifyAuthToken, async (req, res) => {
	const {
		grade,
		gradePeriod,
		active,
		thumbnail,
		category,
		title,
		name,
		desc,
		from,
		to,
		branchId,
		isTeam,
	}: {
		grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
		gradePeriod: number;
		active: boolean;
		thumbnail: string | null;
		category: string;
		title: string;
		name: string;
		desc: string;
		from: number;
		to: number;
		branchId: string;
		isTeam: boolean;
	} = req.body;

	try {
		const classroom = new ClassroomModel({
			grade: grade,
			gradePeriod,
			name,
			title,
			active,
			category,
			desc,
			from,
			to,
			branchId,
			isTeam,
		});

		if (thumbnail) {
			classroom.thumbnail = thumbnail;
		}

		await classroom.save();

		res.json({
			status: 'success',
			message: 'classroom successfully created!',
			classroom: classroom,
		});
	} catch (err) {
		const errors = await HandleError(Object(err), req.body);
		// console.log(errors);
		res.json({
			status: 'error',
			message: 'Error occured',
			errMessage: String(err),
			errors: errors,
		});
	}
});

export default ClassroomRouterAddClass;
