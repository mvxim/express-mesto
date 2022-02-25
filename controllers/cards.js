const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// GET, .../cards
const getCards = async (req, res, next) => {
  try {
    const allCards = await Card.find({}).populate(['owner', 'likes']);
    if (!allCards) {
      throw new Error();
    }
    res.send(allCards);
  } catch (error) {
    next(error);
  }
};

// POST, .../cards
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    if (card) {
      res.status(201).send(card);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при создании карточки'));
    }
    next(error);
  }
};

// DELETE, .../cards/:cardId
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id; // достать user._id и сравнить с id овнера карточки
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточки с таким ID не существует.');
    }
    const cardOwnerId = card.owner.valueOf();
    if (cardOwnerId !== userId) {
      throw new ForbiddenError('Нельзя удалить чужую карточку.');
      // 403 Forbidden — авторизован, но изменяет чужой ресурс
    }
    const isRemoved = await Card.findByIdAndRemove(cardId);
    if (!isRemoved) {
      throw new NotFoundError('Передан неверный айди карточки, поэтому не получилось удалить.');
    }
    res.send({
      message: 'Пост удален',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Передан некорректный ID пользователя.' });
    }
    next(error);
  }
};

// PUT, .../cards/:cardId/likes
const putCardLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!card) {
      throw new NotFoundError('Передан неверный айди карточки, поэтому не получилось поставить лайк.');
    }
    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Передан некорректный ID пользователя.' });
    }
    next(error);
  }
};

// DELETE, .../cards/:cardId/likes
const deleteCardLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!card) {
      throw new NotFoundError('Передан неверный айди карточки, поэтому не получилось убрать лайк.');
    }
    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Передан некорректный ID пользователя.' });
    }
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
