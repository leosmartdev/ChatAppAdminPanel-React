const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const connectDB = asyncHandler(async () => {
  mongoose.Promise = global.Promise;

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  const conn = await mongoose.connect(`${process.env.MONGO_URI}`, options);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
});

module.exports = connectDB;
