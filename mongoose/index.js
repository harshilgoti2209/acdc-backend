const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/acdc", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successfully...");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
