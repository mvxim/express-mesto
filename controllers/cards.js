const Card = require("../models/card")

const getCards = (req, res) => {
  res.send("Here are all cards")
}

const createCard = (req, res) => {

}
const deleteCard = (req, res) => {

}


module.exports = {
  getCards,
  createCard,
  deleteCard
}
