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
import * as jwt from 'jsonwebtoken';

import ArduinoApp from '../models/IoT/arduinoApp.model';
import Sensor from '../models/IoT/Sensors/Sensor';
import { UserBaseDocument } from '../models/User/User.model';
import SensorsData from '../models/IoT/Sensors/SensorsData.model';

import { VerifyAuthToken } from '../controllers/checkToken';

import AddArduinoAppRoute from '../controllers/IoT/app/addApp';
import ModifyApp from '../controllers/IoT/app/modifyApp';

import { decryptIoTAppToken } from '../controllers/IoT/hashToken';

import AddSensorRoute from '../controllers/IoT/sensor/addSensor';
import modifyApp from '../controllers/IoT/app/modifyApp';
import modifySensor from '../controllers/IoT/sensor/modifySensor';

// import sendRealtimeData from '../socket/arduino/realtimeData';
// // import { arduinoSockets } from '../db/arduinoSockets';
declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

interface UserInRequest extends Request {
	user?: UserBaseDocument | null;
}

const ArduinoRouter = express.Router();

ArduinoRouter.use((req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

ArduinoRouter.post('/apps', VerifyAuthToken, async (req, res) => {
	try {
		let apps;
		if (req.query.sharedWithMe) {
			apps = await ArduinoApp.find({
				$and: [
					{
						'team.userId': req.id,
					},
					{
						$or: [
							{
								'team.role': 'owner',
							},
							{
								'team.role': 'admin',
							},
							{
								'team.role': 'viewer',
							},
						],
					},
				],
			});
		} else {
			apps = await ArduinoApp.find({ own: req.id });
		}
		res.status(200).send({ apps: apps, status: 'success' });
		return;
	} catch (err) {
		res.status(200).send({
			message: 'error when fetching apps',
			err: JSON.parse(err),
			status: 'error',
		});
	}
});

ArduinoRouter.post('/app', VerifyAuthToken, async (req, res) => {
	const { iotAppId } = req.body;

	try {
		const app = await ArduinoApp.findById(iotAppId);
		res.status(200).send({ app: app });
	} catch (err) {
		res.status(200).send({ message: 'error when fetching apps' });
	}
});
ArduinoRouter.post('/sensor', VerifyAuthToken, async (req, res) => {
	const { sensorId } = req.body;

	if (sensorId) {
		try {
			const sensor = await Sensor.findById(sensorId);
			const app = await ArduinoApp.findById(sensor?.appId);

			res.status(200).send({ sensor: sensor, app });
			return;
		} catch (err) {
			res
				.status(200)
				.send({ message: 'error when fetching apps', status: 'error' });
			return;
		}
	}
	res.status(200).send({ message: 'no sensor id provided', status: 'error' });
	return;
});

ArduinoRouter.use('/add/', AddArduinoAppRoute);
ArduinoRouter.use('/edit/', modifyApp);
ArduinoRouter.use('/edit/sensor', modifySensor);

ArduinoRouter.use('/add/sensor', AddSensorRoute);

ArduinoRouter.post(
	'/sensors/',
	VerifyAuthToken,
	/*
	 * requires these datas on body:
	 * - UserInRequest
	 * - authToken
	 */

	async (req: UserInRequest, res) => {
		const { iotAppId } = req.body;
		const isThereArduinoApp = await ArduinoApp.findById(iotAppId);

		if (isThereArduinoApp) {
			try {
				// @ts-ignore
				const sensors = await ArduinoApp.getAllSensors(isThereArduinoApp.id);

				res.status(200).send({ sensors: sensors });
			} catch (err) {
				console.log();
				res
					.status(200)
					.send({ message: 'error when fetching sensors', status: 'error' });
			}
		} else {
			res.status(200).send({ message: 'app not found', status: 'error' });
		}
	},
);

// ===========================================================
// DELETE APP AND SENSORS
// ===========================================================
ArduinoRouter.post('/del/:iotAppId', VerifyAuthToken, async (req, res) => {
	const { iotAppId } = req.params;
	const app = await ArduinoApp.findById(iotAppId);

	// console.log(sensor, req.id);
	if (app && app.own == req.id) {
		try {
			const sensors = await Sensor.find({ appId: iotAppId }).deleteMany();

			await app.deleteOne();

			res.status(200).send({ message: 'IoT app deleted', status: 'success' });
			return;
		} catch (err) {
			res.status(200).send({
				message: 'error when remove app from database',
				status: 'error',
			});
			return;
		}
	} else {
		res.status(200).send({ message: 'app not found', status: 'error' });
		return;
	}
});

ArduinoRouter.post(
	'/del/sensor/:sensorId',
	VerifyAuthToken,
	async (req, res) => {
		const { sensorId } = req.params;
		const sensor = await Sensor.findById(sensorId);

		// console.log(sensor, req.id);
		if (sensor && sensor.userId == req.id) {
			try {
				await sensor.deleteOne();
				res.status(200).send({ message: 'success', status: 'success' });
				return;
			} catch (err) {
				res.status(500).send({
					message: 'error when remove sensor from database',
					status: 'success',
				});
				return;
			}
		} else {
			res.status(200).send({ message: 'sensor not found', status: 'warning' });
			return;
		}
	},
);
// ===========================================================
// DELETE APP AND SENSORS
// ===========================================================

// ===========================================================
// UPDATE APP AND SENSORS
// ===========================================================
ArduinoRouter.post('/update/:id', VerifyAuthToken, (req, res) => {});

ArduinoRouter.post(
	'/update/sensor/:sensorID',
	VerifyAuthToken,
	(req, res) => {},
);
ArduinoRouter.post('/add/data/', async (req, res) => {
	const { iotAppToken, sensors, realtimeData } = req.body;
	//   console.log(req.body);

	if (!iotAppToken) {
		res.status(200).json({ message: 'token not provided', status: 'error' });
		return;
	}

	try {
		// convert jwt
		// convert jwt
		const verifyToken = await jwt.verify(
			iotAppToken,
			process.env.ARDUINO_APP_SECRET_TOKEN || 'arduinoSecret',
		);

		const arduinoApp = await ArduinoApp.findById(
			// @ts-ignore
			verifyToken.appId,
		);
		console.log('arduinoApp', arduinoApp);

		if (!arduinoApp) {
			res
				.status(200)
				.json({ message: 'Arduino App Not Found', status: 'error' });
			return;
		}

		if (typeof sensors == 'object' || typeof realtimeData == 'object') {
			try {
				if (sensors) {
					for (const sensor in sensors) {
						const TypeOfSensorData = Number(sensors[sensor]);

						// console.log(isNaN(TypeOfSensorData));
						if (!isNaN(TypeOfSensorData)) {
							const foundSensor = await Sensor.find({
								appId: arduinoApp._id,
							}).findOne({
								name: sensor,
							});

							if (foundSensor) {
								const sensorData = new SensorsData({
									data: TypeOfSensorData,
								});

								await foundSensor.updateOne({
									$push: {
										datas: sensorData,
									},
								});

								const now = Date.now();

								await foundSensor.updateOne({
									realtimeData: {
										data: TypeOfSensorData,
										dateAdded: now,
									},
								});

								// arduinoSockets.sendDatas(
								// 	req,
								// 	foundSensor._id,
								// 	String(sensorData.data),
								// 	sensorData.date,
								// 	sensorData._id,
								// );
							}
						}
					}
				}

				res
					.status(200)
					.json({ message: 'Success Added Data', status: 'success' });
				return;
			} catch (err) {
				console.log(err);
				res
					.status(200)
					.json({ message: "sensors isn't object", status: 'error' });
				return;
			}
		}
		res
			.status(200)
			.json({ message: 'Please give an sensors input', status: 'error' });
		return;
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: 'token might expired', status: 'error' });
		return;
	}
});

// ===========================================================
// UPDATE APP AND SENSORS
// ===========================================================

export default ArduinoRouter;
