const mongoose = require('mongoose')
//schema is a blue print which tells what kind of data we will be storing
const {ObjectId} = mongoose.Schema.Types 
let storySchema = new mongoose.Schema({
    story:{
        type:String,
        default:"https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg",
    },  
    postedBy:{
        type:ObjectId,
        ref:"User",
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 60*60*24,
        //required: true
    }
});

mongoose.model('Story',storySchema) //we did not use export coz when u want to use somewhere else sometimes it shows error like u used this model so u cant use it