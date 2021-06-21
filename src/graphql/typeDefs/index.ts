/*
 * =================== MTS TECHNONATURA SERVER GRAPHQL API ===================
 *
 * This API Script under MIT LICENSE
 *
 * (c) 2021 Aldhan
 * ===========================================================================
 */

import { gql } from 'apollo-server-express';
import * as fs from 'fs';

const Global = fs.readFileSync(`${__dirname}/index.graphql`, 'utf8');

const ArduinoAppSensor = fs.readFileSync(
  `${__dirname}/arduinoapp/sensor.graphql`,
  'utf8',
);
const ArduinoApp = fs.readFileSync(
  `${__dirname}/arduinoapp/arduinoApp.graphql`,
  'utf8',
);
const ArduinoAppGlobal = fs.readFileSync(
  `${__dirname}/arduinoapp/index.graphql`,
  'utf8',
);

export default gql`
  ${Global}

  ${ArduinoAppSensor}
  ${ArduinoApp}
  ${ArduinoAppGlobal}

  type Query {
    hello: String
    getArduinoApp(appId: String!): GetArduinoAppResponse
    getArduinoAppSensor(sensorId: String!): GetArduinoAppSensorResponse
  }

  type SensorData {
    date: Float!
    data: Float!
  }
`;
