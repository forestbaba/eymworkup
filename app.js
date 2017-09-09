var express = require('express');
var app = express();
var http = require('http');
var mongoose = require ('mongoose');
var path = require('path');
var bodyParser = require('body-parser');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var expressValidator = require('express-validator');
var jade = require('jade');
var favicon = require('serve-favicon');

var jwt = require('jsonwebtoken');



var audioUploadController = require('./server/controllers/audio-controller.js');
var adminRegister = require('./server/controllers/admin-register-controller.js');
var adz = require('./server/controllers/admin3');

mongoose.connect('mongodb://localhost/eym');
var db = mongoose.connection;



app.set('port', process.env.PORT || 0803);

app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/client'));//	__dirname is a  local to each module.
app.use('/client', express.static(__dirname + '/client'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(__dirname +'/client/public/assets/ico/favicon.ico'));
app.set('view engine', 'jade');

//app.set('view engine', 'html');
app.use('/node_modules', express.static(__dirname + '/node_modules'));



//New things included to test the new api
app.use(function (req, res, next)
{
    res.setHeader('Access-Control-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, Authorization');
    next();

});



//app.use(expressValidator({
//    errorFormatter: function(param, msg, value) {
//        var namespace = param.split('.')
//            , root    = namespace.shift()
//            , formParam = root;
//
//        while(namespace.length) {
//            formParam += '[' + namespace.shift() + ']';
//        }
//        return {
//            param : formParam,
//            msg   : msg,
//            value : value
//        };
//    }
//}));


//
//app.get('/', function(req, res)
//{
//     res.send('Please visit /api/users and ');
//    //res.sendfile('./client/index.html');
//    //res.render('./client/index.html');
//
//});

app.post('/api/upload',multipartMiddleware, audioUploadController.uploadAudio);
app.get('/api/upload/get', audioUploadController.getAudioFiles);
app.get('/api/download/:title',  audioUploadController.downloadAudio)
//app.delete('/api/download/:location',  audioUploadController.deleteFile)
app.delete('/api/download/:id',  audioUploadController.deleteFile)
app.post('/api/admin/register',  adminRegister.regMe);
app.post('/api/admin/login',  adminRegister.logAdminIn);

app.post('/api/admin/authenticate',  adz.authenticate);
app.post('/api/admin/signers',  adz.signers);
app.get('/api/admin/me', ensureAuthorized, adz.getterz);

function ensureAuthorized(req, res, next)
{
    var bToken;
    var bHeader = req.headers["authorized"];
    if(typeof bHeader !== 'undefined')
    {
        var bearer = bHeader.split(" ");
        bToken = bearer[1];
        req.token = bToken;
        next();

    }
    else
    {
        res.send(403)
    }
}


//app.post('/api/admin/login',  adminRegister.loginAdmin);


//app.delete('/api/download/:_id',  audioUploadController.deleteFile)



app.listen(process.env.PORT || 803, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
//http.createServer(app).listen(app.get('port'), function () {
//    console.log("Express server listening on port " + app.get('port'));
//});