const express = require("express")
const cardsRouter = express.Router()
const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require("../controllers/cards")

cardsRouter.get("/", getCards)
cardsRouter.post("/", express.json(), createCard)
cardsRouter.delete("/:cardId", deleteCard)
cardsRouter.put("/:cardId/likes", putCardLike)
cardsRouter.delete("/:cardId/likes", deleteCardLike)

module.exports = cardsRouter
