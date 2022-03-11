const express = require('express')
const router = express.Router()
const {
  Register,
  Login,
  CreateRoom,
  PlayGameRoom
} = require('../controller/mcrController')
const verifyToken = require('../middleware/verifyToken')


// fungsi untuk register
router.post('/register', Register)
// untuk fungsi login
router.post('/login', Login)
// untuk create room baru
// panggil verifyToken Middleware untuk verifikasi token
// dan juga agar controller create room bisa mengakses data user yang login
// lewat req.user
router.post('/room/create', verifyToken, CreateRoom)
// route untuk main game
router.post('/room/play', verifyToken, PlayGameRoom)

module.exports = router