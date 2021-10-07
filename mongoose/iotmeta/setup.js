const mongoose = require("../index");

//define schema for iot collections
const iotmetaSchema = new mongoose.Schema({
  name: String,
  address: String,
  user: String,
  actived: Number,
});

const Iotmeta = new mongoose.model("Iotmeta", iotmetaSchema);

module.exports = Iotmeta;
