
/**
 * 附件服务
 * @see https://mongodb.github.io/node-mongodb-native/4.1/classes/Binary.html
 * @see https://mongoosejs.com/docs/schematypes.html#buffers
 */

const path = require('path')
const fs = require('fs')
const Attachment = require('../models/Attachment')

/**
 * 存储文件
 * @param {*} file 临时文件路径
 * @returns fileId
 */
const storeFile = async (file) => {
  const { name, ext } = path.parse(file)
  const doc = {
    filename: name,
    ext,
    data: fs.readFileSync(file)
  }
  const res = await Attachment.create(doc)
  return res.id
}

/**
 * 根据附件id获取附件
 * @param {*} fileId 附件id
 * @returns 
 */
const getFile = async (fileId) => {
  const res = await Attachment.findOne({ _id: fileId })
  return res
}

module.exports = {
  storeFile,
  getFile
}