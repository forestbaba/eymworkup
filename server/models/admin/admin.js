//var express = require('express');
//var router = express.Router();
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//
//
//passport.use(new LocalStrategy(
//    function(username, password, done) {
//        User.getUserByUsername(username, function(err, user){
//            if(err) throw err;
//            if(!user){
//                return done(null, false, {message: 'Unknown User'});
//                res.json('unknown user')
//            }
//
//            User.comparePassword(password, user.password, function(err, isMatch){
//                if(err) throw err;
//                if(isMatch){
//                    return done(null, user);
//                } else {
//                    return done(null, false, {message: 'Invalid password'});
//                    res.json('Invalid password')
//
//                }
//            });
//        });
//    }));
//
//passport.serializeUser(function(user, done) {
//    done(null, user.id);
//});
//
//passport.deserializeUser(function(id, done) {
//    User.getUserById(id, function(err, user) {
//        done(err, user);
//    });
//});
//
//router.post('/login',
//    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
//    function(req, res) {
//        res.redirect('/');
//    });
//
//router.get('/logout', function(req, res){
//    req.logout();
//
//    req.flash('success_msg', 'You are logged out');
//
//    res.redirect('/users/login');
//    res.json('You are logged out')
//});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var gensalt = 10;

var userschema = Schema(
    {
        email: {
            type: String,
            required: true,
            index: {
                unique: true
            },
        },
        password: {
            type: String,
            required: true
        }

    });


userschema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(gensalt, function (err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
})


userschema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//if (userInfo) {
//    req.session.user = userInfo;
//    res.json(
//        {
//            status: 'home'
//        })
//    //res.redirect('/');
//}
//else {
//    //res.render('login', {
//    //    title: 'Login failed',
//    //    error: 'Incorrect username/passord'
//    //});
//    res.json(
//        {
//            status: 'failed'
//        })
//}


//userschema.statics.getAuthenticated = function(username, password, cb)
userschema.methods.getAuthenticated = function(username, password, cb)
{
    this.findOne({ username: username }, function(err, user)
    {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(err);
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch)
        {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch)
            {
                return cb(null, user);
                //return user.update(updates, function(err)
                //{
                //    if (err) return cb(err);
                //    return cb(null, user);
                //});
            }

        });
    });
};




module.exports = mongoose.model('admin', userschema);
