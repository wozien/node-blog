/**
 * 文章模型
 */

const mongoose = require('mongoose')
const marked = require('marked')
const moment = require('moment')
const modelTransformer = require('../utils/model-transformer')

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  title: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  pv: {
    type: 'number',
    default: 0
  }
}, {
  ...modelTransformer,
  // 生成 createdAt 和 updatedAt 字段， 类型为 Date
  timestamps: true,
})

postSchema.post(['find', 'findOne'], (docs) => {
  if(!Array.isArray(docs)) {
    docs = [docs]
  }

  for(let doc of docs) {
    doc.htmlContent = marked(doc.content)
    // 注意这个时候还没走schema 的 toObject, createdAt 还是 date 类型
    doc.formatCreatedAt = moment(doc.createdAt.getTime()).format('YYYY-MM-DD HH:mm')
  }
})

// 1 asc -1 dsc
postSchema.index({ author: 1, _id: -1 })

module.exports = mongoose.model('Post', postSchema)
 