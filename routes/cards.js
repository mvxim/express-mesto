const express = require('express');
const { celebrate } = require('celebrate');
const { joiCardScheme, joiCardIdScheme } = require('../utils/validation');

const cardsRouter = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', express.json(), celebrate(joiCardScheme), createCard);
cardsRouter.delete('/:cardId', celebrate(joiCardIdScheme), deleteCard);
cardsRouter.put('/:cardId/likes', celebrate(joiCardIdScheme), putCardLike);
cardsRouter.delete('/:cardId/likes', celebrate(joiCardIdScheme), deleteCardLike);

module.exports = cardsRouter;
