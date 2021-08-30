/**
 * comment service
 */

const Comment = require('../models/Comment')

// 创建一个留言
const create = async (comment) => {
  const result = await Comment.create(comment)
  return result
}

// 通过留言 id 获取一个留言
const getCommentById = (commentId) => {
  return Comment.findOne({ _id: commentId }).exec()
}

// 通过留言 id 删除一个留言
const delCommentById = (commentId) => {
  return Comment.deleteOne({ _id: commentId }).exec()
}

// 通过文章 id 删除该文章下所有留言
const delCommentsByPostId = (postId) => {
  return Comment.deleteMany({ postId }).exec()
}

// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
const getComments = (postId) => {
  return Comment.find({ postId })
    .populate({ path: 'author', model: 'User' })
    .sort({ _id: 1 })
    .exec()
}

// 通过文章 id 获取该文章下留言数
const getCommentsCount = (postId) => {
  return Comment.count({ postId }).exec()
}

module.exports = {
  create,
  getCommentById,
  delCommentById,
  delCommentsByPostId,
  getComments,
  getCommentsCount
}