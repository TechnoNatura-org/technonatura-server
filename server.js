const express = require('express');
const App = express();

App.get('/', (req, res) => {
  res.json({ message: 'hey' });
});

App.listen(process.env.PORT || 3000, () => {});
