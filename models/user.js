const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
  },
});

// POST, .../sign-in. Если юзер есть в базе по почте, то считаем хеш его пароля и сравниваем с базой
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Неправильные почта или пароль');
  }
  const isAuthenticated = await bcrypt.compare(password, user.password);
  if (!isAuthenticated) {
    throw new Error('Статик метод модели: неправильные почта или пароль');
  }
  return isAuthenticated;
};
module.exports = mongoose.model('user', userSchema);
