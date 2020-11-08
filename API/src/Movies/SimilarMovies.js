const router = require('express').Router()
const unirest = require("unirest");

router.get('/movieSimilar',  (req, res) => {
    console.log(req.query)
    let id = req.query.id
    console.log("-*****************************************************************")
    console.log(id.substr(2))
    return new Promise((resolve, reject)=>{
     
        var req = unirest("GET", 
        `http://api.themoviedb.org/3/movie/${id}/similar?api_key=0f87bface5c69fcf394fc387f33049fa`);    
        
        
        req.end(function (result) {
                
            if (result.error) console.log(result.error)
        
          
            res.send(result.body)
        
        });

    })
   
})

module.exports = router