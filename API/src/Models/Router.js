const { popy, Library } = require("../Movies/popy");
const lastMovie = require("../Movies/LastMovie");
const movieInfo = require("../Movies/MovieInfo");
const MoviesSimilar = require("../Movies/SimilarMovies");
const MovieStream = require("../Movies/Stream");
const Similarinfo = require("../Movies/SimilarMovieinfo");
const BoxOffice = require("../Movies/BoxOffcie");
const UpComing = require("../Movies/UpComing");
const Sub = require("../Movies/getSub");
const filtre = require("../Movies/filtre_search");
const watchlater = require("../Movies/watchLater");
const getMoviesLater = require("../Movies/watchList");
const Comment = require('../routes/api/comments')

class Router {
  constructor(app) {
    this.app = app;
    this.routes = {
      "/Home": [
        popy,
        Library,
        lastMovie,
        movieInfo,
        MoviesSimilar,
        MovieStream,
        Similarinfo,
        BoxOffice,
        UpComing,
        Sub,
        filtre,
        watchlater,
        getMoviesLater
      ],
      "/user": [
        Comment
      ]
    };
  }

  setAllRoutes() {
    Object.keys(this.routes).forEach(route => {
      this.routes[route].forEach(element => {
        if (route === "") this.app.use(element);
        else this.app.use(route, element);
      });
    });
  }
}

module.exports = Router;
