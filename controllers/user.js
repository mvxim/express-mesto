const User = require("../models/user")

const getUsers = (req, res) => {
  res.send("Here are all users")
}

const getUserById = (req, res) => {

}

const createUser = (req, res) => {

}


module.exports = {
  getUsers,
  getUserById,
  createUser
}
