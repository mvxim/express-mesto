const express = require("express")
const usersRouter = express.Router()
const { getUsers, getUserById, createUser } = require("../controllers/user")

usersRouter.get("/", getUsers)
usersRouter.get("/:id", getUserById)
usersRouter.post("/", createUser)

module.exports = usersRouter
