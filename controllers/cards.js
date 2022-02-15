const Card = require("../models/card")

// GET, .../cards
const getCards = async (req, res) => {
  try {
    const allCards = await Card.find({})
    if (allCards.length > 0) {
      res.send(allCards)
    } else {
      res.status(404).send({ message: "В базе нет ни одной карточки." })
    }
  } catch (e) {
    res.status(500).send({ message: "Ошибка на стороне сервера" })
    console.log(`Ошибка получения всех пользователей: ${e}`)
  }
}

// POST, .../cards
const createCard = async (req, res) => {
  try {
    const { name, link } = req.body
    const owner = req.user._id
    const card = await Card.create({ name, link, owner })
    if (card) {
      res.status(201).send(card)
    } else {
      res.status(404).send({ message: "Карточка не была создана." })
    }
  } catch (e) {
    res.status(500).send({ message: "Ошибка на стороне сервера" })
    console.log(`Ошибка создания карточки: ${e}`)
  }
}

// DELETE, .../cards/:cardId
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params
    const card = await Card.findByIdAndRemove(cardId)
    console.log(card)
    if (card) {
      res.send({
        message: "Пост удален",
      })
    } else {
      res.status(404).send("Не удалось удалить карточку.")
    }
  } catch (e) {
    res.status(500).send({ message: "Ошибка на стороне сервера" })
    console.log(`Ошибка удаления карточки: ${e}`)
  }
}

// PUT, .../cards/:cardId/likes
const putCardLike = async (req, res) => {
  try {
    const { cardId } = req.params
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    if (card) {
      res.send(card)
    } else {
      res.status(404).send({
        message:
          "Ошибка: эту карточку невозможно лайкнуть, потому что её не существует.",
      })
    }
  } catch (e) {
    res.status(500).send({ message: "Ошибка на стороне сервера" })
    console.log(`Ошибка установки лайка: ${e}`)
  }
}

// DELETE, .../cards/:cardId/likes
const deleteCardLike = async (req, res) => {
  try {
    const { cardId } = req.params
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    if (card) {
      res.send(card)
    } else {
      res.status(404).send({
        message:
          "Ошибка: эту карточку невозможно разлайкать, потому что её не существует.",
      })
    }
  } catch (e) {
    res.status(500).send({ message: "Ошибка на стороне сервера" })
    console.log(`Ошибка удаления лайка: ${e}`)
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
}
