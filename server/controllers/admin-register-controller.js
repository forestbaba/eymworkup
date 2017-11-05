var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var jwt = require('jwt-simple');


var User = require('../models/admin/admin_user');
var config = require('../helpers/dbconst');
//var User = require('../models/admin/newadmin');

const saltRounds = 10;

module.exports.regMe = function (req, res) {

    var name = req.body.dname;
    var email = req.body.demail;
    var username = req.body.dusername;
    var password = req.body.dpassword;


    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err)
            throw err;

        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: hash
        });
        newUser.save();
        res.json(req.body);

        // Store hash in your password DB.
    });

}

module.exports.signup = function (req, res) {
    if (!req.body.name || !req.body.username || !req.body.password) {
        res.json({success: false, msg: 'pass name and password'});
    } else {
        var newUser = User(
            {
                name: req.body.name,
                username: req.body.username,
                password: req.body.password
            });
        newUser.save(function (err, user) {
            if (err) {
                res.json({success: false, msg: 'pass appropriate details'});
            } else {
                res.json({success: true, msg: 'successfully created'});
                console.log(user);

            }
        })
    }
}


module.exports.authenticate = function (req, res) {
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
}

module.exports.memberInfo = function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    }
    else
    {
        return null;
    }
};

module.exports.registerAdmin = function (req, res, next) {
    passport.authenticate('local', {successFlash: 'Welcome!'});

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    console.log('coming through.....')


    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err)
            throw err;

        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: hash
        });
        newUser.save();
        console.log('Inside....')

        return res.redirect('admin_login');
        req.flash('success_msg', 'You are registered and can now login');

        next();

        res.json(req.body);

    });



}

module.exports.logAdminIn = function (req, res) {
    //passport.authenticate('local',
    //    {
    //        //        successRedirect: '/',
    //        //        failureRedirect: 'admin'
    //    });
    //res.json(req.user);
    //
    //res.redirect('/');
    //
    //console.log('ploom');
    //
    //app.post("/login", passport.authenticate('local-login'), function(req, res) {
        res.json(req.user);
    //});


}
module.exports.logAdminOut = function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }

            bcrypt.compare(password, user.password, function (err, res) {
                if (err)
                    throw err;

                if (res == true) {
                    console.log('correct password');
                    return done(null, user);
                }
                else {
                    console.log('incorrect password');
                    return done(null, false);
                    res.json('Incorrect password');

                }
                // res == true
            });
        });
    }
));

module.exports.loginAdmin = function (req, res)
{

}


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.getUserById(id, function (err, user) {
            done(err, user);
        });
    });

