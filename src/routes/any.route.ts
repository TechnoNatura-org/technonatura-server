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
import ArduinoApp from '../models/Arduino/Sensors/arduinoApp.model';
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

export default AnyRouter;
