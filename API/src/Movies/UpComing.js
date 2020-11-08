
const router = require('express').Router()
const unirest = require("unirest");

router.get('/Upcoming/:page',  (req, res) => {
    console.log(req.params)
    let page = req.params.page
   
    return new Promise((resolve, reject)=>{
     
        var req = unirest("GET", 
        `https://api.themoviedb.org/3/movie/upcoming?api_key=0f87bface5c69fcf394fc387f33049fa&page=${page}&order=1`);    
  
        req.end(function (result) {
                
            if (result.error) console.log(result.error)
        
            console.log(result.body)
            res.send(result.body)
        
        });

    })
   
})

module.exports = router