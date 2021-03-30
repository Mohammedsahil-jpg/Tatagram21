const express = require('express')
const app = express()
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./keys')

//to connect with mongodb 
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,  //we got deprecating error and this will be given in terminal itself
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
//to check its connection
mongoose.connection.on('connected', () => {
    console.log('connected')
})
mongoose.connection.on('error', (err) => {
    console.log('error', err)
})

//require mongoose model
require('./models/user')
//require mongoose post model
require('./models/post')
require('./models/story')
require('./models/message')


//to pass the request
app.use(express.json())
//require router
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
app.use(require('./routes/messages'))

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'bulid','index.html'))
    })
}


//listening at port 5000
app.listen(PORT, () => {
    console.log(`the port is `, PORT)
})






















//password of mongodb cluster sahil2000
const customMiddleware = (req, res, next) => {  //it takes request before it reaches server
    console.log('middleware executed')
    next()
}
//app.use(customMiddleware) to run it in get home
app.get('/', (req, res) => {        //get request
    res.send('Hello world')
})

app.get('/home', customMiddleware, (req, res) => {        //get request
    res.send('home')
    console.log('home')   //first middleware will be executed then get
})

//nodemon app to run 