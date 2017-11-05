//var User = require('../models/admin/admin_user')
//module.exports = function (app, passport) {
//    // process the login form
//    app.post('/loginAds', passport.authenticate('local-login'), function (req, res) {
//        res.json(req.user);
//    });
//
//    app.post("/signupAds", function (req, res)
//    {
//        User.findOne({
//            username: req.body.username
//        }, function (err, user) {
//            if (user) {
//                res.json(null);
//                return;
//            } else {
//                var newUser = new User();
//                newUser.username = req.body.username.toLowerCase();
//                newUser.password = newUser.generateHash(req.body.password);
//                newUser.save(function (err, user) {
//                    req.login(user, function (err) {
//                        if (err) {
//                            return next(err);
//                        }
//                        res.json(user);
//                    });
//                });
//            }
//        });
//    });
//}