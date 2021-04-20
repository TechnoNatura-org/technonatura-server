import * as jwt from 'jsonwebtoken';

interface COOL {
  points: number;
  email: string;
  name: string;
  username: string;
  isAccountVerified: boolean;
  password: string;
  roles: Array<string>;
  _id: string;
}
// max age
const maxAge = 3 * 24 * 60 * 60 * 60;
const createToken = (user: COOL) => {
  return jwt.sign({ ...user }, 'asodjijiej3q9iej93qjeiqwijdnasdini', {
    expiresIn: '5y',
  });
};

export default createToken;
