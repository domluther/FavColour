const mongoose = require('mongoose');

const connectDB = async () => {
  const URI = process.env.MONGO_URI;
  try {
    console.log('Connected to DB');
    const conn = await mongoose.connect(URI, { dbName: 'ColourVoter' });
    console.log(`Connected to ${conn.connection.name}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = { connectDB };
