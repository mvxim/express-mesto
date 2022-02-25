const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
    validate: {
      validator(v) {
        return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?#?$/i.test(v);
      },
      message: (props) => `${props.value} — не ссылка, поэтому не проходит валидацию`,
    },
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
    minlength: 6,
    required: true,
    select: false,
  },
});

// POST, .../sign-in. Проверка, есть ли в базе такой пользователь, и верный ли его пароль
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Неправильные почта или пароль'); // 401 Unauthorized - неправильный емейл (не уточнять)
  }
  const isAuthenticated = await bcrypt.compare(password, user.password);
  if (!isAuthenticated) {
    throw new UnauthorizedError('Неправильные почта или пароль'); // 401 Unauthorized - неправильный пароль (не уточнять)
  }
  return user;
};
module.exports = mongoose.model('user', userSchema);
