const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the user Schema 
const CommentSchema = new Schema({
    film: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    pdp: {
        type: String,
        default: 'http://localhost:3000/images/unknown.png'
    },
    date: {
        type: Date,
        default: Date.now
    }
});
    
module.exports = Comment = mongoose.model('comments', CommentSchema);