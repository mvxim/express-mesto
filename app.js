require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const { handleError } = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;

const app = express();

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await app.listen(PORT);
};
main();

app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(handleError);
