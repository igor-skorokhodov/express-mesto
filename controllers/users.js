const User = require("../models/user.js");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const notFoundError = require("../errors/not-found-err.js");
const reqError = require("../errors/req-error.js");
const authError = require("../errors/auth-error.js");

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
    .orFail(new notFoundError("Пользователь не найден"))
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new reqError("неверно написан ID"));
      } else {
        next(err);
      }
    });
}

function aboutUser(req, res, next) {
  const id = req.user._id;

  return User.findById(id)
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new reqError("Email или пароль не могут быть пустыми");
  }

  if (validator.isEmail(email) === false) {
    throw new reqError("Email не корректен");
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const id = req.user._id;

  return User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new reqError("ошибка валидации"));
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const id = req.user._id;

  return User.findByIdAndUpdate(
    id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new reqError("ошибка валидации"));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new authError("Неправильные почта или пароль");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new authError("Неправильные почта или пароль");
        }
        const token = jwt.sign({ _id: user._id }, "some-secret-key", {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch(next);
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
