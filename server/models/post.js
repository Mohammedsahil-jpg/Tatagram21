const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types        //we are destructuring objectId from Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,        //we will be posting our photo url
        required:true
    },
    Userprofile:{
        type:String,        //we will be posting our photo url
        required:true
    },
    
    likes:[{type:ObjectId,ref:'User'}],
    comments:[{
        text:String,
        postedBy:{
            type:ObjectId,
            ref:'User'
        }
    }],
   
    postedBy:{          
        type:ObjectId, //id of the user which will be referred from User model
        ref:"User"
    },
    privacy:{
        type:String,
        required:true
    },
},{timestamps:true})

mongoose.model("Post",postSchema)