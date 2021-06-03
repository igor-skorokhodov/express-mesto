const Card = require("../models/card.js");
const reg = /^(ftp|http|https):\/\/[^ "]+$/;

function getCards(req, res) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res
        .status(500)
        .send({ message: `На сервере произошла ошибка! ${err.name}` });
    });
}

function createCard(req, res) {
  return Card.create({ ...req.body })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (!reg.test(req.body.link)) {
        res
          .status(400)
          .send({ message: `Введены некорректные данные! Ошибка ${err.name}` });
      }
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: `Введены некорректные данные! Ошибка ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `На сервере произошла ошибка ${err.name}!` });
      }
    });
}

function deleteCard(req, res) {
  const id = req.params.cardId;
  return Card.findByIdAndRemove(id)
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: `Нет такой карточки! Ошибка ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `На сервере произошла ошибка ${err.name}!` });
      }
    });
}

function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: `Нет такой карточки! Ошибка ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `На сервере произошла ошибка ${err.name}!` });
      }
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: `Нет такой карточки! Ошибка ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `На сервере произошла ошибка ${err.name}!` });
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
