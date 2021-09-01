/**
 * mongoose 连接器
 */

 const mongoose = require('mongoose')

 mongoose.Promise = Promise
 
 let addr = process.env.MONGO_URL
 const extraParams = process.env.DB_ADDR_EXTRA_PARAMS
 if (extraParams) {
   addr += extraParams
 }
 
 module.exports = {
   mongoose,
 
   connect() {
     return mongoose.connect(addr, { useNewUrlParser: true })
   },
 
   disconnect() {
     return mongoose.disconnect()
   },
 
   isObjectId(str) {
     return mongoose.Types.ObjectId.isValid(str)
   },
 
   newObjectId() {
     return mongoose.Types.ObjectId()
   },
 }