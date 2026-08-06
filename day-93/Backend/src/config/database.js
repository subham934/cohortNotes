const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log("error connecting to database", err);
    });
}

module.exports = connectToDB;