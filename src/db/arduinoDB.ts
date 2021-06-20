import * as mongoose from 'mongoose';

const ArduinoDB = mongoose.createConnection(
  process.env.arduinoDB_URI ||
    'mongodb://127.0.0.1:27017/mts-technonatura-server-arduinoDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

export { ArduinoDB };
