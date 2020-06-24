const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')

const mongolass = new Mongolass()
mongolass.connect(config.mongodb) 

// 用户表scheme
exports.User = mongolass.model('User', {
  name: { type: 'string', require: true },
  password: { type: 'string', require: true },
  avatar: { type: 'string', require: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', require: true }
})
// 用name作为索引
exports.User.index({ name: 1 }, { unique: true }).exec()
