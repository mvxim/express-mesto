const express = require("express")
const cardsRouter = express.Router()
const { getCards, createCard, deleteCard } = require("../controllers/cards")

cardsRouter.get("/", getCards)
cardsRouter.post("/", createCard)
cardsRouter.delete("/:cardId", deleteCard)

module.exports = cardsRouter
