const express = require('express');
const mongoose = require("mongoose")
const { PORT = 3000 } = process.env;

const app = express();

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to DB")
  await app.listen(PORT)
  console.log(`App listening on port ${PORT}`)
}

main()
