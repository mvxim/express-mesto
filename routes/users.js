const express = require('express');
const { celebrate, Joi } = require('celebrate');

const usersRouter = express.Router();
const {
  getUsers,
  getMyUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const joiUserIdSchema = {
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
};

const joiUserInfoSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

usersRouter.get('/', getUsers);
usersRouter.get('/me', getMyUser);
usersRouter.get('/:userId', celebrate(joiUserIdSchema), getUserById);
usersRouter.patch('/me', express.json(), celebrate(joiUserInfoSchema), updateUser);
usersRouter.patch('/me/avatar', express.json(), updateUserAvatar);

module.exports = usersRouter;
