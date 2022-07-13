const express = require("express")
const morgan = require("morgan")
const path = require("path");

const { connection } = require("./api/db")
const routes = require("./api/routes")
const app = express()

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", routes)

app.use((err, _, res, __) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

const PORT = process.env.PORT || 5000

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
}

connection.on("error", console.error.bind("Connection error: ", console))

connection.once("open", () => {
  console.log("Conected successfully to DB")
  app.listen(PORT, () => console.log(`Server listening to Cluster`))
})
