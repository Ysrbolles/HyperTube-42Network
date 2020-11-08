//Import du module
const unirest = require("unirest");
const express = require("express");
const http = require("http");
const cors = require("cors");
const Router = require("./models/Router");
const mongoose = require("mongoose");
const indexRouter = require("./routes/api/index");
const usersRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profile");
const path = require('path');
var passport = require('passport');

//Module NodeJs (middleware) qui permet de parser nos requetes
const bodyParser = require("body-parser");

function format(t, sym) {
    let res = [];
    let data = {
        _id: "",
        imdb_id: "",
        title: "",
        year: "",
        synopsis: "",
        runtime: "",
        released: "",
        certification: "",
        torrents: [],
        trailer: "",
        genres: [],
        images: {
            poster: "",
            fanart: "",
            banner: ""
        },
        rating: {
            percentage: 0,
            watching: 0,
            votes: 0,
            loved: 100,
            hated: 100
        }
    };
    for (let i = 0; i < t.length; i++) {
        data = {
            _id: "",
            imdb_id: "",
            title: "",
            year: "",
            synopsis: "",
            runtime: "",
            released: "",
            certification: "",
            torrents: [],
            trailer: "",
            genres: [],
            images: {
                poster: "",
                fanart: "",
                banner: ""
            },
            rating: {
                percentage: 0,
                watching: 0,
                votes: 0,
                loved: 100,
                hated: 100
            }
        };

        data.title = sym == 1 ? t[i].title : t[i].title;
        data.rating.percentage = sym == 1 ? t[i].rating : t[i].rating.percentage;
        data.rating.votes = sym == 1 ? t[i].popularity : t[i].rating.votes;
        data.trailer = sym == 1 ? t[i].trailer : t[i].trailer;
        data.images.poster = sym == 1 ? t[i].poster_med : t[i].images.poster;
        data.imdb_id = sym == 1 ? t[i].imdb : t[i].imdb_id;
        data._id = sym == 1 ? t[i].imdb : t[i].imdb_id;
        data.adult = sym == 1 ? t[i].adult : false;
        data.images.banner = sym == 1 ? t[i].poster_big : t[i].images.banner;
        data.torrents = sym == 1 ? t[i].original_language : t[i].torrents[0];
        data.genres = t[i].genres;
        data.synopsis = sym == 1 ? t[i].description : t[i].synopsis;
        data.year = sym == 1 ? t[i].year : t[i].year;
        data.runtime = t[i].runtime;
        res.push(data);
        console.log(t[i].title);
    }
    return res;
}

// Initialisation du module
class Server {
    constructor() {

        this.app = express();
        // User passport Middleware
        this.app.use(passport.initialize());
        // Bring in the Passport Strategy
        require('./config/passport')(passport);

        this.app.use("/Sub", express.static("./src/MoviesHash/subti"));
        this.app.use("/images", express.static("./public/images"));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.http = http.Server(this.app);
        this.io = require("socket.io")(this.http);
        this.routes = new Router(this.app).setAllRoutes();
        this.app.use("/", indexRouter);
        this.app.use("/users", usersRouter);
        this.app.use("/profile", profileRouter);
        // catch 404 and forward to error handler
        this.app.use(function(req, res, next) {
            next(createError(404));
        });
        // // view engine setup
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        // this.app.use("/images", express.static("./src/public/"));

        this.app.use(express.static(path.join(__dirname, "public")));
        // this.app.use("/img", express.static("./src/public/images"));

        // // error handler
        this.app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get("env") === "development" ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render("error");
        });

        // Bring the DataBase Config
        const db = require("./config/keys").mongoURI;
        mongoose
            .connect(db, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            })
            .then(e => {
                console.log(`DataBase Connected Successfully ${db}`);
            })
            .catch(err => {
                console.log(`Unable to connect with the database ${err}`);
            });

        this.io.on("connection", socket => {
            socket.on("search", data => {
                if (data.length >= 1) {
                    var req = unirest(
                        "GET",
                        "https://tv-v2.api-fetch.website/movies/1?sort=name&order=-1&keywords=" +
                        data
                    );
                    req.end(function(result) {
                        if (result.error) console.log(result.error);
                        if (result.code < 500)
                            socket.emit("Search_result", { result: result.body, sym: 1 });
                        else {
                            var req2 = unirest(
                                "GET",
                                "https://api.apiumadomain.com/list?sort=name&short=1&quality=720p,1080p,3d&page=1&keywords=" +
                                data +
                                ""
                            );
                            req2.end(function(result) {
                                //if two Api Down
                                if (result.code > 500)
                                    socket.emit("Error", { result: result.code });
                                let resulttt = [];
                                result.raw_body = JSON.parse(result.raw_body);
                                resulttt = format(result.raw_body["MovieList"], 1);
                                socket.emit("Search_result", { result: resulttt, sym: 1 });
                            });
                        }
                    });
                    console.log(data);
                } else socket.emit("Search_result", { sym: 1 });
            });
        });
    }
    listen() {
        this.http.listen(3000, () => {
            console.log(`Listening on http://localhost:3000`);
        });
    }
}
const server = new Server();
server.listen();
0