/**
 * 附件模型
 */

const mongoose = require('mongoose')
const modelTransformer = require('../utils/model-transformer')

const schema = new mongoose.Schema({
  filename: {
    type: 'string',
    required: true
  },
  ext: {
    type: 'string'
  },
  data: {
    type: 'Buffer',
    required: true
  }
}, {
  ...modelTransformer,
  timestamps: true
})

schema.index({ filename: 1 })

module.exports = mongoose.model('Attachment', schema)
