const express = require('express')
const router = express.Router()
const {
  Dashboard,
  Register,
  RegisterFunction,
  Login,
  Edit,
  EditFunction,
  Delete,
  Logout
} = require('../controller/mvcController')


router.get('/', Dashboard)
router.get('/login', Login)
router.get('/register', Register)
router.post('/register', RegisterFunction)
router.get('/edit', Edit)
router.post('/edit/:id', EditFunction)
router.post('/delete/:id', Delete)
router.get('/logout', Logout)


module.exports = router