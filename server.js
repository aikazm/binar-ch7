require('dotenv').config()

const express = require('express')
const app = express()
const db = require('./models')
const session = require('express-session')
const flash = require('connect-flash')
const mvcRouter = require('./routes/mvcRouter')
const mcrRouter = require('./routes/mcrRouter')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(flash());

app.set('view engine', 'ejs')
app.set('views', './views')


app.use(mvcRouter)
app.use(mcrRouter)


const PORT = process.env.PORT || 5000

db.sequelize.sync({
  // force: true
}).then(() => {
  console.log("Database Connected");
  app.listen(PORT, () => {
    console.log('====================================');
    console.log(`Server is Running at port ${PORT}`);
    console.log('====================================');
  })
}).catch((error) => {
  console.log(error);
})

