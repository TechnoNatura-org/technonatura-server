import { Server } from 'socket.io';
import { Request } from 'express';

import SensorModel from '../../models/Arduino/Sensors/Sensor';

import { arduinoSockets } from '../../db/arduinoSockets';

export default function sendRealtimeData(
  req: Request,
  appId: string,
  userId: string,
) {
  console.log(arduinoSockets.arduinoSockets);
  // req.io.to('asd').emit();
}
