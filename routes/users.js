const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

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
    user: Joi.object()
      .keys({
        _id: Joi.string().hex().min(24).max(24),
      })
      .unknown(true),
  }), auth, getUser);

userRoutes.get('/users/me', auth, aboutUser);
userRoutes.patch('/users/me', auth, updateUser);
userRoutes.patch('/users/me/avatar', auth, updateAvatar);

module.exports = userRoutes;
