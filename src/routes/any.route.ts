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

import ArduinoApp from '../models/Arduino/arduinoApp.model';
import Sensor from '../models/Arduino/Sensors/Sensor';

import BlogPost from '../models/Blog/BlogPost.model';

import User from '../models/User/User.model';

const AnyRouter = express.Router();

AnyRouter.get('/allData', async (req, res) => {
	const allUsers = User.count();
	const verifiedUsers = User.find({ isAccountVerified: true }).count();
	const unVerifiedUsers = User.find({ isAccountVerified: false }).count();
	const blogPosts = BlogPost.count();
	const sensors = Sensor.count();

	const arduinoApps = ArduinoApp.count();
	const gatau = await Promise.all([
		blogPosts,
		allUsers,
		verifiedUsers,
		unVerifiedUsers,
		arduinoApps,
		sensors,
	]);

	const WOOF = [
		{
			title: 'Total Users',
			data: gatau[1],
		},
		{
			title: 'Total Verified Users',
			data: gatau[2],
		},
		{
			title: 'Total Unverified Users',
			data: gatau[3],
		},
		{
			title: 'Total Arduino Apps',
			data: gatau[4],
		},
		{
			title: 'Total Sensors',
			data: gatau[5],
		},
		{
			title: 'Blog Posts',
			data: gatau[0],
		},
	];

	res.send({ data: WOOF });
});

AnyRouter.get('/getArduinoApp', async (req, res) => {
	const { appId } = req.query;

	try {
		const App = await ArduinoApp.findById(appId);
		// const App = await AppDoc?.getApp();

		if (App) {
			const AppSensors = await Sensor.find({ appID: App?._id });

			// @ts-ignore
			App.token = '';

			AppSensors.forEach((sensor) => {
				App.sensors.push(sensor._id);
			});

			res.send({
				message: 'app found!',
				status: 'success',
				app: Object.assign(
					{},
					// @ts-ignore
					App._doc,
					// @ts-ignore
					{ sensors: App.sensors },
				),
			});
			return;
		}
	} catch (err) {
		res.send({ message: 'app not found', status: 'warning' });
		return;
	}

	res.send({ message: 'app not found', status: 'warning' });
	return;
});

AnyRouter.get('/getSensor', async (req, res) => {
	const { sensorId } = req.query;

	const sensor = await Sensor.findById(sensorId);
	// const App = await AppDoc?.getApp();

	if (sensor) {
		res.send({
			message: 'sensor found!',
			status: 'success',
			sensor: sensor,
		});
		return;
	}

	res.send({ message: 'sensor not found', status: 'warning' });
});

AnyRouter.get('/users', async (req, res) => {
	// const App = await AppDoc?.getApp();
	const users: Array<{
		username: string;
		name: string;
		isAccountVerified: boolean;
		id: string;
		avatar: string;
		roleInTechnoNatura: string;
		startPeriod?: number;
		gradeInNumber: number;
	}> = [];
	try {
		const usersRes = await User.find({});
		usersRes.forEach((item) => {
			users.push(
				// @ts-ignore
				{
					username: item.username,
					name: item.fullName,
					isAccountVerified: item.isAccountVerified,
					id: item.id,
					avatar: item.avatar,
					// @ts-ignore
					roleInTechnoNatura: item.roleInTechnoNatura.student
						? 'student'
						: 'teacher',
					// @ts-ignore
					startPeriod: item.roleInTechnoNatura.startPeriod,
					gradeInNumber: item.roleInTechnoNatura.grade,
				},
			);
		});

		res.send({
			message: `Users ${users.length > 0 ? 'Found!' : 'Not Found!'}`,
			status: 'success',
			users: users,
		});
		return;
	} catch (err) {
		res.send({
			message: `error occured`,
			status: 'error',
		});
		return;
	}

	res.send({ message: 'sensor not found', status: 'warning' });
});

AnyRouter.get('/teachers', async (req, res) => {
	// const App = await AppDoc?.getApp();
	const teachers: Array<{
		username: string;
		name: string;
		isAccountVerified: boolean;
		id: string;
		avatar: string;
		roleInTechnoNatura: string;
		verifiedTeacher: boolean;
		gradeInNumber: number;
	}> = [];
	try {
		// @ts-ignore
		const teachersRes = await User.find({
			'roleInTechnoNatura.teacher': true,
		});
		teachersRes.forEach((item) => {
			teachers.push(
				// @ts-ignore
				{
					username: item.username,
					name: item.fullName,
					isAccountVerified: item.isAccountVerified,
					id: item.id,
					avatar: item.avatar,
					// @ts-ignore
					verifiedTeacher: item.roleInTechnoNatura.isVerified,
					gradeInNumber: item.roleInTechnoNatura.grade,
				},
			);
		});

		res.send({
			message: `Teachers ${teachers.length > 0 ? 'Found!' : 'Not Found!'}`,
			status: 'success',
			teachers: teachers,
		});
		return;
	} catch (err) {
		res.send({
			message: `error occured`,
			status: 'error',
		});
		return;
	}
});

export default AnyRouter;
