const express = require('express');
const { celebrate } = require('celebrate');
const { joiUserIdScheme, joiUserInfoScheme, joiUserAvatarScheme } = require('../utils/validation');

const usersRouter = express.Router();
const {
  getUsers,
  getMyUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getMyUser);
usersRouter.get('/:userId', celebrate(joiUserIdScheme), getUserById);
usersRouter.patch('/me', express.json(), celebrate(joiUserInfoScheme), updateUser);
usersRouter.patch('/me/avatar', express.json(), celebrate(joiUserAvatarScheme), updateUserAvatar);

module.exports = usersRouter;
