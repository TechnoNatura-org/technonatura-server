const express = require('express');
const app = express();
const PostRouter = require('./routes/post');
const AuthRouter = require('./routes/auth');
const mongoose = require('mongoose');
const db = mongoose.connection;

let MongoDB_URI =
  process.env.mongoDB_URI ||
  'mongodb://127.0.0.1:27017/mts-technonatura-server';
mongoose.connect(MongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());

db.on('error', (err) => console.error('error when connecting to db'));
db.once('open', () => console.log('connected to mongoose'));

app.use('/', PostRouter);
app.use('/', AuthRouter);

app.get('/', (req, res) => {
  res.json({ message: 'hey' });
});
app.listen(process.env.PORT || 3000, () => {});
