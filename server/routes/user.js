const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const Story = mongoose.model('Story')
const authorizationreq = require('../middleware/authorization')

router.put('/changeprivacypublic',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{privacy:"public"}})
    .then(result=>{
        res.json({message:"Your account is now public"})
    })
})
router.put('/changeprivacyprivate',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{privacy:"private"}})
    .then(result=>{
        res.json({message:"Your account is now private"})
    })
})

router.get('/userdata',authorizationreq,(req,res)=>{
    User.findOne({_id:req.user._id})
    .select("-password")
    .then(result=>{
        res.json(result)
    })
})


router.get('/user/:id',authorizationreq,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
                //console.log(err)
            }
            else{
                return res.json({user,posts})
            }
        })
    })
})
router.put('/follow',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $push:{followers:req.user._id},
        $push:{following:req.user._id},
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:error})
        }
            User.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followid},
                $push:{followers:req.body.followid},
            },{
                new:true
            }).select("-password")
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
           
        
    })
   
})
router.put('/reqfollow',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $push:{request:req.user._id},
    },{
        new:true
    },(err,requestuser)=>{
        if(err){
            return res.status(422).json({error:error})
        }
            User.findOne({_id:req.user._id})
                .select("-password")
            .then(user=>{
                res.json({requestuser,user})
            }).catch(err=>{
                console.log(err)
            })
           
        
    })
})
router.put('/unfollow',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $pull:{followers:req.user._id},
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:error})
        }
            User.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.followid},
            },{
                new:true
            }).select("-password")
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
           
        
    })
   
})

router.put('/unreqfollow',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $pull:{request:req.user._id},
    },{
        new:true
    },(err,requestuser)=>{
        if(err){
            return res.status(422).json({error:error})
        }
            User.findOne({_id:req.user._id})
                .select("-password")
            .then(user=>{
                res.json({requestuser,user})
            }).catch(err=>{
                console.log(err)
            })
           
        
    })
})
router.put('/reject',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $pull:{request:req.body.followid}
    }).then(result=>{
        res.json(result)
    })
})

router.post('/story',authorizationreq,(req,res)=>{
    const {storypic} = req.body
    if(!storypic){
        res.status(422).json({error:"Story not found"})
    }
    else{
       req.user.password = undefined
        const storypics = new Story({
            story:storypic,
            postedBy:req.user._id
        }) 
        storypics.save()
        .then(result=>{
            res.json({message:"saved"})
        })
       
    }
})
router.get('/getStory',authorizationreq,(req,res)=>{
    Story.findOne({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(result=>{
        if(result){
        res.json(result)
        }else{
            res.json("https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg")
        }
    })
})
router.put('/deleteStory',authorizationreq,(req,res)=>{
    const {storyid} = req.body
    Story.findByIdAndRemove(req.body.storyid,(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.json(result); 
        }
    })
})

router.get('/friendstory',authorizationreq,(req,res)=>{
    Story.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .then(story=>{
        if(story){
        res.json(story)
        }
        else{
            res.json({story:"https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"})
        }
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/getviewstory/:userid',authorizationreq,(req,res)=>{
    Story.find({postedBy:req.params.userid})
    .populate("postedBy","_id name")
    .then(story=>{
            if(!story){
                return res.status(422).json({error:err})
            }
            else{
                return res.json(story)
            }
        })
    })

router.put('/UpdateProfile',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{photo:req.body.pic}},{new:true},
            (err,result)=>{
                if(err){
                    return res.status(422).json({error:"Cant Update"})
                }
                Post.findByIdAndUpdate({postedBy:req.user._id},{$set:{Userprofile:req.body.pic}},{new:true})
                result.password=undefined
                res.json(result)
            } 
        )
})
router.get('/deleteProfile',authorizationreq,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{photo:"https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"Cant Update"})
            }
            Post.findByIdAndUpdate({postedBy:req.user._id},{$set:{Userprofile:"https://res.cloudinary.com/sahil-projects/image/upload/v1610541797/nouser_boaixh.jpg"}},{new:true})
            result.password=undefined
            res.json(result)
        } 
    )
})

router.get('/followreq',authorizationreq,(req,res)=>{
    // if postedBy in req.user.following
    User.find({_id:{$in:req.user.request}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(user=>{
        res.json(user)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/search-user',(req,res)=>{
    const Userdata = new RegExp('^'+req.body.query)
    User.find({email:{$regex:Userdata}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    })
})


module.exports = router