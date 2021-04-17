if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as cors from 'cors';

// cors.
var whitelist = ['http://localhost:3000/', 'http://example2.com'];
var corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export { corsOptions };
