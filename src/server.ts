import * as express from 'express';

import * as cors from 'cors';
import * as helmet from 'helmet';

import { createServer } from 'http';
import { Server } from 'socket.io';

import * as methodOverride from 'method-override';
import * as mongoose from 'mongoose';
import { ApolloServer, gql } from 'apollo-server-express';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import AuthRouter from './routes/auth';
import ContactRouter from './routes/contact.route';
import ArduinoRouter from './routes/arduino.route';
import StoryRouter from './routes/blog.route';
import SubscriptionRouter from './routes/subsciption.router';
import AnythingRouter from './routes/any.route';
import { corsOptions } from './controllers/cors';

import Socketmain from './socket/index';
import ArduinoSocket from './socket/arduino';

import { arduinoSockets } from './db/arduinoSockets';


const db = mongoose.connection;
const app = express();

const http = createServer(app);
const io = new Server(http);

let MongoDB_URI =
  process.env.mongoDB_URI ||
  'mongodb://127.0.0.1:27017/mts-technonatura-server';
mongoose.connect(MongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true,
  }),
);
app.use(methodOverride('_method'));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  next();
});

app.use(function(req, res, next) {
  req.io = io;
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
app.use(
  '/',

  AnythingRouter,
);

app.get('/', (req, res) => {
  req.io.of('/websocket').sockets.forEach((socket) => {
    console.log(socket);
  });
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

  io.of('/websocket/arduino').on('connection', (socket) => {
    if (!app.request.io) {
      app.request.io = io;
    }

    ArduinoSocket(app.request, socket);
  });

  await new Promise((resolve) =>
    http.listen({ port: process.env.PORT || 3030 }),
  )
    .then(() => {
      return { server, app };
    })

    .catch(() => {
      return { server, app };
    });
}

startApolloServer();
