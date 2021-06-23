/* eslint-disable no-underscore-dangle */
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ReqError = require('../errors/req-error');
const AuthError = require('../errors/auth-error');
const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
}

function getUser(req, res, next) {
  const id = req.params.userId;

  return User.findById(id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqError('неверно написан ID'));
      } else {
        next(err);
      }
    });
}

function aboutUser(req, res, next) {
  const id = req.user._id;

  return User.findById(id)
    .then((user) => res.status(200).send({ user }))
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ReqError('Email или пароль не могут быть пустыми');
  }

  if (validator.isEmail(email) === false) {
    throw new ReqError('Email не корректен');
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const id = req.user;
  console.log(req.user._id)

  return User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqError('ошибка валидации'));
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const id = req.user;

  return User.findByIdAndUpdate(
    id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqError('ошибка валидации'));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ReqError('Email или пароль не могут быть пустыми');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError('Неправильные почта или пароль');
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        });
        res.send({ token: token, user: user });
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqError('ошибка валидации'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  aboutUser,
};
