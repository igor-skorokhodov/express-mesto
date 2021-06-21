const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const router = require('./routes/index');
const NotError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger'); 
const cors = require('cors');
const options = {  
  origin: [    
    'http://mesto.ivladsk.nomoredomains.club'      
  ],  
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],  
  preflightContinue: false,  
  optionsSuccessStatus: 204,  
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],  
  credentials: true,
};

const { PORT = 3001 } = process.env;

const app = express();

app.use('*', cors(options))

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use(router);

app.post('/signin', login);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).unknown(true),
  }),
  createUser);

app.get('*', () => {
  throw new NotError('страница не найдена');
});

app.use(errorLogger);

app.use(errors());


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер работает на порту ${PORT}`);
});
