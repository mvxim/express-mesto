const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { NOT_FOUND_ERROR, handleError } = require('../errors/errors');

const SALT_ROUNDS = 10;

// POST, .../sign-in
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Неправильные почта или пароль');
    }
    const user = await User.findUserByCredentials(email, password); // есть ли пользователь в базе?
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.status(200).send({ message: 'Аутентифицированы!', token });
    }
  } catch (error) {
    handleError(error, res);
  }
};

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
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name, about, avatar, email, password: hashedPass,
    });
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
      res.status(NOT_FOUND_ERROR).send({
        message: 'Не получится обновить аватар у пользователя, которого нет.',
      });
    }
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  login,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
