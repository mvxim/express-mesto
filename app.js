const express = require("express")
const mongoose = require("mongoose")
const router = require("./routes")
const { PORT = 3000 } = process.env

const app = express()

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("Connected to DB")
  await app.listen(PORT)
  console.log(`Server is running on port ${ PORT }`)
}

main()

app.use(router)
