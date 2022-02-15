const User = require('../models/user');
const { NOT_FOUND_ERROR, handleError } = require('../errors/errors');

// GET, .../users
const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers) {
      res.send(allUsers);
    }
  } catch (error) {
    handleError(error, res);
  }
};

// GET, .../users/:userId
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(NOT_FOUND_ERROR).send({
        message: `Пользователь с id ${req.params.userId} не существует.`,
      });
    }
  } catch (error) {
    handleError(error, res);
  }
};

// POST, .../users
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    if (user) {
      res.status(201).send(user);
    }
  } catch (error) {
    handleError(error, res);
  }
};

// PATCH, .../users/me
const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (updatedUser) {
      res.send(updatedUser);
    }
  } catch (error) {
    handleError(error, res);
  }
};

// PATCH, .../users/me/avatar
const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(NOT_FOUND_ERROR).send({ message: 'Не получится обновить аватар у пользователя, которого нет.' });
    }
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
