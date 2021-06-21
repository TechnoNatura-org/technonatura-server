/*
 * =================== MTS TECHNONATURA SERVER GRAPHQL API ===================
 *
 * This API Script under MIT LICENSE
 *
 * (c) 2021 Aldhan
 * ===========================================================================
 */

import { gql } from 'apollo-server-express';

export default gql`
  interface APIResponse {
    message: String
    status: String
  }

  # arduino app
  type ArduinoAppToken {
    token: String!
    tokenCreated: Int!
  }

  type ArduinoApp {
    _id: ID
    name: String!
    desc: String!
    own: String!
    token: ArduinoAppToken
    sensors: [String]
  }

  type ArduinoSensorData {
    _id: ID!
    data: Int
    date: String
  }
  
  type ArduinoSensorRealtimeData {
    data: Int
    dateAdded: String
  }

  type ArduinoSensor {
    _id: ID!
    name: String!
    own: String!
    appID: String!
    data: [ArduinoSensorData]
    realtimeData: ArduinoSensorRealtimeData 
  }
  # arduino app

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
