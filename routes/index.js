const routerIndex = require('express').Router();
const userRoutes = require('../routes/users.js');
const cardRoutes = require('../routes/cards.js');

routerIndex.use('/users', userRoutes);

routerIndex.use('/cards', cardRoutes);

module.exports = routerIndex;