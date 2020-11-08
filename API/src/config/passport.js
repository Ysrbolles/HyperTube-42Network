const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../Models/User');
const key = require('./keys').secret;
const express = require('express');
const session = require('express-session');
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const _42Strategy = require("passport-42").Strategy;
const mongo = require("mongodb").MongoClient;
const crypto = require('crypto');

const router = express.Router();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key
};

var token = crypto.randomBytes(10).toString('hex');

function ft_check_username(username, rb) {
    return new Promise(function(resolve, reject) {
        User.findOne({
            username: username.toLowerCase() + '_' + rb
        }).then(user => {
            if (!user) {
                resolve(1);
            } else {
                resolve(0)
            }
        })
    })
}

module.exports = passport => {
    mongo.connect("mongodb+srv://Ysrbolles:Ysrbolles@hypertube-gneu0.mongodb.net/test?retryWrites=true&w=majority'", (err, client) => {
        var db = client.db("hyper_auth");
        if (err) {
            console.log("Database error: " + err);
        } else {
            console.log("Successful database connection")
            router.use(
                session({
                    secret: "AK-97",
                    resave: true,
                    saveUninitialized: true
                })
            );
            router.use(passport.initialize());
            router.use(passport.session());

            function ensureAuthenticated(req, res, next) {
                if (req.isAuthenticated()) {
                    return next();
                }
                res.redirect("/");
            }

            passport.serializeUser((user, done) => {
                done(null, user.id);
            });

            passport.deserializeUser((id, done) => {
                db.collection("users").findOne({
                    id: id
                }, (err, doc) => {
                    done(null, doc);
                });
            });

            passport.use(
                new JwtStrategy(options, (jwt_payload, done) => {
                    User.findById(jwt_payload._id).then(user => {
                        if (user) return done(null, user)
                        else return done(null, false);
                    }).catch(err => {
                        console.log(err);
                    });
                })
            );

            passport.use(
                new GitHubStrategy({
                        clientID: "25d18ccc09172b6061c9",
                        clientSecret: "a5067a206ff93f09ee7cc0de3b465b77ef6f47a3",
                        callbackURL: "http://localhost:3000/users/auth/github/callback"
                    },
                    async function(accessToken, refreshToken, profile, cb) {
                        console.log(profile);
                        var user = new User({
                            name: profile.displayName,
                            username: profile.username,
                            lang: "en",
                            pdp: profile.photos[0].value,
                            password: crypto.randomBytes(64).toString('hex'),
                            token: crypto.randomBytes(64).toString('hex'),
                            isValid: 1,
                            ID_FT: '',
                            ID_GH: profile.id,
                            ID_FB: ''
                        });
                        let usr = await User.findOne({
                            ID_GH: profile.id
                        })

                        if (!usr) {
                            usr = await user.save();
                        }
                        return cb(null, usr);
                    }
                )
            );

            passport.use(
                new SpotifyStrategy({
                        clientID: "1999251ffc044f2895f82d95a75345fb",
                        clientSecret: "db868ccdb24743eda1e4e23168a62a20",
                        callbackURL: 'http://localhost:3000/users/auth/spotify/callback'
                    },
                    async function(accessToken, refreshToken, profile, cb) {
                        console.log(profile);
                        var user = new User({
                            name: profile.displayName,
                            username: profile.username,
                            // email: profile.emails[0].value,
                            lang: "en",
                            password: crypto.randomBytes(64).toString('hex'),
                            token: crypto.randomBytes(64).toString('hex'),
                            isValid: 1,
                            ID_FT: '',
                            ID_GH: '',
                            ID_SP: profile.id
                        });
                        let usr = await User.findOne({
                            ID_SP: profile.id
                        });

                        if (!usr) {
                            usr = await user.save()
                        }
                        console.log(usr);
                        return cb(null, usr);
                    }
                )
            );

            passport.use(
                new _42Strategy({
                        clientID: "59218a07e0871fd7049e4a9ca423f3ecd38ece77f88d9c693974431299fd0f30",
                        clientSecret: "727fa6f48ad02232eeee2c233bf2d0901eac4b097c0d798290fb5d6ab5ea1955",
                        callbackURL: "http://localhost:3000/users/auth/42/callback"
                    },
                    async function(accessToken, refreshToken, profile, cb) {
                        console.log('test');
                        var user = new User({
                            name: profile.displayName,
                            username: profile.username,
                            email: profile.emails[0].value,
                            lang: "en",
                            pdp: profile.photos[0].value,
                            password: crypto.randomBytes(64).toString('hex'),
                            token: crypto.randomBytes(64).toString('hex'),
                            isValid: 1,
                            ID_FT: profile.id,
                            ID_GH: '',
                            ID_FB: ''
                        });
                        let usr = await User.findOne({
                            ID_FT: profile.id
                        });

                        if (!usr) {
                            usr = await user.save()
                        }
                        console.log(usr);
                        return cb(null, usr);
                    }
                ));
        }
    });
};