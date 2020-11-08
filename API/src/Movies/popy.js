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
const popy = router.get('/', (req, res) => {
    let page = req.query.page
    return new Promise((resolve, reject)=>{
        // 0f87bface5c69fcf394fc387f33049fa
        var req = unirest("GET", "https://tv-v2.api-fetch.website/movies/"+page+"?sort=year&order=-1")
        req.end(function (result) {
            if (result.error) resolve(result.length)
            if(result.code < 500)
            {
                console.log(result.code);
                res.send(result.body)
            }
            else{
                var req2 = unirest("GET", "https://api.apiumadomain.com/list?sort=seeds&short=1&cb=&quality=720p,1080p,3d&page="+page+"")
                req2.end(function (result) {//if two Api Down
                    if(result.code > 500) return res.send({err: "Server Down"})
                    let resulttt = []
                    resulttt = format(result.body['MovieList'], 1)
                    res.send(resulttt)
                    console.log(result.body.MovieList)
                })
            }
        })
    })
});

const Library = router.get('/Library', (rq, res) => {
    let page = rq.query.search
    let url = ''
    let url1 = ''
    return new Promise((resolve, reject)=>{
        // 0f87bface5c69fcf394fc387f33049fa
        console.log(page)
        if(page != "undefined"){
             url = "https://tv-v2.api-fetch.website/movies/1?sort=name&order=-1&keywords="+page+""
             url1 = "https://api.apiumadomain.com/list?sort=name&short=1&cb=&quality=720p,1080p,3d&page=1&keywords="+page+""
        }
        else if(page === "undefined"){
            console.log('here')
            url = "https://tv-v2.api-fetch.website/movies/1?sort=trending&order=-1"
            url1 = "https://api.apiumadomain.com/list?sort=seeds&short=1&cb=&quality=720p,1080p,3d&page=1"
        }
        var req = unirest("GET", url);
        req.end(function (result) {
            if (result.error) console.log(result.error)
            if(result.code < 500)
            {
                res.send({result: result.body});
            }
            else{
                var req2 = unirest("GET", url1)
                req2.end(function (result) {//if two Api Down
                    if(result.code > 500) return res.send({err: "Server Down"})
                    let resulttt = []
                    result.raw_body = JSON.parse(result.raw_body)
                    resulttt = format(result.raw_body['MovieList'], 1)
                    res.send({result: resulttt})
                })
            }
        });
    })
})

module.exports = {popy, Library}