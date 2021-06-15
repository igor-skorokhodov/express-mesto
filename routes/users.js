const userRoutes = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  aboutUser,
} = require('../controllers/users');

userRoutes.get('/users', auth, getUsers);
userRoutes.get('/users/:userId', auth, getUser);
userRoutes.get('/users/me', auth, aboutUser);
userRoutes.patch('/users/me', auth, updateUser);
userRoutes.patch('/users/me/avatar', auth, updateAvatar);

module.exports = userRoutes;
