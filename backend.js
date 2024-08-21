import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(morgan('tiny'));

const PORT = process.env.PORT || 5432;

import connectDB from './config/db.js';

import rootRouter from './routes/index.js';
import colourRouter from './routes/colour.js';

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

connectDB();

app.use('/', rootRouter);
app.use('/colour/', colourRouter);

app.listen(PORT, (req, res) => {
  console.log(`Listening on http://localhost:${PORT}`);
});
