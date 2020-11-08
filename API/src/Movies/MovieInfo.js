const router = require("express").Router();
const unirest = require("unirest");
const fs = require("fs");
const watchedMovie = require("../Models/WtchedMovie");

function format(tab) {
  let genrestab = "";
  if (tab.genres) {
    tab.genres.forEach(gn => {
      if (tab.genres.length - 1) genrestab += gn + ", ";
    });
  }
  // tab.items[0].torrent_magnet
  let res = [
    {
      _id: tab.imdb,
      imdb_id: tab.imdb,
      title: tab.title,
      year: tab.year,
      synopsis: tab.description,
      runtime: tab.runtime,
      released: tab.year,
      certification: "",
      url: tab.items === undefined ? "" : tab.items[0].torrent_magnet,
      trailer: "https://www.youtube.com/watch?v=" + tab.trailer,
      genres: genrestab,
      images: {
        poster: tab.poster_med,
        fanart: tab.poster_big
      },
      rating: {
        percentage: 78,
        watching: 6,
        votes: 6645,
        loved: 100,
        hated: 100
      }
    },
    {
      Title: tab.title,
      Year: tab.year,
      Rated: "",
      Released: tab.year,
      Runtime: tab.runtime,
      Genre: genrestab,
      Director: tab.directors,
      Writer: tab.writers,
      Actors: tab.actors,
      Plot: tab.description,
      Language: "",
      Country: "",
      Awards: "",
      Poster: tab.poster_med,
      Ratings: [
        {
          Source: "",
          Value: ""
        },
        {
          Source: "",
          Value: ""
        },
        {
          Source: "",
          Value: ""
        }
      ],
      Metascore: "",
      imdbRating: tab.rating,
      imdbVotes: "",
      imdbID: tab.imdb,
      Type: "",
      DVD: "",
      BoxOffice: "",
      Production: "",
      Website: "",
      Response: ""
    }
  ];
  return res;
}

router.get("/movieInfo", async (req, res) => {
  console.log(req.query);
  const id = req.query.id;

  return new Promise((resolve, reject) => {
    var req = unirest("GET", `https://tv-v2.api-fetch.website/movie/${id}`);
    var reqI = unirest(
      "GET",
      `https://movie-database-imdb-alternative.p.rapidapi.com/`
    );

    reqI.query({
      i: id,
      r: "json"
    });

    reqI.headers({
      "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
      "x-rapidapi-key": "4ccc11616emsha0ff93487313f1ep1528a9jsnf24cc1750061"
    });

    reqI.end(function(result1) {
      if (result1.error) throw new Error(result1.error);
      rows = result1.body;
      let title = "";
      // console.table(rows)
      // 0f87bface5c69fcf394fc387f33049fa
      req.end(function(result) {
        if (result.error) console.log(result.error);
        if (result.code > 500 || result.body == undefined) {
          var res2 = unirest(
            "GET",
            `http://api.apiumadomain.com/movie?imdb=${id}`
          );
          res2.end(function(result) {
            if (result.code > 500 || result.body == undefined)
              res.send({
                err:
                  "May The movie doesnt existe or serveur down Sorry Tyr later!"
              });
            result1.raw_body = JSON.parse(result1.raw_body);
            let a = [];
            result.body.poster_big = result1.raw_body.Poster;
            result.body.actors = result1.raw_body.Actors;
            result.body.writers = result1.raw_body.Writer;
            result.body.directors = result1.raw_body.Director;
            title = result.body.title;
            if (result.body) a = format(result.body);
            res.send({ req: a[0], imdb: a[1] });
          });
        } else {
          let WatchedorNot = false;
          watchedMovie.findOne({ imdbID: id }).then(film => {
            if (film) WatchedorNot = true;
            title = result.body.title;
            res.send({ req: result.body, imdb: rows, Watched: WatchedorNot });
          });
        }
      });
    });
  });
});

module.exports = router;
