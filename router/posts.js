const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin;

// /posts  获取所有文章
router.get('/', checkLogin, (req, res, next) => {
  res.send('主页')
})

module.exports = router