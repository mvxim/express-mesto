const express = require('express');
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser, logout } = require('../controllers/users');
const { joiSignUpScheme, joiSignInScheme } = require('../utils/validation');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

router.post('/signup', express.json(), celebrate(joiSignUpScheme), createUser);
router.post('/signin', express.json(), celebrate(joiSignInScheme), login);

router.use(auth);
router.use('/logout', logout);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса'));
});

module.exports = router;
