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
    subscribe: Boolean!
  }

  type GetArduinoAppResponse implements APIResponse {
    message: String
    status: String
    app: ArduinoApp
  }

  type Query {
    hello: String
    getArduinoApp(appId: String!): GetArduinoAppResponse
  }

  type SensorData {
    date: Float!
    data: Float!
  }
`;
