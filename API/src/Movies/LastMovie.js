const router = require('express').Router()
const unirest = require("unirest");
router.get('/lastadded', (req, res) => {
    let page = req.query.page
    return new Promise((resolve, reject)=>{
            var req = unirest("GET", "https://tv-v2.api-fetch.website/movies/1?sort=trending&order=-1");    
            
        // 0f87bface5c69fcf394fc387f33049fa
      
        
        req.end(function (result) {
            
            if (result.error) console.log(result.error)
            res.send(result.body)
        });
    })
   
})

module.exports = router