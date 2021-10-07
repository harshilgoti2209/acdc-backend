const mongoose = require("../index");

//define schema for iot collections
const iotSchema = new mongoose.Schema({
  name: String,
  code:String,
  user:String,
  nick: String,
  limit: Number,
  current: Number,
  status: Number,
  slevel:Number,
  slimit:Number,
  sstatus: Number,
  mode: Number,
  index:Number,
  percent:Number,
});

const Iot = new mongoose.model("Iot", iotSchema);

module.exports = Iot;
