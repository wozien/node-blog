const fs = require('fs/promises')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNoLogin
const user = require('../services/user')
const { storeFile } = require('../services/attachment')

router.get('/', checkNotLogin, (req, res) => {
  res.render('signup')
})

// post 用户注册
router.post('/', checkNotLogin, async (req, res, next) => {
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path
  let password = req.fields.password
  const repassword = req.fields.repassword

  // 参数校验
  try {
    if(!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名称请限制在 1-10 个字符')
    } 
    if(['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是m、f或x')
    }
    if(!(bio.length >= 1 && bio.length <=30)) {
      throw new Error('个人简介请限制在1-30个字符')
    }
    if(!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if(password.length < 6) {
      throw new Error('密码至少6个字符')
    }
    if(password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    // 注册失败，删除上传的头像
    if(avatar) {
      fs.unlink(avatar)
    }
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 写入数据库用户数据
  let userData = {
    name,
    password: sha1(password),
    gender,
    bio
  }

  try {
    const avatarId = await storeFile(avatar)
    userData.avatar = avatarId 
    fs.unlink(avatar)

    const result = await user.create(userData)
    delete result.password
    // 创建成功后把用户信息存在session内存中
    // 下一次请求过来根据前端cookie能拿到对应的session
    req.session.user = result
    req.flash('success', '注册成功')
    // 跳转到首页
    res.redirect('/posts')
    
  } catch(e) {
    // console.log(e.message)
    // 注册失败，删除上传的头像
    fs.unlink(req.files.avatar.path)
    // 用户名被占用
    if(e.message.match('duplicate key')) {
      req.flash('error', '用户名被占用')
      return res.redirect('/signup')
    }
    next(e)
  }

})

module.exports = router