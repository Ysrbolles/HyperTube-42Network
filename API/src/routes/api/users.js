const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../Models/User');
const Comment = require('../../Models/Comment');

const key = require('../../config/keys').secret;
const valid = require('../../helper/validation');
const sendMail = require('../../helper/mails.js');
const mmm = require('mmmagic'),
    Magic = mmm.Magic;
const magic = new Magic(mmm.MAGIC_MIME_TYPE);
/**
 * @route Post api/users/register
 * @desc Register the user
 * @access Public
 */

router.post('/register', function(req, res, next) {
    var error = "";
    req.body.username = req.body.username.toLowerCase();
    req.body.email = req.body.email.toLowerCase();
    let {
        name,
        username,
        email,
        password,
        confirm_password
    } = req.body


    if (!valid.Email(email))
        error = error + "| invalid Email"
    if (!valid.User(username))
        error = error + "| invalid Username"
    if (!valid.Name(name))
        error = error + "| invalid Name format"
    if (!valid.Pass(password))
        error = error + "| Password is weak"
    if (error.length > 0) {
        return res.status(200).json({
            msg: error
        })
    } else {
        if (password !== confirm_password) {
            console.log("Password do not match.")
            return res.status(200).json({
                msg: "Password do not match."
            })
        } else {
            // Check for the unique UserName
            User.findOne({
                username: username
            }).then(user => {
                if (user) {
                    console.log("Username is already taken.")

                    return res.status(200).json({
                        msg: "Username is already taken."
                    })
                } else {
                    // Check for the unique Email
                    User.findOne({
                        email: email
                    }).then(user => {
                        if (user) {
                            return res.status(200).json({
                                msg: "Email is already taken."
                            })
                        } else {
                            // The data is valid and we can register the user
                            var token = crypto.randomBytes(10).toString('hex');
                            let newUser = new User({
                                name,
                                username,
                                password,
                                email,
                                token
                            });

                            //  hash the Password
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    newUser.password = hash;
                                    newUser.save().then(user => {
                                        sendMail.Verif(newUser.token, newUser.name, newUser.email);
                                        return res.status(200).json({
                                            success: true,
                                            msg: "User is now registred, Please check your email to validate your acount"
                                        });
                                    })
                                })
                            })
                        }
                    }).catch((e) => {
                        console.log(e);
                        return res.status(200).json({
                            success: false,
                            msg: "Somethign went wrong, Please try later!"
                        });
                    })
                }
            }).catch((e) => {
                console.log(e);
                return res.status(200).json({
                    success: false,
                    msg: "Somethign went wrong, Please try later!"
                });
            })
        }
    }
});

/**
 * @route Post api/users/login
 * @desc Signing in the User
 * @access Public
 */

router.post('/login', function(req, res, next) {

    if (typeof req.body.username == "undefined" || typeof req.body.password == "undefined") {
        return res.status(200).json({
            msg: "invalid data!",
            success: false
        });
    } else if (typeof req.body.username != "string" || typeof req.body.password != "string") {
        return res.status(200).json({
            msg: "invalid data!",
            success: false
        });
    } else if (!valid.User(req.body.username) || !valid.Pass(req.body.password)) {
        return res.status(200).json({
            msg: "invalid input!",
            success: false
        });
    } else {
        User.findOne({ username: req.body.username.toLowerCase() }).then(user => {
            if (!user) {
                return res.status(200).json({
                    msg: "Username is not found",
                    success: false
                });
            }
            // if there is User we are now going to compare the password
            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if (isMatch) {
                    // Users's password is correct and we need to send the JSON Token for that user
                    const payload = {
                        _id: user._id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        pdp: user.pdp
                    }
                    jwt.sign(payload, key, {
                        expiresIn: 3600 * 48
                    }, (err, token) => {
                        if (!err) {
                            if (user.isValid == "0") {
                                return res.status(200).json({
                                    msg: "Your account is not validated yet!",
                                    success: false
                                });
                                // return res.send("Your account is not validated yet!")
                            } else {
                                res.status(200).json({
                                    success: true,
                                    user: user,
                                    token: `Bearer ${token}`,
                                    msg: "YUP! You are now Logged In."
                                });

                            }

                        }
                    })
                } else {
                    return res.status(200).json({
                        msg: "Incorrect Password.",
                        success: false
                    });
                }
            })
        })
    }

});

/**
 * @route Post api/users/validation
 * @desc Validate the account of the registred user
 * @access Public
 */
