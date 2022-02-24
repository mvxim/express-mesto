const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardsRouter = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

const joiCardSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
};

const joiCardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
};

cardsRouter.get('/', getCards);
cardsRouter.post('/', express.json(), celebrate(joiCardSchema), createCard);
cardsRouter.delete('/:cardId', celebrate(joiCardIdSchema), deleteCard);
cardsRouter.put('/:cardId/likes', celebrate(joiCardIdSchema), putCardLike);
cardsRouter.delete('/:cardId/likes', celebrate(joiCardIdSchema), deleteCardLike);

module.exports = cardsRouter;
