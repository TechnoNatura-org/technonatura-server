import { Server } from 'socket.io';
import { Request } from 'express';

export type arduinoSocketT = {
	socketId: string;
	subscribe: {
		apps: boolean;
		sensors: Array<string>;
		datas: Array<string>;
	};
};
export interface arduinoSubsribeT {
	apps: boolean;
	sensors: Array<string>;
	datas: Array<string>; // sensors id
}
export type arduinoSocketsT = Array<arduinoSocketT>;

class arduinoSocketClass {
	public socketId: string;
	public subscribe: arduinoSubsribeT;
	constructor(socketId: string) {
		this.socketId = socketId;
		this.subscribe = {
			apps: false,
			sensors: [],
			datas: [],
		};
	}
}

class arduinoSocketsClass {
	public arduinoSockets: Array<arduinoSocketClass> = [];

	constructor() {}

	public addSocket(item: arduinoSocketT): void {
		const newSocket = new arduinoSocketClass(item.socketId);
		this.arduinoSockets.push(newSocket);
	}

	public sendDatas(
		req: Request,
		sensorId: string,
		data: string | number,
		dateAdded: number,
		id: string,
	) {
		this.arduinoSockets.forEach((socket) => {
			if (socket.subscribe.datas.includes(String(sensorId))) {
				console.log('socket.socketId', socket.socketId);
				req.io
					.of('/websocket/arduino')
					.to(socket.socketId)
					.emit('arduino.sensor.datas', {
						sensorId: sensorId,
						data: data,
						dateAdded: dateAdded,
						id: id,
					});
			}
		});
	}
	// public sendSensorRealtimeDataToSocket(
	//   req: Request,
	//   sensorId: string,
	//   data: string | number,
	//   dateAdded: number,
	// ) {
	//   this.arduinoSockets.forEach((socket) => {
	//     if (socket.subscribe.realtimeData.includes(String(sensorId))) {
	//       console.log('socket.socketId', socket.socketId);
	//       req.io
	//         .of('/websocket/arduino')
	//         .to(socket.socketId)
	//         .emit('arduino.sensor.realtimeData', {
	//           sensorId: sensorId,
	//           data: data,
	//           dateAdded: dateAdded,
	//         });
	//     }
	//   });
	// }
}

export let arduinoSockets = new arduinoSocketsClass();
