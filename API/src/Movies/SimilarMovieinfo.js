const router = require('express').Router()
const unirest = require("unirest");
const fs = require('fs');
const yifysubtitles = require('yifysubtitles');

router.get('/Similarinfo/:id', async (req, res) => {
    let id = req.params.id
    return new Promise((resolve, reject)=>{
        // 0f87bface5c69fcf394fc387f33049fa
        var req = unirest("GET", `https://api.themoviedb.org/3/movie/${id}?api_key=0f87bface5c69fcf394fc387f33049fa&language=en-US`)
        
        req.end(function (result) {
            if (result.error) console.log(result.error)
            // console.table(result.body);
            console.log('HERRRRE')
            res.send(result.body)
        });
    })
   
})

module.exports = router