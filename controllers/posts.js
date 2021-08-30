const express = require('express')
const router = express.Router()
const { checkLogin } = require('../middlewares/check')
const postService = require('../services/post')
const { getComments } = require('../services/comment')

// /posts  获取所有文章
router.get('/', checkLogin, (req, res, next) => {
  const author = req.query.author

  postService.getPosts(author)
    .then(posts => {
      res.render('posts', { posts })
    })
    .catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.render('create')
})

// POST /posts/create 发表文章页
router.post('/create', checkLogin, async (req, res, next) => {
  const author = req.session.user.id
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = {
    author: author,
    title: title,
    content: content
  }

  try {
    const result = await postService.create(post)
    req.flash('success', '发表成功')
    // 发表成功后跳转到该文章页
    res.redirect(`/posts/${result.id}`)
  } catch(e) {
    netxt(e)
  }
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId

  Promise.all([
    postService.getPostById(postId), 
    getComments(postId),
    postService.incPv(postId)
  ]).then(([post, comments]) => {
    if(!post) {
      throw new Error('该文章不存在')
    }

    res.render('post', { post, comments })
  }).catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user.id

  postService.getPostById(postId)
    .then(post => {
      if(!post) {
        throw new Error('该文章不存在')
      }

      if(post.author.id !== author) {
        throw new Error('权限不足')
      }

      res.render('edit', { post })
    })
    .catch(next)
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, async (req, res, next) => {
  const postId = req.params.postId
  const title = req.fields.title
  const content = req.fields.content
  const author = req.session.user.id

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  try {
    const post = await postService.getPostById(postId) 
    if (!post) {
      throw new Error('文章不存在')
    }
    if (post.author.id !== author) {
      throw new Error('没有权限')
    }

    await postService.updatePostById(postId, { title, content })
    req.flash('success', '编辑文章成功')
    res.redirect(`/posts/${postId}`)
  } catch(e) {
    next(e)
  }
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, async (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user.id

  try {
    const post = await postService.getPostById(postId) 
    if (!post) {
      throw new Error('文章不存在')
    }
    if (post.author.id !== author) {
      throw new Error('没有权限')
    }

    await postService.delPostById(postId)
    req.flash('success', '删除文章成功')
    res.redirect(`/posts`)
  } catch(e) {
    next(e)
  }
})


module.exports = router