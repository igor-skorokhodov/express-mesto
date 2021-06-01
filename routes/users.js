const userRoutes = require("express").Router();

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
} = require("../controllers/users.js");

userRoutes.get("/users", getUsers);
userRoutes.get("/users/:userId", getUser);
userRoutes.post("/users", createUser);
userRoutes.patch("/users/me", updateUser);
userRoutes.patch("/users/avatar", updateUser);

module.exports = userRoutes;
