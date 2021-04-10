const express = require('express');
const app = express();

app.get('*', (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'hey' });
});

app.listen(process.env.PORT || 3000, () => {});
