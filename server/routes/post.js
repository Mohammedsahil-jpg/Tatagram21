const { compare, compareSync } = require('bcryptjs')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const authorizationreq = require('../middleware/authorization')
//all post
router.get('/allpost', authorizationreq, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})
router.get('/mysubpost', authorizationreq, (req, res) => {
    // if postedBy in req.user.following
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})
router.post('/createpost', authorizationreq, (req, res) => {
    const { title, body, pic, Userprofile } = req.body

    if (!title || !body || !pic) {
        res.status(422).json({ error: "Please add all the details" })
    }
    req.user.password = undefined
    if (req.body.privacy == "") {
        const post = new Post({
            title,
            body,
            photo: pic,
            postedBy: req.user,
            Userprofile,
            privacy: "private"
        })
        post.save().then(userpost => {
            res.json(userpost)
        })
            .catch(err => {
                console.log(err)
            })
    } else {
        const post = new Post({
            title,
            body,
            photo: pic,
            postedBy: req.user,
            Userprofile,
            privacy: req.body.privacy
        })
        post.save().then(userpost => {
            res.json(userpost)
        })
            .catch(err => {
                console.log(err)
            })
    }
})
router.get('/mypost', authorizationreq, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate('postedBy', "_id name")
        .sort("-createdAt")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err)
        })
})
router.put('/like', authorizationreq, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true  //updates the mondb to new
    }).populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })

})


router.put('/unlike', authorizationreq, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true  //updates the mondb to new
    }).populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})
router.put('/comments', authorizationreq, (req, res) => {
    const comments = {
        text: req.body.text,
        postedBy: req.user
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comments }
    }, {
        new: true  //updates the mondb to new
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId', authorizationreq, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            } else {
                if (post.postedBy._id.toString() === req.user._id.toString()) {
                    post.remove()
                        .then(result => {
                            res.json(result)
                        }).catch(err => {
                            console.log(err)
                        })
                }
            }
        })
})
router.put('/decomments', authorizationreq, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { comments: { _id: req.body.commentId } }
    }, {
        new: true  //updates the mondb to new
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put('/Editpost/:id', authorizationreq, (req, res) => {
    Post.findByIdAndUpdate({ _id: req.params.id }, { $set: { title: req.body.title, body: req.body.body, privacy: req.body.privacy } }, { new: true })
        .then(result => {
            res.json(result)
        })
})

router.get('/getuserpost/:userid',authorizationreq,(req,res)=>{
    Post.find({postedBy:req.params.userid})
    .populate("postedBy","name _id")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(result=>{
        res.json(result)
    })
})
module.exports = router