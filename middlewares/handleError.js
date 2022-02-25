module.exports.handleError = (err, req, res, next) => {
  const code = err.statusCode || 500;
  const errMessage = code === 500 ? 'На сервере произошла ошибка.' : err.message;
  res.status(code).send({ message: errMessage });
  next();
};
