import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'hey' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
