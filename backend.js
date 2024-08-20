const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// TODO Model last - most to refactor
const { MongoClient } = require('mongodb');

app = express();
app.use(morgan('tiny'));

const PORT = process.env.PORT || 5432;

const homeRouter = require('./routes/home');
const apiRouter = require('./routes/api');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

let coll;
async function connectToDB() {
  try {
    const URI = process.env.MONGO_URI;
    const client = new MongoClient(URI);
    const dbName = 'ColourVoter';
    const collName = 'colours';
    await client.connect();
    coll = client.db(dbName).collection(collName);
    console.log(`Connected to ${dbName}`);
    return coll;
  } catch (error) {
    console.error(`Failed to connect to DB - ${error}`);
    process.exit(1);
  }
}
// Need to connect
(async () => {
  coll = await connectToDB();
})();

app.use('/', homeRouter);

app.use('/api/', apiRouter);

app.listen(PORT, (req, res) => {
  console.log(`Listening on http://localhost:${PORT}`);
});
