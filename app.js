
const path = require('path')
const express = require('express')
const session = require('express-session')
const formidable = require('express-formidable')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const router = require('./controllers')
const pkg = require('./package')
require('dotenv').config()
const db = require('./utils/db')
db.connect()

const app = express()

app.set('views', path.join(__dirname, 'views'))  // 设置模版目录
app.set('view engine', 'ejs')           // 设置模版引擎ejs

// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')))

// session 中间件
app.use(session({
  name: process.env.SESSION_KEY,         // session_id 存在在cookie的名称
  secret: process.env.SESSION_SECRET,    // 加密密钥
  resave: true,
  saveUninitialized: false,         // 未登录也创建一个session
  cookie: {
    maxAge: 30*24*3600*1000    // cookie过期时间
  },
  store: new MongoStore({            // 将session存储到mongodb
    url: process.env.DB_ADDR
  })
}))

// flash 中间件 基于express-session ，必须放在后面
// req.flash(key, value) 相当于在 req.session.flash[key] = value
// req.flash(key) 获取  req.session.flash[key] 并且delete掉
app.use(flash())

// 处理表单以及文件上传的中间件
app.use(formidable({
  uploadDir: path.join(__dirname, 'public/img'),  // 文件上传目录
  keepExtensions: true     // 保持上传的后缀名
}))

// 全局渲染变量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模版必须的3个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 路由
router(app)

const port = process.env.APP_PORT || 8080
app.listen(port, () => console.log(`Web Server listening on ${port}`))
