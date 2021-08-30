const express = require('express')
const router = express.Router()
const { checkLogin } = require('../middlewares/check')
const comment = require('../services/comment')

// /comments
router.post('/', checkLogin, async (req, res, next) => {
  const author = req.session.user.id
  const postId = req.fields.postId
  const content = req.fields.content

  // 校验参数
  if (!content.length) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  try {
    await comment.create({ author, postId, content })
    req.flash('success', '留言成功')
    // 留言成功后跳转到上一页
    res.redirect('back')
  } catch(e) {
    next(e)
  }
})

router.get('/:commentId/remove', checkLogin, async (req, res, next) => {
  const commentId = req.params.commentId
  const author = req.session.user.id

  try {
    const result = await comment.getCommentById(commentId)
    
    if (!result) {
      throw new Error('留言不存在')
    }
    if (result.author.toString() != author) {
      throw new Error('没有权限删除留言')
    }

    await comment.delCommentById(commentId)
    req.flash('success', '删除留言成功')
    // 删除成功后跳转到上一页
    res.redirect('back')
  } catch(e) {
    next(e)
  }
})

module.exports = router