router.get('/validation/:token', function(req, res, next) {
    if (req.params.token !== undefined) {
        User.findOne({ token: req.params.token }).then(user => {
            if (!user) {
                return res.status(200).json({
                    success: false,
                    msg: "invalid token"
                });
            } else {
                user.isValid = "1";
                user.token = crypto.randomBytes(10).toString('hex');
                user.save().then(user => {
                    return res.status(200).json({
                        success: true,
                        msg: "Your accounts validated now, You can login!"
                    });
                }).catch(e => {
                    return res.status(200).json({
                        success: false,
                        msg: "Something wrong! Please try later!"
                    });
                })
            }
        })
    } else {
        return res.status(200).json({
            success: false,
            msg: "invalid token"
        });
    }
});

/**
 * @route Post api/users/reset
 * @desc Change the password
 * @access Public
 */
router.post('/reset', function(req, res, next) {
    try {
        if (req.body.token !== undefined && req.body.password !== undefined && req.body.cpassword !== undefined) {
            if (valid.Pass(req.body.password) && valid.Pass(req.body.cpassword)) {
                if (req.body.password == req.body.cpassword) {
                    User.findOne({ token: req.body.token }).then(user => {
                        if (!user) {
                            return res.status(200).json({
                                success: false,
                                msg: "invalid token"
                            });
                        } else {
                            if (user.isValid == 1) {
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                                        if (err) throw err;
                                        user.password = hash;
                                        user.token = crypto.randomBytes(10).toString('hex');
                                        user.save().then(user => {
                                            user.save().then(user => {
                                                return res.status(201).json({
                                                    success: true,
                                                    msg: "Your account's password has been changed succefully!'"
                                                });
                                            }).catch(e => {
                                                console.log(e);
                                                return res.status(200).json({
                                                    success: false,
                                                    msg: "Something wrong!"
                                                });
                                            })
                                        })
                                    })
                                })
                            } else {
                                return res.status(200).json({
                                    success: false,
                                    msg: "You need to validate your account first "
                                });
                            }
                        }
                    })
                } else {
                    return res.status(200).json({
                        success: false,
                        msg: "Passwords doesnt match!"
                    });
                }
            } else {
                return res.status(200).json({
                    success: false,
                    msg: "Invalid Password, Please respect the password format given below!"
                });
            }

        } else {
            return res.status(200).json({
                success: false,
                msg: "Invalid Data!"
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            success: false,
            msg: "Somethign went Wrong Please try again!"
        });
    }
});
/**
 * @route Post api/users/forgotpasswd
 * @desc Send the reset password link to users's email
 * @access Public
 */
router.post('/forgotpasswd', function(req, res, next) {
    if (req.body.email !== undefined) {
        if (valid.Email(req.body.email)) {
            User.findOne({ email: req.body.email }).then(user => {
                if (!user) {
                    return res.status(200).json({
                        success: false,
                        msg: "invalid email!"
                    });
                } else {
                    sendMail.Reset(user.email, user.token, user.username);
                    return res.status(200).json({
                        success: true,
                        msg: "email sent"
                    });
                }
            })
        } else {
            return res.status(200).json({
                success: false,
                msg: "invalid Email!"
            });
        }
    } else {
        return res.status(200).json({
            success: false,
            msg: "invalid data"
        });
    }
});
/**
 * @route Post api/users/updateprofile
 * @desc update profile's data
 * @access Public/connected
 */

router.post('/updateprofile', passport.authenticate('jwt', {
        session: false
    }), async(req, res) => {
        try {
            var error = ""
            if (req.body.email !== undefined &&
                req.body.name !== undefined &&
                req.body.lang !== undefined &&
                req.body.username !== undefined ) {

            
                        if (!valid.Name(req.body.name))
                        error = error + " | invalid Name";
    
                    if (!valid.User(req.body.username))
                        error = error + " | invalid UserName";
    
                    if (!valid.Email(req.body.email))
                        error = error + " | invalid Email";
    
                    if (req.body.lang.length != 2 || typeof req.body.lang != 'string')
                        error = error + " | invalid Language format";
                    else if (req.body.lang != 'en' && req.body.lang != 'fr')
                        error = error + " | invalid Language format!";
                    


                if (error.length != 0) {
                    return res.status(200).json({
                        success: false,
                        msg: error
                    });
                } else {
                    try {
                        if (await ft_taken_email(req.body.email, req.user.token) == 0)
                            error = error + " | Email taken";
                        if (await ft_taken_username(req.body.username, req.user.token) == 0)
                            error = error + " | Username taken";

                        if (error.length != 0) {
                            console.log(error)
                            return res.status(200).json({
                                success: false,
                                msg: error
                            });
                        } else {
                            try {
                                console.log(req.body.lang)
                                await ft_update_username_comment(req.user.username, req.body.username);
                                await ft_update_profile(req.user.token, req.body.name, req.body.email, req.body.username, req.body.lang);
                                return res.status(200).json({
                                    success: true,
                                    msg: "Profile Updated Succefully!"
                                });
                            } catch (error) {
                                console.log(error);
                                return res.status(200).json({
                                    success: true,
                                    msg: "Something Went Wrong Please try later!"
                                });
                            }

                        }
                    } catch (error) {
                        console.log(error)
                        return res.status(200).json({
                            success: true,
                            msg: "Something Went Wrong Please try later!"
                        });
                    }

                }

            } else
                return res.status(200).json({
                    success: false,
                    msg: "Invalid Data!"
                });
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                success: true,
                msg: "Something Went Wrong Please try later!"
            });
        }
    })
    /**
 * @route Post api/users/updatePassword
 * @desc update profile's password
 * @access Connected
 */

