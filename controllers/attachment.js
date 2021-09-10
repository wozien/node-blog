const express = require('express')
const router = express.Router()
const { checkLogin } = require('../middlewares/check')
const { getFile } = require('../services/attachment')
const { lookup } = require('mime-types')

router.get('/:fileId', checkLogin, async (req, res, next) => {
  try {
    const file = await getFile(req.params.fileId)

    if(file) {
      res.header('Content-Type', lookup(file.ext) || 'application/octet-stream')
      res.send(file.data) // Buffer
    } else {
      throw new Error('文件不存在')
    }
  } catch(e) {
    next(e)
  }
})

module.exports = router
