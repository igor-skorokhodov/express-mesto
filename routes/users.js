const userRoutes = require("express").Router();

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users.js");

userRoutes.get("/users", getUsers);
userRoutes.get("/users/:userId", getUser);
userRoutes.post("/users", createUser);
userRoutes.patch("/users/me", updateUser);
userRoutes.patch("/users/me/avatar", updateAvatar);

module.exports = userRoutes;
