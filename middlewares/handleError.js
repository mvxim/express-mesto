module.exports.handleError = (err, req, res, next) => {
  // ↓ Эти условия выглядят как шляпа. Буду рад замечанию, чтобы исправить их. Нужна идея, как.
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Передан некорректный ID ресурса.' });
  }
  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким имейлом уже зарегистрирован.' });
  }
  res.status(err.statusCode || 500).send({ message: err.message || 'На сервере произошла ошибка.' });
  next();
};
