import * as jwt from 'jsonwebtoken';

interface COOL {
  email: string;
  username: string;
  password: string;
  _id: string;
}

export enum tokenForTypes {
  auth,
  arduino,
  APIApp,
}

// max age
const maxAge = 3 * 24 * 60 * 60 * 60;
const createToken = (user: COOL, tokenFor: tokenForTypes) => {
  return jwt.sign({ ...user }, 'asodjijiej3q9iej93qjeiqwijdnasdini', {
    expiresIn: '5y',
  });
};

export default createToken;
