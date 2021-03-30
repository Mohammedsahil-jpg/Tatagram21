//to save sensitive data

// if(process.env.NODE_ENV == 'production'){
//    module.exports = require('./config.js/prod')
// }else{
//    module.exports = require('./config.js/dev')
// }

module.exports = {
   MONGOURI:"mongodb+srv://mohammedsahil2000:sahil2000@cluster0.ds08h.mongodb.net/<dbname>?retryWrites=true&w=majority",
   JWT_SECRET:"rnhakhsgkljcal",
   JWT_EMAIL:"accountverification"
}