const mongoose = require("../index");

//define schema for iot collections
const logSchema = new mongoose.Schema({
  name: String,
  code:String,
  switchStatus: Number,
  meterCount: Number,
  index: Number,
  timeStamp: Number,
});

const Log = new mongoose.model("Log", logSchema);

module.exports = Log;
