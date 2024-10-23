const mongoose = require('mongoose');
const config = require('./env/development');

module.exports = function() {
  mongoose
    .connect(config.mongoDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection Successful to MongoDB");
    })
    .catch((err) => {
      console.error("Connection Error:", err.message);
    });

  mongoose.connection.on('error', err => {
    console.error(`Connection Error: ${err}`);
  });
};
