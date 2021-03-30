const mongoose = require('mongoose')
//schema is a blue print which tells what kind of data we will be storing
const {ObjectId} = mongoose.Schema.Types 
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    privacy:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    photo:{
        type:String,
        default:"https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"
    },
    request:[{
        type:ObjectId,
        ref:"User"
    }],
    followers:[{type:ObjectId,ref:"User"}],

    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model('User',userSchema) //we did not use export coz when u want to use somewhere else sometimes it shows error like u used this model so u cant use it