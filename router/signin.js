const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNoLogin;

router.get('/', checkNotLogin, (req, res) => {
  res.send('登录页')
})

router.post('/', checkNotLogin, (req, res) => {
  res.send('登录')
})

module.exports = router