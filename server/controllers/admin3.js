var Usez = require('../models/admin/admin_user');
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh',{ expiresIn: 60 * 1 });


module.exports.authenticate = function (req, res) {

    //var email = req.body.email;
    //var password = req.body.password;

    Usez.findOne({
        email: req.body.email,
        password: req.body.password
    }, function (err, user) {
        if (err) {
            res.json({
                type: false,
                data: 'Error Occured: ' + err
            });
        }
        else {
            if (user) {
                res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            }
            else {
                res.json({
                    type: false,
                    data: 'Incorrect Email/password '
                });
            }
        }
    });
}


module.exports.signers = function (req, res) {

    //var email = req.body.email;
    //var password = req.body.password;

    Usez.findOne({
        email: req.body.email,
        password: req.body.password
    }, function (err, user) {
        if (err) {
            res.json({
                type: false,
                data: 'Error Occured: ' + err
            });
        }
        else {
            if (user) {
                res.json({
                    type: false,
                    data: 'User already exists',
                });
            }
            else {
                var usermodel = new Usez();
                usermodel.email = req.body.email;
                usermodel.password = req.body.password;
                usermodel.save(function (err, user) {
                    //user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.token = jwt.sign(user, token);

                    user.save(function (err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        })
                    })
                })

            }
        }
    });
}


module.exports.getterz = function (req, res) {

    //var email = req.body.email;
    //var password = req.body.password;

    Usez.findOne({
            token: req.token,
        },
        function (err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: 'Error Occured: ' + err
                });
            }
            else {

                res.json({
                    type: true,
                    data: user
                });

            }
        });
}



