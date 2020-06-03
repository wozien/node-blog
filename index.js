const path = require('path');
const express = require('express');
const app = express();
const indexRouter = require('./router/index');
const userRouter = require('./router/user');

app.set('views', path.join(__dirname, 'views'));  // 设置模版目录
app.set('view engine', 'ejs');           // 设置模版引擎ejs

app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(8088, () => console.log('Web Server listening on 8088'));