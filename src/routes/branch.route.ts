/*
 * =================== TECHNONATURA SERVER =================
 *
 * This API Script under MIT LICENSE
 * What is this for ? This is REST API for MTS Technonatura arduino database, user make app and saved the app to db.
 *
 * (c) 2021 by Aldhan
 * =============================================================
 */

import * as express from 'express';

import TechnoNaturaBranch from '../models/TechnoNatura-Branch/TechnoNatura-Branch.model';
import TechnoNaturaBranchHandleErrors from '../controllers/branch/handleErrors';

const TechnoNaturaBranchRouter = express.Router();

TechnoNaturaBranchRouter.post('/add', async (req, res) => {
	const { title, name } = req.body;

	try {
		const branch = new TechnoNaturaBranch({ title, name });
		await branch.save();
		res.json({
			message: 'Success add branch!',
			status: 'success',
			branch,
		});
		return;
	} catch (err) {
		const errors = await TechnoNaturaBranchHandleErrors(Object(err));
		res.json({
			message: 'Error when fetching TechnoNatura Branches',
			status: 'error',
			errors: errors,
		});
		return;
	}
});

export default TechnoNaturaBranchRouter;
