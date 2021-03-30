const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
    postedBy:{
        type:ObjectId,
        ref:'User'
    },
    receivedBy:{
        type:ObjectId,
        ref:'User'
    },
    messages:[{
        message:String,
        postedBy:{
            type:ObjectId,
            ref:'User'
        }
    }]
})

mongoose.model('InstaMessage',messageSchema)