const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./routes/index.js");
//const routerUsers = require("./routes/users");
//const routerCards = require("./routes/cards");
const bodyParser = require("body-parser");

const { PORT = 3001 } = process.env;
const db = mongoose.connection;

const app = express();

app.use(bodyParser.json());

db.on('error', err => {
  console.log('error', err)
})

db.once('open', () => {
  console.log('we are connected')
})

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(express.static(path.join(__dirname, "public")));

app.use(router);
//app.use(routerUsers);
//app.use(routerCards);


app.use((req, res, next) => {
  req.user = {
    _id: '60b32a6039f379379c1af5a5' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.all('/', function (req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // pass control to the next handler
});


app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
