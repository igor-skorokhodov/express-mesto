const User = require("../models/user.js");
const reg = /^(ftp|http|https):\/\/[^ "]+$/;

function getUsers(req, res) {
  return User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: "На сервере произошла ошибка!" });
    });
}

function getUser(req, res) {
  const id = req.params.userId;

  return User.findById(id)
    .then((user) => {
      console.log(user);
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ message: "Нет такого пользователя!" });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(404)
          .send({ message: `Нет такого юзера! Ошибка ${err.name}` });
      }
      else {
        res.status(500).send({ message: `На сервере произошла ошибка ${err.name}!` });
      }
    });
}

function createUser(req, res) {
  return User.create({ ...req.body })
    .then((user) => {
      if (!reg.test(req.body.avatar)) {
        res.status(400).send({ message: "Введены некорректные данные!" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (!reg.test(req.body.avatar)) {
        res.status(400).send({ message: "Введены некорректные данные!" });
      }
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: `Введены некорректные данные! Ошибка ${err.name}` });
      }
      else {
        res.status(500).send({ message: `На сервере произошла ошибка ${err.name}!` });
      }
    });
}

function updateUser(req, res) {
  const id = req.params.userId;

  return User.findByIdAndUpdate(id)
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ message: "Нет такого пользователя!" });
    })
    .catch((err) => {
      res.status(500).send({ message: "На сервере произошла ошибка!" });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
};
