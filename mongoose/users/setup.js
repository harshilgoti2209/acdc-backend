const mongoose = require("../index");

//define schema for iot collections
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: Number,
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
