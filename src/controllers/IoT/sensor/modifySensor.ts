/*
 * =================== MTS TECHNONATURA SERVER =================
 *
 * This API Script under MIT LICENSE
 * What is this for ? This is REST API for MTS Technonatura arduino database, user make app and saved the app to db.
 *
 * (c) 2021 by MTS-Technonatura, made with 💖 by Aldhan
 * =============================================================
 */

import * as express from 'express';
import { Request } from 'express';

import Sensor from '../../../models/IoT/Sensors/Sensor';
import Teammate from '../../../models/IoT/Teammate.model';

import { UserBaseDocument } from '../../../models/User/User.model';

import { VerifyAuthToken } from '../../checkToken';
import handleErrors from '../handleErrors';

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

interface UserInRequest extends Request {
	user?: UserBaseDocument | null;
}

const IoTCloudAppEditRouter = express.Router();

IoTCloudAppEditRouter.use((req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

IoTCloudAppEditRouter.post(
	'/',
	VerifyAuthToken,
	async (req: UserInRequest, res) => {
		/*
		 *
		 * 1. Verify JWT
		 * 2. Check if the arduino app name already exist or not
		 * 3. Create Token For Arduino App
		 * 4. Save Arduino App to Database
		 * 5. Send response
		 */

		//@ts-ignore
		const {
			name,
			desc,
			sensorId,
		}: {
			name: string;
			desc: string;
			sensorId: string;
		} = req.body;

		try {
			const isThere = await Sensor.findById(sensorId).updateOne({
				name,
				desc,
			});

			res.status(200).send({
				message: 'Success Fully Changed',
				status: 'success',
			});
			return;
		} catch (err) {
			// @ts-ignore
			const errors = await handleErrors(err);
			res.status(200).send({
				message: 'error',
				errors,
				status: 'error',
			});
			return;
		}
	},
);

export default IoTCloudAppEditRouter;
