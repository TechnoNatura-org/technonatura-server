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

import { checkRoles } from '../controllers/checkRoles';

import ArduinoApp from '../models/Arduino/arduinoApp.model';
import Sensor from '../models/Arduino/Sensors/Sensor';

import BlogPost from '../models/Blog/BlogPost.model';
import SensorData from '../models/Arduino/Sensors/SensorsData.model';

import User from '../models/User.model';

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

AnyRouter.get('/arduino/getApp', async (req, res) => {
  const { appId } = req.query;

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

  res.send({ message: 'app not found', status: 'warning' });
});

AnyRouter.get('/arduino/getSensor', async (req, res) => {
  const { sensorId } = req.query;

  const sensor = await Sensor.findById(sensorId);
  // const App = await AppDoc?.getApp();

  if (sensor) {
    res.send({
      message: 'app found!',
      status: 'success',
      sensor: sensor,
    });
    return;
  }

  res.send({ message: 'sensor not found', status: 'warning' });
});

AnyRouter.post('/checkRoles', (req, res) => {
  const {
    roles,
    permission,
  }: { roles?: Array<string>; permission?: string | Array<string> } = req.body;

  if (roles && permission) {
    res.send(checkRoles(roles, permission));
    return;
  }

  res.send(false);

  return;
});

export default AnyRouter;
