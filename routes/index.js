const express = require('express');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');

const router = express.Router();

router.post('/sign-in', express.json(), login);
router.post('/sign-up', express.json(), createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use((req, res) => {
  res.status(404).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

module.exports = router;
