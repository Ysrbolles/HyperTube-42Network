const router = require('express').Router()
const watchlater = require('../Models/WatchLater')

router.post('/watchlater', (req, res) => {
    console.log('heree')
    watchlater.findOne({movieid: req.body.movieid})
    .then((movie) =>{
        if(!movie)
            watchlater.create(req.body)
    })
    console.log(req.body)
    // return new Promise((resolve, reject) =>{
        
    // })
})
module.exports = router