const jwt = require('jsonwebtoken');
const { handleError } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' }); // 401 Unauthorized - отстутствие токена
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'war_is_over_if_you_want_it');
  } catch (error) {
    handleError(error, res); // 401 Unauthorized – невалидный токен
  }
  req.user = payload; // { _id: 'string', iat: created, exp: expires }
  return next();
};
