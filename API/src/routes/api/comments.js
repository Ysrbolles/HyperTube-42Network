const express = require('express');
const router = express.Router();
const path = require('path');
const valid = require('../../helper/validation');
const jwt = require('jsonwebtoken');
const Comment = require('../../Models/Comment');
const passport = require('passport');


router.post('/comment', passport.authenticate('jwt', {
    session: false
}), function(req, res, next) {
    var error = "";
    var film = req.body.film;
    var comment = req.body.comment;
    var username = req.user.username;
    var pdp = req.user.pdp;
    var date = Date.now();

    if (!valid.Film(film))
        error = error + "| invalid Film Id"
    if (!valid.Comment(comment))
        error = error + "| invalid Comment"
    if (error.length > 0) {
        return res.send({
            msg: error
        })
    } else {
        Comment.create({
            film: film,
            comment: comment,
            username: username,
            pdp: pdp,
            date: date
        });
        // Comment.save();
    
    }
    res.send("salina")
});

router.get('/comments/:id', function (req, res) {
    return new Promise((resolve, reject)=>{
        Comment.find({film: req.params.id})
        .then(comments =>{
            res.send(comments);
        })
        .catch(err => reject(err));
    });
});


module.exports = router;