/**
 * 用户模型
 */

const mongoose = require('mongoose')
const modelTransformer = require('../utils/model-transformer')

const schema = new mongoose.Schema({
  name: {
    type: 'string', 
    require: true
  },
  password: { 
    type: 'string', 
    require: true 
  },
  avatar: { 
    type: mongoose.Types.ObjectId,
    require: true 
  },
  gender: { 
    type: 'string', 
    enum: ['m', 'f', 'x'], 
    default: 'x' 
  },
  bio: { 
    type: 'string', require: true 
  }
}, {
  ...modelTransformer,
  timestamps: true,
})

// todo plugin

schema.index({ name: 1 }, { unique: true })

module.exports = mongoose.model('User', schema)