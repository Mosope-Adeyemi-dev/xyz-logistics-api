const app = require('./app');
const { connectDB } = require('./config/db');

const port = process.env.PORT || 4000;

// Connect to database and start the server
connectDB()
  .then(() => {
    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log('Database connection failed!');
  });
