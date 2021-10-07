const mongoose = require("../index");

//define schema for iot collections
const SystemLogSchema = new mongoose.Schema({
  name: String,
  log: String,
  time: Number,
});

const systemLog = new mongoose.model("systemlog", SystemLogSchema);

module.exports = systemLog;
