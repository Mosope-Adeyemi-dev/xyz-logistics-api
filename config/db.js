const mongoose = require('mongoose');

const uri =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI_CLOUD
    : process.env.MONGODB_URI;

const connectDB = async () => {
  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('database connected');
    })
    .catch((err) => {
      throw new Error(err);
    });
};
const disconnectDB = async () => {
  return mongoose.disconnect();
};

module.exports = {
  connectDB,
  disconnectDB,
};
