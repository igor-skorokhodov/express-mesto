const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const method = require('../errors/validation-error');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', auth, getCards);

cardRoutes.post(
  '/cards',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().custom(method),
        owner: Joi.string(),
      })
      .unknown(true),
  }),
  auth,
  createCard,
);

cardRoutes.delete('/cards/:cardId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().hex().length(24),
      })
      .unknown(true),
  }), auth, deleteCard);

cardRoutes.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().hex().length(24),
      })
      .unknown(true),
  }), auth, likeCard);

cardRoutes.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().hex().length(24),
      })
      .unknown(true),
  }), auth, dislikeCard);

module.exports = cardRoutes;
