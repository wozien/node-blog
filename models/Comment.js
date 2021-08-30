/**
 * 文章模型
 */

const mongoose = require('mongoose')
const modelTransformer = require('../utils/model-transformer')
const dayjs = require('dayjs')
 
const schema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  postId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  content: {
    type: 'string',
    required: true
  }
}, {
  ...modelTransformer,
  timestamps: true
})

schema.post(['find', 'findOne'], (docs) => {
  if(!Array.isArray(docs)) {
    docs = [docs]
  }

  for(let doc of docs) {
    // 注意这个时候还没走schema 的 toObject, createdAt 还是 date 类型
    doc.formatCreatedAt = dayjs(doc.createdAt).format('YYYY-MM-DD HH:mm')
  }
})

schema.index({ postId: 1, _id: 1 })

module.exports = mongoose.model('Comment', schema)