//sign in and sign out routes
//install jsonwebtoken
//to send mail install nodemailer and nodemailer-sendgrid-transport
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs') //to hash(hide) the password in mongodb->npm install bcryptjs
const jwt = require('jsonwebtoken')
const { JWT_SECRET,JWT_EMAIL } = require('../keys')
const authorizationreq = require('../middleware/authorization')
// const SgMail = require('@sendgrid/mail')
var nodemailer = require('nodemailer')
require('dotenv').config();
const crypto = require('crypto')

// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport')
// 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

//in post man we will set header key:content-type and as application/json as we will be passing json file
//body:we will choose raw and write the code
//signup
// const api_key = "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"
// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:"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"
//     }
// }))
// SgMail.setApiKey(api_key)

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Email,
        pass: process.env.Password
    }
});


router.post('/signup', (req, res) => {
    //console.log(req.body)  //to test routes/api we will use postman
    const { name, email, password} = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the feilds" }) //status 422 thats it got failed and return is that we dont want to proceed further
    }
    const Emailtoken = jwt.sign({name,email,password},JWT_EMAIL,{expiresIn:'20min'})
    
    var mail = {
        from: 'noreplymyinstagram@gmail.com',
        to:email,
        subject: 'Email Verification',
        html:`
        <h2>Email verification</h2>
        <a href="http://localhost:3000/verification/${Emailtoken}">click here to get verified</a>
        `
    }
    transporter.sendMail(mail,(err,info)=>{
        if(err){
            return res.status(400).json({error:"Email doesnt exists"})
        }else{
            res.json({message:"Verification link is sent to mail"})
        }
    })
})

router.post('/validation', (req, res) => {
    const {emailtoken} = req.body
    if(emailtoken){
    jwt.verify(emailtoken,JWT_EMAIL,(err,decodedToken)=>{
        if(err){
            console.log(err)
        }
        else{
            const { name, email, password} = decodedToken
            User.findOne({ email: email }).then((SavedUser) => {  //check whether same email id is there
                if (SavedUser) {
                    return res.status(422).json({ error: "email already exists" })
                }
                bcrypt.hash(password, 12) //bigger the num safer the password ->default its 10
                    .then(hasedpassword => {
                        const user = new User({
                            email,
                            password: hasedpassword,
                            name,
                            // photo: pic,
                            privacy: "private"
                        })
                        user.save()
                            .then(user => {
                                res.json({message:"Signed up successfully"})
                    })
        
            })
                .catch(err => {
                    console.log(err)
                })
        })
        }
    })
}
//     // if (!email || !password || !name) {
//     //     return res.status(422).json({ error: "please add all the feilds" }) //status 422 thats it got failed and return is that we dont want to proceed further
//     // }
    
 })

// router.post('/signup', (req, res) => {
//     //console.log(req.body)  //to test routes/api we will use postman
//     const { name, email, password, pic } = req.body
//     if (!email || !password || !name) {
//         return res.status(422).json({ error: "please add all the feilds" }) //status 422 thats it got failed and return is that we dont want to proceed further
//     }
//     User.findOne({ email: email }).then((SavedUser) => {  //check whether same email id is there
//         if (SavedUser) {
//             return res.status(422).json({ error: "email already exists" })
//         }
//         bcrypt.hash(password, 12) //bigger the num safer the password ->default its 10
//             .then(hasedpassword => {
//                 const user = new User({
//                     email,
//                     password: hasedpassword,
//                     name,
//                     photo: pic,
//                     privacy: "private"
//                 })
//                 user.save()
//                     .then(user => {
//                         var mail = {
//                             from: 'noreplymyinstagram@gmail.com',
//                             to: user.email,
//                             subject: 'Sending Email',
//                             text: `welcome to Instagram`
//                         }

//                         transporter.sendMail(mail, (err, info) => {
//                             if (err) {
//                                 console.log(err)
//                             } else {
//                                 console.log('message sent:' + info.response)
//                             }
//                         })
//                         res.json({ message: "saved succesfully" })
//                     })
//                     .catch(err => {            //if u get error
//                         console.log(err)
//                     })
//             })

//     })
//         .catch(err => {
//             console.log(err)
//         })
// })

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: 'Please enter the details' }) //json response
    }
    User.findOne({ email: email }).then((SavedUser) => {
        if (!SavedUser) {
            return res.status(422).json({ error: "Invalid email or password" })  //we should use email or password coz we shd not give hacker idea that email but password wrng
        }
        bcrypt.compare(password, SavedUser.password).then(doMatch => {
            if (doMatch) {
                //res.json({message:"Succesfully signed in"})
                const token = jwt.sign({ _id: SavedUser._id }, JWT_SECRET)
                const { _id, name, email, followers, following, photo } = SavedUser
                res.json({ token, user: { _id, name, email, followers, following, photo } })
            }
            else {
                return res.status(422).json({ error: "Invalid email or password" })
            }
        })
            .catch(err => {
                console.log(err)
            })
    })
})

router.post('/reset-password',(req,res)=>{
   crypto.randomBytes(13,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        else{
            const token = buffer.toString("hex")
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(400).json({error:"User doesnt exist"})
                }
                user.resetToken = token
                user.expireToken = Date.now() + 36000000
                user.save().then(result=>{
                    var mail = {
                        from: 'noreplymyinstagram@gmail.com',
                        to: user.email,
                        subject: 'reset password',
                        html:`
                            <p>You have requested to reset your password</p>
                            <h5>Click this <a href="http://localhost:3000/resetpassword/${token}">link</a> to reset</h5>
                        `
                    }
    
                    transporter.sendMail(mail, (err, info) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.json({message:"Check your email buddy"})
                        }
                    })
                })
              
            })
        }
    })
})

router.post('/new-password',(req,res)=>{
    const token = req.body.token
    const newPassword = req.body.password
    User.findOne({resetToken:token,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(user){
      
       bcrypt.hash(newPassword,12).then(hasedpassword=>{
           user.password = hasedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save()
          .then(saveduser=>{
           res.json({message:"reset password is successful"})
       })
       })
       
    }else{
        return res.status(422).json({error:"Try again session got expired"})
    }
    })
})

module.exports = router