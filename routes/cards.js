const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
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
        link: Joi.string().required(),
      })
      .unknown(true),
  }),
  auth,
  createCard,
);
cardRoutes.delete('/cards/:cardId', auth, deleteCard);
cardRoutes.put('/cards/:cardId/likes', auth, likeCard);
cardRoutes.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = cardRoutes;
