var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var crypto = require('crypto');


//var User = require('../models/admin/admin_user');
var User = require('../models/admin/admin');

//var login_me_in = require('.../');

//express.use(bodyParser.json());


//router.post('/register', function(req, res){


module.exports.regMe = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ username: username }, function(err, user)
    {
        if (err)
            throw (err);

        // make sure the user exists
        if (!user) {
            throw (err);
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch)
        {
            if (err)
                throw (err);

            // check if the password was a match
            if (isMatch)
            {
                res.json({status:'welcome '+email})
            }

        });
    });
}

module.exports.logAdminIn = function (req, res) {

    //var email = req.body.email;
    //var password = req.body.password;

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch)
            {
                if (isMatch && !err)
                {
                    // if user is found and password is right create a token
                    //var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    //res.json({success: true, token: 'JWT ' + token});
                    res.json({success: true, message: 'success'});
                    console.log('Inside....')
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                    console.log('Error....')

                }
            });
        }
    });
}

module.exports.registerAdmin = function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.confirm_password;
    console.log("Name is :" + name, "Email :" + email, "username :" + username)

    // Validation
    //req.checkBody('name', 'Name is required').notEmpty();
    //req.checkBody('email', 'Email is required').notEmpty();
    //req.checkBody('email', 'Email is not valid').isEmail();
    //req.checkBody('username', 'Username is required').notEmpty();
    //req.checkBody('password', 'Password is required').notEmpty();
    //req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    //
    //var errors = req.validationErrors();
    //
    //if(errors){
    //    //res.render('admin_register',{
    //    //    errors:errors
    //    //});
    //    console.log(' we have errors: '+ errors);
    //} else {
    //    var newUser = new User({
    //        name: name,
    //        email:email,
    //        username: username,
    //        password: password
    //    });
    //
    //    User.createUser(newUser, function(err, user)
    //    {
    //        if(err) throw err;
    //        console.log(user);
    //    });
    //
    //    console.log('Registered')
    //    req.flash('success_msg', 'You are registered and can now login');
    //
    //    //res.redirect('/users/login');
    //
    //}


    //var email = req.body.email;
    //var password = req.body.password;
    //var username = email.split("@");// the string before "@" is the username
    //username = username[0];// create username by reading from alphabet at position zero
    //var userModel = new User();
    //userModel.email = email;
    //userModel.password = crypto.createHash('md5').update(password).digest("hex");
    //userModel.username = username;
    //var userModel = new User();
    //userModel.save(function(err) {
    //if (error) {
    //    res.json('register', {
    //        title: 'Register Failed',
    //        error: 'Technical error occured' + util.inspect(err)
    //    });
    //}
    //else {


    var newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
    });


    User.createUser(newUser, function (err, user) {
        if (err) {
            throw err;
        }
        else {
            console.log(user);

            res.status(500);
            res.json({
                title: 'Register successful',
                error: false
                //error: 'Technical error occured' + util.inspect(err)
            });
        }


    });

}


//var User = mongoose.model('User');
//module.exports.loginAdmin = function (app, mongoose, config) {
//var User = mongoose.model('User');

module.exports.loginAdmin = function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    var password = crypto.createHash('md5').update(password).digest("hex");
    User.findOne(
        {
            email: email,
            password: password
        },
        function (err, userInfo) {
            if (err) {
                res.status(500);
                res.json(
                    {
                        status: 'Inside'
                    })
                //res.render('500',
                //    {
                //        err: err,
                //        url: req.url
                //    });
            }
            else {
                if (userInfo) {
                    req.session.user = userInfo;
                    res.json(
                        {
                            status: 'home'
                        })
                    //res.redirect('/');
                }
                else {
                    //res.render('login', {
                    //    title: 'Login failed',
                    //    error: 'Incorrect username/passord'
                    //});
                    res.json(
                        {
                            status: 'failed'
                        })
                }
            }
        });


    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.getUserByUsername(username, function (err, user) {
                if (err) throw err;
                if (!user) {
                    return done(null, false, {message: 'Unknown User'});
                    res.json('unknown user')
                }

                User.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Invalid password'});
                        res.json('Invalid password')

                    }
                });
            });
        }));
}
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

