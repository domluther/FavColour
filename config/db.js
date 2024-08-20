const mongoose = require('mongoose');

const connectDB = async () => {
  const URI = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(URI);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = { connectDB };
