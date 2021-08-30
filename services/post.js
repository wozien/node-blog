const Post = require('../models/Post')
const { delCommentsByPostId } = require('../services/comment')

const create = async (data) => {
  const result = await Post.create(data)
  return result
}

// 通过文章 id 获取一篇文章
const getPostById = (postId) => {
  return Post.findOne({ _id: postId })
    .populate({ path: 'author', model: 'User' })
    .exec()
}

// 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
const getPosts = (author) => {
  const query = {}
  if(author) {
    query.author = author
  }

  return Post.find(query)
    .populate({ path: 'author', model: 'User' })
    .sort({ _id: -1 })
    .exec()
}

// 通过文章 id 给 pv 加 1
const incPv = (postId) => {
  return Post
    .updateOne({ _id: postId }, { $inc: { pv: 1 }})
    .exec()
}

// 通过文章 id 更新一篇文章
const updatePostById = (postId, data) => {
  return Post.updateOne({ _id: postId }, { $set: data }).exec()
}

// 删除文章
const delPostById =  (postId) => {
  return Post.deleteOne({ _id: postId }).then(() => {
    return delCommentsByPostId(postId)
  })
}

module.exports = {
  create,
  getPostById,
  getPosts,
  incPv,
  updatePostById,
  delPostById
}