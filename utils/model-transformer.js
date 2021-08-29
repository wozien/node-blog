/**
 * mongoose 的数据转换方法
 */

 'use strict'

 module.exports = {
   toObject: {
     transform(doc, ret) {
       ret.id = ret._id.toString()
       delete ret._id
       delete ret.__v
       delete ret.scope
 
       for (const key of Object.keys(ret)) {
         if (ret[key] instanceof Date) {
           ret[key] = ret[key].getTime()
         }
       }
     },
   },
   toJSON: {
     transform(doc, ret) {
       ret.id = ret._id.toString()
       delete ret._id
       delete ret.__v
       delete ret.scope
 
       for (const key of Object.keys(ret)) {
         if (ret[key] instanceof Date) {
           ret[key] = ret[key].getTime()
         }
       }
     },
   },
 }