const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
//using middleware(it runs before) to check for authorization
module.exports = (req,res,next)=>{
    const {authorization} = req.headers  //destructuring{}
    //authorization ===== bearer shbksbsnls(token)
    if(!authorization){
       return res.status(401).json({error:"You must be logged in"})
    }
    const token = authorization.replace("Bearer ","")//we r replacing bearer with empty string so that we get token alone and "Bearer "space is must
    jwt.verify(token,JWT_SECRET,(err,payload)=>{        //payload is were users data{_id,iat} is present || u can use any name 
        if(err){
          return res.status(401).json({error:"You must be logged in"})
        }
      //  console.log(payload)
        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()//it shd be used here as it shd wait and then go next()
    })
   // next()//to stop middleware
    })
   
}