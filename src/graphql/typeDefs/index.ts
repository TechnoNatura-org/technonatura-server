/*
 * =================== MTS TECHNONATURA SERVER GRAPHQL API ===================
 *
 * This API Script under MIT LICENSE
 *
 * (c) 2021 Aldhan
 * ===========================================================================
 */

import { gql } from 'apollo-server-express';
// import * as fs from 'fs';

// const Global = fs.readFileSync(`${__dirname}/index.graphql`, 'utf8');

// const ArduinoAppSensor = fs.readFileSync(
//   `${__dirname}/arduinoapp/sensor.graphql`,
//   'utf8',
// );
// const ArduinoApp = fs.readFileSync(
//   `${__dirname}/arduinoapp/arduinoApp.graphql`,
//   'utf8',
// );
// const ArduinoAppGlobal = fs.readFileSync(
//   `${__dirname}/arduinoapp/index.graphql`,
//   'utf8',
// );

export default gql`
  interface APIResponse {
    message: String
    status: String
  }

  type ArduinoSensorData {
    _id: ID!
    data: Int
    date: Int
  }

  type ArduinoSensor {
    _id: ID!
    name: String!
    own: String!
    appID: String!
  }
  type ArduinoApp {
    _id: ID
    name: String!
    desc: String!
    own: String!
    token: ArduinoAppToken
    sensors: [String]
    subscribe: Boolean!
  }
  # arduino app
  type ArduinoAppToken {
    token: String!
    tokenCreated: Int!
  }

  type GetArduinoAppResponse implements APIResponse {
    message: String
    status: String
    app: ArduinoApp
  }

  type GetArduinoAppSensorResponse implements APIResponse {
    message: String
    status: String
    sensor: ArduinoSensor
  }

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
