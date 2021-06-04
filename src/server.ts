import * as express from 'express';
import * as cors from 'cors';
// methodOverride.
import * as methodOverride from 'method-override';

import { ApolloServer, gql } from 'apollo-server-express';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import AuthRouter from './routes/auth';
import ContactRouter from './routes/contact.route';
import ArduinoRouter from './routes/arduino.route';
import StoryRouter from './routes/stories.route';
import SubscriptionRouter from './routes/subsciption.router';
import AnythingRouter from './routes/any.route';
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  next();
});

db.on('error', (err) => console.error('error when connecting to db'));
db.once('open', () => console.log('connected to mongoose'));
// app.use('/', PostRouter);
app.use('/auth', cors(corsOptions), AuthRouter);
// app.use('/contact', cors(corsOptions), ContactRouter);
app.use('/contact', cors(corsOptions), ContactRouter);
app.use('/arduino', ArduinoRouter);
app.use('/', StoryRouter);
app.use('/', SubscriptionRouter);
app.use('/', AnythingRouter);

app.get('/', (req, res) => {
  res.json({ message: 'hey' });
});

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => app.listen({ port: process.env.PORT || 3030 }))
    .then(() => {
      return { server, app };
    })
    .catch(() => {
      return { server, app };
    });
}

startApolloServer();
