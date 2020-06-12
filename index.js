const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const router = require('./router')
const pkg = require('./package')

const app = express()

app.set('views', path.join(__dirname, 'views'))  // 设置模版目录
app.set('view engine', 'ejs')           // 设置模版引擎ejs

// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')))

// session 中间件
app.use(session({
  name: config.session.key,         // session_id 存在在cookie的名称
  secret: config.session.secret,    // 加密密钥
  resave: true,
  saveUninitialized: false,         // 未登录也创建一个session
  cookie: {
    maxAge: config.session.maxAge    // cookie过期时间
  },
  store: new MongoStore({            // 将session存储到mongodb
    url: config.mongodb
  })
}))

// flash 中间件
app.use(flash())

// 全局渲染变量
app.locals.blog = {
  title: pkg.title,
  description: pkg.description
}

// 添加模版必须的3个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
})

// 路由
router(app)

app.listen(config.port, () => console.log(`Web Server listening on ${config.port}`))
