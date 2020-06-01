const express = require('express');
const app = express();
const indexRouter = require('./router/index');
const userRouter = require('./router/user');

app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(8088);