const { Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const joiSignUpScheme = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Неправильный формат ссылки');
      }
      return value;
    }),
  }),
};

const joiSignInScheme = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};

const joiCardScheme = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Неправильный формат ссылки');
      }
      return value;
    }),
  }),
};

const joiCardIdScheme = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
};

const joiUserIdScheme = {
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
};

const joiUserInfoScheme = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
};

const joiUserAvatarScheme = {
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Неправильный формат ссылки');
      }
      return value;
    }),
  }),
};

module.exports = {
  joiSignUpScheme,
  joiSignInScheme,
  joiCardScheme,
  joiCardIdScheme,
  joiUserIdScheme,
  joiUserInfoScheme,
  joiUserAvatarScheme,
};
