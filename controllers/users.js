const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

// POST, .../signin
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Неправильные почта или пароль'); // 400 Bad Request - нет почты или пароля
    }
    const user = await User.findUserByCredentials(email, password); // { _id: ..., name: ..., ...}
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'war_is_over_if_you_want_it',
        { expiresIn: '7d' },
      );

      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
        })
        .status(200).send({ message: 'Авторизация успешна.' });
    }
  } catch (error) {
    next(error);
  }
};

// GET, .../users
const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    if (allUsers) {
      res.send(allUsers);
    }
  } catch (error) {
    next(error);
  }
};

// GET, .../users/me

const getMyUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id);
    if (!currentUser) {
      throw new NotFoundError('Пользователя с вашим ID не существует!');
    }
    res.send(currentUser);
  } catch (error) {
    next(error);
  }
};

// GET, .../users/:userId
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(`Пользователь с id ${userId} не существует.`);
      // 404 NotFound — такой юзер не нашелся
    }
    res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан некорректный ID пользователя.'));
    } else {
      next(error);
    }
  }
};

// POST, .../signup
const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    if (!password) {
      throw new BadRequestError('Для регистрации нужен пароль.'); // 400 Bad Request - нет почты или пароля
    }
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name, about, avatar, email, password: hashedPass,
    });
    if (user) {
      res.status(201).send({ message: 'Регистрация успешна!' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные создания пользователя.'));
    } else if (error.code === 11000) {
      next(new ConflictError('Пользователь с таким имейлом уже зарегистрирован.'));
    } else {
      next(error);
    }
  }
};

// PATCH, .../users/me
const updateUser = async (req, res, next) => {
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
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные обновления информации пользователя.'));
    } else {
      next(error);
    }
  }
};

// PATCH, .../users/me/avatar
const updateUserAvatar = async (req, res, next) => {
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
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректная ссылка.'));
    } else {
      next(error);
    }
  }
};

const logout = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new UnauthorizedError('Нужно авторизоваться, чтобы взаимодействовать с защищенным роутом.');
      // 401 Unauthorized - запрос от неаутентифицированного пользователя
    }
    res.clearCookie('token').send({ message: 'Разлогинено!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getUsers,
  getMyUser,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  logout,
};
