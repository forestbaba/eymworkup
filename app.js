var express = require('express');
var app = express();
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var expressValidator = require('express-validator');
var jade = require('jade');
var favicon = require('serve-favicon');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var session = require('express-session');
var passport = require('passport');
var MongoDBStore = require('connect-mongodb-session')(session);
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');


//var audioUploadController = require('./server/controllers/audio-controller.js');
//var adminRegister = require('./server/controllers/admin-register-controller.js');
var User = require('./server/models/admin/admin_schema');
var Audio = require('./server/models/admin/audio_schema');

mongoose.connect(process.env.MONGODB_URI );

//mongoose.connect('mongodb://localhost/eym');


app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client'));//	__dirname is a  local to each module.
app.use('/client', express.static(__dirname + '/client'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(__dirname + '/client/public/assets/ico/favicon.ico'));
app.set('view engine', 'jade');

app.use(morgan('dev'))

passport.use(new LocalStrategy(User.authenticate()));

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'html');
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(flash());

//New things included to test the new api
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();

});



app.get('/', function (req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());

    //  res.send('Please visit /api/users and ');
    //res.sendfile('./client/index.html');
    //res.render('./client/index.html');

});
//var passport = require('passport');
//require('./server/controllers/passport')(passport); // pass passport for configuration

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});
var isValidPassword = function (user, password)
{
    return bcrypt.compareSync(password, user.password);
};


//
//passport.use(new LocalStrategy(
//
//        function (username, password, done) {
//
//            User.findOne({username: username}, function (err, user) {
//
//                if (err) {
//                    return done(err, {message: 'we have an error'});
//                }
//                if (!user) {
//                    return done(null, false, {alert: 'Incorrect username.'});
//                }
//
//                if (!isValidPassword(user, password)) {
//                    console.log('Invalid Password');
//                    return done(null, false); // redirect back to login page
//                }
//                return done(null, user);
//            });
//        }
//    )
//);


//app.post('/api/upload', multipartMiddleware, audioUploadController.uploadAudio);
//app.get('/api/upload/get', audioUploadController.getAudioFiles);
//app.get('/api/download/:title', audioUploadController.downloadAudio)
////app.delete('/api/download/:location',  audioUploadController.deleteFile)
//app.delete('/api/download/:id', audioUploadController.deleteFile)
//app.post('/api/admin/register', adminRegister.registerAdmin);

app.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
    console.log('outside now')
});

app.post('/api/logout', function(req, res)
{
    console.log('present 1 user now is.....' + req.user)
    req.logOut();
    console.log('present user now is.....' + req.user)
    res.send(200);
});

app.post('/x', passport.authenticate('local'), function (req, res)
{
    console.log('am here first');
    res.send(req.isAuthenticated() ? req.user : '0');
    //res.json(req.user);
    console.log("consoling  " + req.user);
});

app.get("/api/loggedin", function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
})


app.post('/register', function (req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;

    var user = new User({
        name: name,
        username: username,
        password: password

    });

    user.save(function (err, user1) {
        if (err)
            throw err;
        res.json(user1);
    })
});

//app.post('/api/admin/loginAdm',  passport.authenticate('local'), adminRegister.logAdminIn);
app.post('/api/admin/loginAdm', passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});


app.post('/login', function (req, res, next) {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!'
            });
            console.log('----------inside------------');
        });
    })(req, res, next);
});

app.post('/registerMe', function (req, res)
{

    User.register(new User({name:req.body.name, username: req.body.username, email:req.body.email}),


        req.body.password, function (err, account) {
            if (err)
            {
                return res.status(500).json({
                    err: err
                });
            }
            console.log(account);
            console.log('---------------working good---------');

            passport.authenticate('local')(req, res, function ()
            {
                return res.status(200).json({
                    status: 'Registration successful!'
                });

            });
        });
});


app.post('/uploadAudio', function(req, res)
{

    var title = req.body.title;
    var description = req.body.description;
    var downloadlink = req.body.downloadlink;

    var audio = new Audio({
        title: title,
        description: description,
        downloadlink: downloadlink

    });

    audio.save(audio, function (err, aud) {
        if (err)
            throw err;
        res.json(aud);
        console.log(aud);
    })

});


app.get('/status', function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
    console.log('The status: is alive');
});

app.get('/getAudio', function(req, res)
{

    Audio.find({})
            .sort({date: -1})
            .exec(function (error, allFiles) {
                if (error) {
                    res.error(error)
                }
                else {
                    res.json(allFiles);
                }
            });
});

app.delete('/audio/:_id',function(req, res)
{
    var id = req.params._id;
    Audio.deleteOne(id, function(err, file)
    {
        if(err)
        {
            throw err;
        }
        res.json(file);
    });
});


//app.get('/api/admin/logout', adminRegister.logAdminOut);

//app.post('/api/admin/signsign', adminRegister.signup);
//app.post('/api/admin/auth', adminRegister.authenticate);
//app.get('/api/admin/memberinfo', passport.authenticate('jwt', {session: false}), adminRegister.memberInfo);

//require('./server/controllers/admin-class')(app, passport);

//This line is very important for reload of pages, else, it will be displaying error when reload
//Note also that it show be
// added to down below the end points, else it will be blocking req and res made to the end point
app.use(function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.listen(process.env.PORT || 803, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
