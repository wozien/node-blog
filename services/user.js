/**
 * user service
 */
const User = require('../models/User')

const create = async (user) => {
  const result = await User.create(user)
  return result
}

const getUserByName = async (name) => {
  const result = User.findOne({ name })
  return result
}

module.exports = {
  create,
  getUserByName
}