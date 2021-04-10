const express = require('express');
const app = express();
const PostRouter = require('./routes/post');
const AuthRouter = require('./routes/auth');
const passport = require('passport');
const mongoose = require('mongoose');
const db = mongoose.connection;

require('./passport')(passport);

// app.get('*', (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
//       if (err) {
//         res.locals.user = null;
//         next();
//       } else {
//         let user = await User.findById(decodedToken.id);
//         res.locals.user = user;
//         next();
//       }
//     });
//   } else {
//     res.locals.user = null;
//     next();
//   }
// });

let MongoDB_URI =
  process.env.mongoDB_URI || 'mongodb://127.0.0.1:27017/UrlShortener';
mongoose.connect(MongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on('error', (err) => console.error('error when connecting to db'));
db.once('open', () => console.log('connected to mongoose'));

app.use('/', PostRouter);
app.use('/', AuthRouter);

app.get('/', (req, res) => {
  res.json({ message: 'hey' });
});
app.listen(process.env.PORT || 3000, () => {});
