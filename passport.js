const { User } = require('./models/User.model');
let LocalStrategy = require('./strategies/local');

const LocalStrategy = new localStrategy((username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    console.log('username', username);

    if (err) throw err;
    if (!user) return done(null, false);
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw err;
      if (result === true) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
});

module.exports = function (passport) {
  passport.use(LocalStrategy);
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
};
