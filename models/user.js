const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  gender: {
    type: String, // гендер — это строка
    enum: ['м', 'ж', 'другой'] // gender может принимать одно из трёх значений
  },
  age: { // у пользователя есть возраст
    type: Number, // возраст - число
    validate: { // опишем свойство validate
      validator(v) { // validator - функция проверки данных. v - значение свойства age
        return v >= 18; // если возраст меньше 18, вернётся false
      },
      message: 'Вам должно быть больше 18 лет!', // когда validator вернёт false, будет использовано это сообщение
    }
  },
  about: String, // тип — String
});
