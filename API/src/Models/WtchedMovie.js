const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Ysrbolles:Ysrbolles@hypertube-gneu0.mongodb.net/test?retryWrites=true&w=majority'
, { useNewUrlParser: true, useUnifiedTopology: true }); 


const Watched = new mongoose.Schema({
    imdbID: {type: String, required: true},
  })

module.exports =  MovieWatched = new mongoose.model('Watched', Watched);