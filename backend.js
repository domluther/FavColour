const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// TODO Model last - most to refactor
const { MongoClient } = require('mongodb');

app = express();
app.use(morgan('tiny'));

const PORT = process.env.PORT || 5432;

const { connectDB } = require('./config/db');

const homeRouter = require('./routes/home');
const colourRouter = require('./routes/api');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

connectDB();

app.use('/', homeRouter);
app.use('/colour/', colourRouter);

app.listen(PORT, (req, res) => {
  console.log(`Listening on http://localhost:${PORT}`);
});
