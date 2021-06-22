const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация 1');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthError('Необходима авторизация 2');
  }

  req.user = payload;

  next();
};
