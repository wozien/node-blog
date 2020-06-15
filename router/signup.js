const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNoLogin;

router.get('/', checkNotLogin, (req, res) => {
  res.render('signup')
})

router.post('/', checkNotLogin, (req, res) => {
  res.send('注册')
})

module.exports = router