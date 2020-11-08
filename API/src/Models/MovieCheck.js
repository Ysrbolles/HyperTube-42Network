const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Ysrbolles:Ysrbolles@hypertube-gneu0.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true })

const checkmovie = new mongoose.Schema({
    hash: { type: String, required: true },
    DateWatched: { type: Date, default: Date.now() }
  });

  module.exports = Movie = new mongoose.model("Movie", checkmovie);