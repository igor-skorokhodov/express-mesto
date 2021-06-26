/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const ReqError = require('../errors/req-error');
const ForbiddenError = require('../errors/forb-error');
const NotFoundError = require('../errors/not-found-err');

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  return Card.create({ ...req.body})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
console.log(err)
        next(new ReqError('ошибка валидации'));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const id = req.params.cardId;
  const userId = req.user._id;

  return Card.findById(id)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() === userId) {
        return Card.findByIdAndRemove(id)
          .orFail(new ReqError('Карточка не найдена'))
          .then((data) => {
            res.status(200).send({ data });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new ReqError('Карточка не найдена'));
            } else {
              next(err);
            }
          });
      }
      return next(new ForbiddenError('Нет прав на удаление карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ReqError('Карточка не найдена'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new ReqError('Карточка не найдена'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка не найдена'));
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
