import * as cors from 'cors';

// cors.
var whitelist = ['http://example1.com', 'http://example2.com'];
var corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export { corsOptions };