router.post('/updatepassword', passport.authenticate('jwt', {
    session: false
}), async(req, res) => {
    try {
        var error = ""
        if (req.body.pass !== undefined &&
            req.body.cpass !== undefined) {
            if(typeof req.body.pass != 'string' || typeof req.body.cpass != 'string')
            error = error + " invalid input";
            else{
                if (!valid.Pass(req.body.pass))
                error = error + " Invalid Password format, please respect the rules given below";
                else{
                    if(req.body.pass != req.body.cpass)
                    error = error + " passwords doesnt match!";
            }   
            }
 
            if (error.length != 0) {
                return res.status(200).json({
                    success: false,
                    msg: error
                });
            } else {
                try {
                    await ft_update_password(req.user.username, req.body.cpass)
                    return res.status(200).json({
                        success: true,
                        msg: "Password Updated Succefully!"
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(200).json({
                        success: true,
                        msg: "Something Went Wrong Please try later!"
                    });
                }
            }
        } else
            return res.status(200).json({
                success: false,
                msg: "Invalid Data!"
            });
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            success: true,
            msg: "Something Went Wrong Please try later!"
        });
    }
})
    /**
     * @route Post api/users/updatepicture
     * @desc update user's profile picture
     * @access Connected users
     */

router.post('/updatepicture', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        try {
            //Set The Storage Engine
            const storage = multer.diskStorage({
                destination: './public/images/',
                filename: function(req, file, cb) {
                    cb(null, req.user._id + Date.now() + path.extname(file.originalname));
                }
            });

            // Init Upload
            const upload = multer({
                storage: storage,
                limits: {
                    fileSize: 10000000
                },
                fileFilter: function(req, file, cb) {
                    checkFileType(file, cb);
                }
            }).single('image');
            // Check File Type
            function checkFileType(file, cb) {
                // Allowed ext
                const filetypes = /jpeg|jpg|png|gif/;
                // Check ext
                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                // Check mime
                const mimetype = filetypes.test(file.mimetype);

                if (mimetype && extname) {
                    return cb(null, true);
                } else {
                    cb('Error: Images Only!');
                }
            }

            upload(req, res, async(err) => {
                if (err) {
                    res.send('invalid image')
                } else {
                    if (req.file == undefined) {
                        res.send('no file')
                    } else {
                        try {
                            magic.detectFile('./public/images/' + req.file.filename, async function(err, result) {
                                if (err)
                                    console.log(err);
                                else
                                if (result == "image/jpeg" || result == "image/jpg" || result == "image/png" || result == "image/gif") {
                                    await ft_update_picture(req.user._id, "http://localhost:3000/images/" + req.file.filename);
                                    await ft_update_pic_comment(req.user.username, "http://localhost:3000/images/" + req.file.filename);
                                    res.send('Profile picture updated successfully.')
                                } else {
                                    fs.unlinkSync('./public/uploads/' + req.file.filename);
                                    res.send('Please Choose a valid picture')
                                }
                            });
                        } catch (e) {
                            return res.status(200).json({
                                success: true,
                                msg: "Something Went Wrong Please try later!"
                            });
                        }
                    }
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                success: true,
                msg: "Something Went Wrong Please try later!"
            });
        }

    })
    /**
     * @route Post api/users/updateprofile
     * @desc update user's profile infos
     * @access Connected
     */

router.get('/profile', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        return res.json({
            user: req.user
        })

    })
    /**
     * * @route Post api/users/user
     * * @desc visit others profile
     * * @access Connected
     */

router.post('/user', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    if (typeof req.body.user != 'undefined' && typeof req.body.user == 'string') {
        var data = {}

        User.findOne({ username: req.body.user }).then(user => {
            if (!user) {
                return res.status(200).json({
                    success: false,
                    user: req.user
                });
            } else {

                data.name = user.name;
                data.username = user.username;
                data.date = user.date;
                data.pdp = user.pdp;
                console.log(data);
                return res.json({
                    user: data
                })
            }
        })

    } else {
        return res.status(200).json({
            success: false,
            msg: "invalid input"
        });
    }

})

