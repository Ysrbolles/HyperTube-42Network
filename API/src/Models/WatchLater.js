const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Ysrbolles:Ysrbolles@hypertube-gneu0.mongodb.net/test?retryWrites=true&w=majority'
, { useNewUrlParser: true, useUnifiedTopology: true }); 

const watchlater = new mongoose.Schema({
    movieid: {type: String, required: true},
    poster: {type: String, required: true},
    title: {type: String, required: true},
    user_id:{type: String, required: true}
  })
const watch = mongoose.model('watchlater', watchlater)
  module.exports = watch