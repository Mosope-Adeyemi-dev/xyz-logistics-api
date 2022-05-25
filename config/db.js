const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connected");
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
