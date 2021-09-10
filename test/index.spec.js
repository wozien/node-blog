
const path = require('path')
const fs = require('fs/promises')
const { lookup } = require('mime-types')

const file = '/Users/James/Project/node-blog/public/tmp/upload_f9cf762a855b61dbcff02a9bd55e69bb.jpg'

const { ext } = path.parse(file)
console.log(lookup(ext))