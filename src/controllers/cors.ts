if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as cors from 'cors';

// cors.
var whitelist = [
  'http://localhost:3000',
  'https://mts-tn.vercel.app',
  'https://mts-technonatura.vercel.app',
  'https://dashboard.mts-technonatura.vercel.app',
];
var corsOptions: cors.CorsOptions = {
  origin: function(origin, callback) {
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'dev') {
      if (origin && whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      callback(null, true);
    }
  },
  credentials: true,
};

export { corsOptions };
