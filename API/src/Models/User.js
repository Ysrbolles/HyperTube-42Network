const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the user Schema 
const UserSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
    },
    lang: {
        type: String,
        default: 'en'
    },
    pdp: {
        type: String,
        default: 'http://localhost:3000/images/unknown.png'
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    isValid: {
        type: String,
        default: '0'
    },
    date: {
        type: Date,
        default: Date.now
    },
    ID_FT: {
        type: String,
        default: ''
    },
    ID_GH: {
        type: String,
        default: ''
    },
    ID_SP: {
        type: String,
        default: ''
    }
});
    
module.exports = User = mongoose.model('users', UserSchema);