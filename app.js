const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./routes/index.js");
const bodyParser = require("body-parser");
const { createUser, login } = require("./controllers/users.js");
const { celebrate, Joi } = require("celebrate");

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

app.use(router);
app.post("/signin", login);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).unknown(true),
  }),
  createUser
);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
