const User = require('../models/user');

// GET, .../users
const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length > 0) {
      res.send(allUsers);
    } else {
      res.status(404).send({ message: 'В базе нет ни одного пользователя.' });
    }
  } catch (e) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
    console.log(`Ошибка получения всех пользователей: ${e}`);
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
      res.status(404).send({
        message: `Пользователь с id ${req.params.userId} не существует.`,
      });
    }
  } catch (e) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
    console.log(
      `Ошибка получения пользователя по id ${req.params.userId}: ${e}`,
    );
  }
};

// POST, .../users/me
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    if (user) {
      res.status(201).send(user);
    } else {
      res.status(400).send({ message: 'Пользователь не был создан.' });
    }
  } catch (e) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
    console.log(`Ошибка создания пользователя: ${e}`);
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
        upsert: true,
      },
    );
    if (updatedUser) {
      console.log(updatedUser);
      res.send(updatedUser);
    } else {
      res.status(400).send({ message: 'Пользователь не был обновлен.' });
    }
  } catch (e) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
    console.log(`Ошибка обновления пользователя: ${e}`);
  }
};

// PATCH, .../users/me/avatar
const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      req.user._id,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(400).send({ message: 'Аватар не был обновлен.' });
    }
  } catch (e) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
    console.log(`Ошибка обновления аватара пользователя: ${e}`);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