router.get('/auth/spotify', passport.authenticate('spotify'));

router.get('/auth/spotify/callback',
    passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'], failureRedirect: '/login' }),
    function(req, res) {
        const payload = {
            _id: req.user._id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            pdp: req.user.pdp
        }
        jwt.sign(payload, key, {
            expiresIn: 3600 * 48
        }, (err, token) => {
            if (!err) {
                token = `Bearer ${token}`
                res.redirect(`http://localhost:8080/login?token=` + token)
            }
        })
    });

router.get("/auth/42", passport.authenticate("42"));

router.get(
    "/auth/42/callback",
    passport.authenticate("42", { failureRedirect: "/login" }),
    function(req, res) {
        const payload = {
            _id: req.user._id,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email,
            pdp: req.user.pdp
        }
        jwt.sign(payload, key, {
            expiresIn: 3600 * 48
        }, (err, token) => {
            if (!err) {
                token = `Bearer ${token}`
                res.redirect(`http://localhost:8080/login?token=` + token)
            }
        })
    }
);

router.route("/auth/github").get(passport.authenticate("github"));

router
    .route("/auth/github/callback")
    .get(passport.authenticate("github", { failureRedirect: "/login" }),
        function(req, res) {
            const payload = {
                _id: req.user._id,
                username: req.user.username,
                name: req.user.name,
                email: '',
                pdp: req.user.pdp
            }
            jwt.sign(payload, key, {
                expiresIn: 3600 * 48
            }, (err, token) => {
                if (!err) {
                    token = `Bearer ${token}`
                    res.redirect(`http://localhost:8080/login?token=` + token)
                }
            })
        });

router.get('/', (req, res) => {
    return res.redirect('/users/profile');
})
router.get('/login', (req, res) => {
    return res.redirect('/users/profile');
})



function ft_taken_email(email, token) {
    return new Promise(function(resolve, reject) {

        User.findOne({ email: email.toLowerCase() }).then(user => {
            if (!user) {
                resolve(1);
            } else {
                if (user.token == token)
                    resolve(1);
                else
                    resolve(0)
            }
        })
    })
}

function ft_taken_username(username, token) {
    return new Promise(function(resolve, reject) {
        User.findOne({ username: username.toLowerCase() }).then(user => {
            if (!user) {
                resolve(1);
            } else {
                if (user.token == token)
                    resolve(1);
                else
                    resolve(0)
            }
        })
    })
}

function ft_update_profile(token, name, email, username, lang) {
    return new Promise(function(resolve, reject) {

        User.findOne({ token: token }).then(async(user) => {
            if (!user) {
                reject(0);
            } else {
                user.email = email.toLowerCase();
                user.username = username.toLowerCase();
                user.lang = lang;
                user.name = name;
                user.save().then(user => {
                    resolve(1);
                }).catch(e => {
                    reject(e);
                })
            }
        })
    })
}
function ft_update_password(username, newPass) {
    return new Promise(function(resolve, reject) {

        User.findOne({ username: username }).then(async(user) => {
            if (!user) {
                reject(0);
            } else {
                try {
                    user.password = await ft_hash_pass(newPass);
                } catch (error) {
                    reject(error)
                }
                user.save().then(user => {
                    resolve(1);
                }).catch(e => {
                    reject(e);
                })
            }
        })
    })
}

function ft_hash_pass(passToHash) {
    return new Promise(function(resolve, reject) {
        //  hash the Password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(passToHash, salt, (err, hash) => {
                if (err) reject(err);
                else resolve(hash);
            })
        })
    })
}

function ft_update_picture(id, picture) {
    return new Promise(function(resolve, reject) {

        User.findOne({ _id: id }).then(async(user) => {
            if (!user) {
                reject(0);
            } else {
                user.pdp = picture;
                user.save().then(user => {
                    resolve(1);
                }).catch(e => {
                    reject(e);
                })
            }
        })
    })
}

function ft_update_pic_comment(username, picture) {
    return new Promise(function(resolve, reject) {

        Comment.update({ username: username }, { $set: { pdp: picture } }, { multi: true }, function(err) {
            if (err)
                reject(err)
            else
                resolve(1);
        });

    })
}

function ft_update_username_comment(oldUser, newUser) {
    return new Promise(function(resolve, reject) {

        Comment.update({ username: oldUser }, { $set: { username: newUser } }, { multi: true }, function(err) {
            if (err)
                reject(err)
            else
                resolve(1);
        });

    })
}
module.exports = router;