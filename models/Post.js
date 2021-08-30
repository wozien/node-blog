/**
 * 文章模型
 */

const mongoose = require('mongoose')
const marked = require('marked')
const dayjs = require('dayjs')
const modelTransformer = require('../utils/model-transformer')
const { getCommentsCount } = require('../services/comment')

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

// 这些 hook 也可以放到 service 去做
postSchema.post(['find', 'findOne'], (docs) => {
  if(!Array.isArray(docs)) {
    docs = [docs]
  }

  const proms = []
  for(let doc of docs) {
    doc.htmlContent = marked(doc.content)
    // 注意这个时候还没走schema 的 toObject, createdAt 还是 date 类型
    doc.formatCreatedAt = dayjs(doc.createdAt).format('YYYY-MM-DD HH:mm')
    proms.push(getCommentsCount(doc._id).then(count => doc.commentsCount = count))
  }
  return Promise.all(proms)
})

// 1 asc -1 dsc
postSchema.index({ author: 1, _id: -1 })

module.exports = mongoose.model('Post', postSchema)
 