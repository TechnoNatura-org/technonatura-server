/*
 * =================== TECHNONATURA SERVER =================
 *
 * This API Script under MIT LICENSE
 *
 * (c) 2021 by Aldhan
 * =============================================================
 */

import * as express from 'express';

import TechnoNaturaBranch from '../../models/TechnoNatura-Branch/TechnoNatura-Branch.model';

const TechnoNaturaBranchRouter = express.Router();

TechnoNaturaBranchRouter.get('/branches', async (req, res) => {
	try {
		const branches = await TechnoNaturaBranch.find();
		res.json({
			message: 'Success fetching branches!',
			status: 'success',
			branches,
		});
	} catch (err) {
		res.json({
			message: 'Error when fetching TechnoNatura Branches',
			status: 'error',
		});
	}
});

export default TechnoNaturaBranchRouter;
