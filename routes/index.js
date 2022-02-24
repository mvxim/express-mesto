const express = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');

const joiSignUpScheme = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2),
  }),
};

const joiSignInScheme = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};

const router = express.Router();

router.post('/sign-up', express.json(), celebrate(joiSignUpScheme), createUser);
router.post('/sign-in', express.json(), celebrate(joiSignInScheme), login);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use((req, res) => {
  res.status(404).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

module.exports = router;
