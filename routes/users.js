const express = require('express');

const usersRouter = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', express.json(), updateUser);
usersRouter.patch('/me/avatar', express.json(), updateUserAvatar);

module.exports = usersRouter;
