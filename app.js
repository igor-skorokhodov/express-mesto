const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./routes/index.js");
const bodyParser = require("body-parser");

const { PORT = 3001 } = process.env;
const db = mongoose.connection;

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.user = {
    _id: "60b32a6039f379379c1af5a5",
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
