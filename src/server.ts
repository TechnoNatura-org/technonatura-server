import * as express from 'express';
import * as cors from 'cors';
// methodOverride.
import * as methodOverride from 'method-override';

import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from '../graphql/schemas';
import resolvers from '../graphql/resolvers';

import AuthRouter from './routes/auth';
import ContactRouter from './routes/contact.route';
import ArduinoRouter from './routes/arduino.route';
import SubscriptionRouter from './routes/subsciption.router';
import { corsOptions } from './controllers/cors';

import * as mongoose from 'mongoose';

const db = mongoose.connection;
const app = express();

let MongoDB_URI =
  process.env.mongoDB_URI ||
  'mongodb://127.0.0.1:27017/mts-technonatura-server';
mongoose.connect(MongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(methodOverride('_method'));
app.use(express.json());

db.on('error', (err) => console.error('error when connecting to db'));
db.once('open', () => console.log('connected to mongoose'));

// app.use('/', PostRouter);
app.use('/auth', cors(corsOptions), AuthRouter);
// app.use('/contact', cors(corsOptions), ContactRouter);
app.use('/contact', cors(corsOptions), ContactRouter);
app.use('/arduino', ArduinoRouter);
app.use('/', SubscriptionRouter);

app.get('/', (req, res) => {
  res.json({ message: 'hey' });
});

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.start();

  const path = '/graphql';

  server.applyMiddleware({ app, path });

  app.listen(process.env.PORT || 3030, () => {
    console.log(`server started on port ${process.env.PORT}`);
    console.log(
      `🚀 Server ready at http://localhost:3030${server.graphqlPath}`,
    );
  });
}

startApolloServer();
