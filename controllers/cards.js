const Card = require('../models/card');
const { NOT_FOUND_ERROR, handleError } = require('../errors/errors');

// GET, .../cards
const getCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    if (allCards) {
      res.send(allCards);
    }
  } catch (error) {
    handleError(error, res);
  }
};

// POST, .../cards
const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    if (card) {
      res.status(201).send(card);
    } else {
      res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не была создана.' });
    }
  } catch (error) {
    handleError(error, res);
  }
};

// DELETE, .../cards/:cardId
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);

    if (card) {
      res.send({
        message: 'Пост удален',
      });
    } else {
      res.status(NOT_FOUND_ERROR).send('Не удалось удалить карточку.');
    }
  } catch (error) {
    handleError(error, res);
  }
};

// PUT, .../cards/:cardId/likes
const putCardLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      res.status(NOT_FOUND_ERROR).send({
        message:
            'Ошибка: эту карточку невозможно лайкнуть, потому что её не существует.',
      });
    }
  } catch (error) {
    handleError(error, res);
  }
};

// DELETE, .../cards/:cardId/likes
const deleteCardLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      res.status(NOT_FOUND_ERROR).send({
        message:
            'Ошибка: эту карточку невозможно разлайкать, потому что её не существует.',
      });
    }
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
