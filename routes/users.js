const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const method = require('../errors/validation-error');

const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  aboutUser,
} = require('../controllers/users');

userRoutes.get('/users', auth, getUsers);

userRoutes.get('/users/:userId',
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi.string().hex().length(24),
      })
      .unknown(true),
  }), auth, getUser);

userRoutes.get('/users/me', auth, aboutUser);

userRoutes.patch('/users/me',
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi.string().length(24),
      })
      .unknown(true),
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
      }),
  }), auth, updateUser);

userRoutes.patch('/users/me/avatar',
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi.string().length(24),
      })
      .unknown(true),
    body: Joi.object()
      .keys({
        link: Joi.string().required().custom(method),
      }),
  }), auth, updateAvatar);

module.exports = userRoutes;
