const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin;

// /comments
router.post('/', checkLogin, (req, res) => {
  res.send('创建留言')
})

router.get('/:commentId/remove', checkLogin, (req, res) => {
  res.send('删除留言')
})

module.exports = router