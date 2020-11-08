const router = require('express').Router()
const unirest = require("unirest");

function format(t, sym){
    let res = []
    let data = {
    _id: '',
    imdb_id: '',
    title: '',
    year: '',
    synopsis: '',            
    runtime: '',
    released: '',
    certification: '',
    torrents: [],
    trailer: '',
    genres: [],
    images: {
        poster: '',
        fanart: '',
        banner: '',
    },
    rating: {
        percentage: 0,
        watching: 0,
        votes: 0,
        loved: 100,
        hated: 100,
    }
    }
    for(let i = 0; i < t.length ; i++){
    data = {
            _id: '',
            imdb_id: '',
            title: '',
            year: '',
            synopsis: '',            
            runtime: '',
            released: '',
            certification: '',
            torrents: [],
            trailer: '',
            genres: [],
            images: {
                poster: '',
                fanart: '',
                banner: '',
            },
            rating: {
                percentage: 0,
                watching: 0,
                votes: 0,
                loved: 100,
                hated: 100,
            }
            }
    
    data.title = (sym == 1) ?  t[i].title : t[i].title
    data.rating.percentage = (sym == 1) ?  t[i].rating : t[i].rating.percentage
    data.rating.votes = (sym == 1) ?  t[i].popularity : t[i].rating.votes
    data.trailer = (sym == 1) ?  t[i].trailer : t[i].trailer
    data.images.poster = (sym == 1) ?  t[i].poster_med : t[i].images.poster
    data.imdb_id = (sym == 1) ?  t[i].imdb : t[i].imdb_id
    data._id = (sym == 1) ?  t[i].imdb : t[i].imdb_id
    data.adult = (sym == 1) ?  t[i].adult : false
    data.images.banner = (sym == 1) ?  t[i].poster_big : t[i].images.banner
    data.torrents = (sym == 1) ?  t[i].original_language : t[i].torrents[0]
    data.genres = t[i].genres
    data.synopsis= (sym == 1) ?  t[i].description : t[i].synopsis
    data.year = (sym == 1) ?  t[i].year : t[i].year
    data.runtime = t[i].runtime
    res.push(data);
    console.log(t[i].title)
    }
    return (res);
}

router.post('/Library', (req, res) => {
    console.log(req.bod)

    const page = req.body.page
    const genre = req.body.genre
    const sort = req.body.sort
    let url = "https://tv-v2.api-fetch.website/movies/"+page+"?sort=trending&order=-1"
    let url1 = "https://api.apiumadomain.com/list?short=1&quality=720p,1080p,3d&page="+page
    if (genre.length > 0) {
        url += "&genre="+genre 
        url1 += "&genre="+genre
    }
    if (sort.length > 0) {
        url += "&sort="+sort 
        url1 += "&sort="+sort
    }
    return new Promise((resolve, reject)=>{
        // 0f87bface5c69fcf394fc387f33049fa
        var req = unirest("GET", url)
        req.end(function (result) {
            if (result.error) resolve(result.length)
            if(result.code < 500 && result.body.length != 0)
            {
                console.log(result.code);
                res.send(result.body)
            }
            else{
                var req2 = unirest("GET", url1)
                req2.end(function (result) {//if two Api Down
                    if(result.code > 500) return res.send({err: "Server Down"})
                    let resulttt = []
                    resulttt = format(result.body.MovieList, 1)
                    res.send(resulttt)
                    // console.log(result.body.MovieList)
                })
            }
        })
    })
})
module.exports = router