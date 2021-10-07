const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.listen(PORT);

module.exports = app;
