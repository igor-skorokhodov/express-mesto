const Card = require("../models/card.js");
const reg = /^(ftp|http|https):\/\/[^ "]+$/;
const validator = require("validator");
const reqError = require("../errors/req-error.js");
const authError = require("../errors/auth-error.js");
const notFoundError = require("../errors/not-found-err.js");

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  return Card.create({ ...req.body, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new reqError("ошибка валидации"));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const id = req.params.cardId;
  const userId = req.user._id;

  return Card.findById(id)
    .orFail(new notFoundError("Карточка не найдена"))
    .then((card) => {
      if (card.owner === userId) {
        return Card.findByIdAndRemove(id)
          .orFail(new notFoundError("Карточка не найдена"))
          .then((card) => {
            res.status(200).send({ card });
          })
          .catch((err) => {
            if (err.name === "CastError") {
              next(new notFoundError("Карточка не найдена"));
            } else {
              next(err);
            }
          });
      } else {
        console.log(card.owner);
        console.log(userId);
        next(new authError("Нет прав на удаление карточки"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new notFoundError("Карточка не найдена"));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new notFoundError("Карточка не найдена"))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new notFoundError("Карточка не найдена"));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new notFoundError("Карточка не найдена"))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new reqError("неверно написан ID"));
      } else {
        next(err);
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
