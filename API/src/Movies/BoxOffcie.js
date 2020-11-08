
const router = require('express').Router()
const unirest = require("unirest");

router.get('/Boxoffice/:page',  (req, res) => {
    console.log(req.params)
    let page = req.params.page
   
    return new Promise((resolve, reject)=>{
     
        var req = unirest("GET", 
        `https://api.themoviedb.org/3/movie/now_playing?api_key=0f87bface5c69fcf394fc387f33049fa&language=en-US&page=${page}`);    
        
        
        req.end(function (result) {
                
            if (result.error) console.log(result.error)
        
            console.log(result.body)
            res.send(result.body)
        
        });

    })
   
})

module.exports = router