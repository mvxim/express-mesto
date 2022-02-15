const processHandler = require('process');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;

processHandler.on('uncaughtException', (err, origin) => {
  console.log(
    `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  );
});

const app = express();

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to DB');
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
};
main();

app.use((req, res, next) => {
  req.user = {
    _id: '620bb5818f3d4dcf698dbaaf',
  };
  next();
});

app.use(router);
