const Card = require("../models/card.js");
const reg = /^(ftp|http|https):\/\/[^ "]+$/;
const reqError = require("../errors/req-error.js");
const authError = require("../errors/auth-error.js");
const notFoundError = require("../errors/not-found-err.js");

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}

function createCard(req, res) {
  return Card.create({ ...req.body })
    .then((card) => {
      res.status(200).send({ data: card });
      if (!reg.test(req.body.link)) {
        throw new reqError("Введена некорректная ссылка");
      }
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  const id = req.params.cardId;
  const userId = req.user._id;

  return Card.findById(id)
    .then((card) => {
      if (card.owner === userId) {
        return Card.findByIdAndRemove(id)
          .orFail(new notFoundError("Карточка не найдена"))
          .then((card) => {
            res.status(200).send({ card });
          })
          .catch(next);
      } else {
        throw new authError("Нет прав на удаление карточки");
      }
    })
    .catch(next);
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body.user._id } },
    { new: true }
  )
    .orFail(new notFoundError("Карточка не найдена"))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body.user._id } },
    { new: true }
  )
    .orFail(new notFoundError("Карточка не найдена"))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
