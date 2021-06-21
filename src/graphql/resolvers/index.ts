import ArduinoApp from '../../models/Arduino/arduinoApp.model';
import Sensor from '../../models/Arduino/Sensors/Sensor';

export default {
  APIResponse: {
    __resolveType(model: any, context: any, info: any) {
      if (model.app) {
        return 'GetArduinoAppResponse';
      }

      if (model.sensor) {
        return 'GetArduinoAppSensorResponse';
      }

      return null; // GraphQLError is thrown
    },
  },

  Query: {
    hello: () => 'Hello world!',
    getArduinoApp: async (
      parent: string,
      query: { appId: string },
      graphql: any,
    ) => {
      // console.log(appId, p, o);
      const { appId } = query;

      try {
        const App = await ArduinoApp.findById(appId);
        // console.log(appId, App);

        // const App = await AppDoc?.getApp();
        const AppSensors = await Sensor.find({ appID: App?._id });

        // @ts-ignore
        App.token = '';

        AppSensors.forEach((sensor) => {
          // @ts-ignore
          App.sensors.push(sensor._id);
        });

        return {
          message: 'app found!',
          status: 'success',
          app: Object.assign(
            {},
            // @ts-ignore
            App._doc,
            // @ts-ignore
            { sensors: App.sensors },
          ),
        };
      } catch (err) {
        return { message: 'app not found', status: 'warning' };
      }

      return { message: 'app not found', status: 'warning' };
    },

    getArduinoAppSensor: async (
      parent: string,
      query: { sensorId: string },
      context: any,
      info: any,
    ) => {
      // console.log(appId, p, o);
      const { sensorId } = query;

      try {
        const sensor = await Sensor.findById(sensorId);

        return {
          message: 'sensor found!',
          status: 'success',
          sensor: sensor,
        };
      } catch (err) {
        return { message: 'sensor not found', status: 'warning' };
      }

      return { message: 'sensor not found', status: 'warning' };
    },
  },
};
