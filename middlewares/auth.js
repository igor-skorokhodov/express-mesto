const jwt = require('jsonwebtoken');
const authError = require('../errors/auth-error.js')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new authError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new authError('Необходима авторизация');
  }

  req.user = payload;

  next();
};