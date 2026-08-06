const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  // we also need to check if the database dont have multiple user with same email, for that we need to make changes in schema
  email: {
    type: String,
    unique: [true, "With this email user account already exists"],
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
