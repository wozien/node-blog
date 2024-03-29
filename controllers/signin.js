const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const userService = require('../services/user')

const checkNotLogin = require('../middlewares/check').checkNoLogin;

router.get('/', checkNotLogin, (req, res) => {
  res.render('signin')
})

router.post('/', checkNotLogin, async (req, res, next) => {
  const name = req.fields.name
  const password = req.fields.password

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  try {
    const user = await userService.getUserByName(name) 
    if (!user) {
      req.flash('error', '用户不存在')
      return res.redirect('back')
    }

    if(sha1(password) !== user.password) {
      req.flash('error', '用户名或密码错误')
      return res.redirect('back')
    }

    req.flash('success', '登录成功')
    delete user.password
    req.session.user = user
    // 跳转到主页
    res.redirect('/posts')

  } catch(e) {
    next(e)
  }
})

module.exports = router