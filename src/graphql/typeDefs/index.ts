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
  type Query {
    hello: String
  }
`;
