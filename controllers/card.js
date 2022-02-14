const Card = require("../models/card")

// GET, .../cards
const getCards = async (req, res) => {
  try {
    const allCards = await Card.find({})
    if (allCards.length > 0) {
      res.send(allCards)
    } else {
      res.status(404).send(`В базе нет ни одной карточки.`)
    }
  } catch (e) {
    res.status(500).send({ message: "Ошибка на стороне сервера" })
    console.log(`Ошибка получения всех пользователей: ${ e }`)
  }
}

// POST, .../cards
const createCard = (req, res) => {

}

// DELETE, .../cards/:cardId
const deleteCard = (req, res) => {

}


module.exports = {
  getCards,
  createCard,
  deleteCard
}
