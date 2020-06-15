const User = require('../lib/mongo').User

module.exports = {
  // 创建用户
  create: function(user) {
    return User.create(user).exec()
  }
}