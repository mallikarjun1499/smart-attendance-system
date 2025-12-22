const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the MONGO_URI env variable.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not set in environment variables');
  }

  // Recommended options for mongoose 8+
  await mongoose.connect(uri);

  console.log('MongoDB connected');
}

module.exports = connectDB;








