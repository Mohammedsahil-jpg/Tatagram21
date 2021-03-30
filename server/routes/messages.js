const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Message = mongoose.model('InstaMessage')
const authorizationreq = require('../middleware/authorization')

router.get('/getuserMessage',authorizationreq,(req,res)=>{
    User.find({_id:{$in:req.user.following}})
    .then(user=>{
        res.json({user})
    })
})

router.post('/CreateuserMessage',authorizationreq,(req,res)=>{
    Message.findOne({$and:[{postedBy:req.user._id},{receivedBy:req.body.friend_id}]})
    .then(user=>{
        if(!user){
            const message1 = new Message({
                postedBy:req.user._id,
                receivedBy:req.body.friend_id,
            })
            message1.save()
            let id_1 = message1._id
            let message2 = new Message({
                postedBy:req.body.friend_id,
                receivedBy:req.user._id,
            })
            message2.save()
            .then(message=>{
                const id_2 = message2._id
                res.json({id_1,id_2})
            })
           .catch(err=>{
               console.log(err)
           })
        }
    })
   
})

router.post('/getuserid',authorizationreq,(req,res)=>{
    Message.findOne({$and:[{postedBy:req.user._id},{receivedBy:req.body.friend_id}]})
    .populate('messages.postedBy','_id name')
    .then(user1=>{
        const id_1 = user1._id
        Message.findOne({$and:[{postedBy:req.body.friend_id},{receivedBy:req.user._id}]})
        .then(user2=>{
            const id_2 = user2._id
            res.json({id_1,id_2,user1})
        })
    })
})

router.post('/storeMessage',authorizationreq,(req,res)=>{
    // const message1 = {
    //     message:req.body.message,
    //     postedBy:req.body.friend_id
    // }
    
    const message = {
        message:req.body.message,
        postedBy:req.user._id
    }
    Message.findByIdAndUpdate({_id:req.body.messageid_2},{
        $push:{messages:message}
    },{new:true})
    .populate('messages.postedBy','_id name')
    .exec((err,result)=>{
        if(result){
            Message.findByIdAndUpdate({_id:req.body.messageid_1},{
            $push:{messages:message}
        },{new:true})
        .populate('messages.postedBy','_id name')
        .exec((err,result)=>{
            if(err){
                console.log(err)
            }else{
                console.log(result)
                res.json(result)
            }
        })
    }
    })
    })
router.post('/deletemsg',(req,res)=>{
    const deleteMessage = req.body.deleteMessage
    Message.findByIdAndUpdate({_id:req.body.messageid_2},{
        $pull:{messages:{message:deleteMessage}}
    },{new:true})
    .then(success=>{
        Message.findByIdAndUpdate({_id:req.body.messageid_1},{
            $pull:{messages:{message:deleteMessage}}
        },{new:true})
        .populate('messages.postedBy','_id name')
        .then(message=>{
            res.json(message)
        })
    })
 
})

module.exports = router