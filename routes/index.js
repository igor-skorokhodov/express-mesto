const router = require('express').Router();
const userRoutes = require('../routes/users.js');
const cardRoutes = require('../routes/cards.js');

router.use(userRoutes);

router.use(cardRoutes);

module.exports = router;