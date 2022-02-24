require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;

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

// app.use((req, res, next) => {
//   req.user = {
//     _id: '620bb5818f3d4dcf698dbaaf',
//   };
//   next();
// });

app.use(cookieParser());
app.use(router);
app.use((err, req, res) => {
  res.status(err.statusCode).send(err.message);
});
