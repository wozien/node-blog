const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, (req, res) => {
  res.send('退出页')
})

module.exports = router