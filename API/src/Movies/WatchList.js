const router = require('express').Router()
const watchLater = require("../Models/WatchLater")
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.get("/watchlater", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    watchLater.find({user_id: req.user._id})
    .then((Movies) => {
        res.send(Movies)
    })
})

module.exports = router