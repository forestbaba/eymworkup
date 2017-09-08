var fileInfo = require('../models/filedetails');
var mongoose = require('mongoose');
//var f = require('/uploads/audioFile/');

var fs = require('fs-extra');
var path = require('path');
var mime = require('mime');


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/admin/admin_user');




function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
    //var fileSizeInMegabytes = fileSizeInBytes / 1000.0

    return fileSizeInMegabytes.toFixed(2)
}

module.exports.uploadAudio = function (req, res) {
    var file = req.files.file;
    var filename = req.files.file.path;
    console.log("Audio Is submitting", file)
    var date = new Date();

    var thedate = date.getDate();
    var d = new Date(year, month, day);


    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDay();

    //uploadDate = uploadDate.replace(".","")
    //uploadDate = uploadDate.replace(",","")
    //uploadDate = uploadDate.replace(":","")


    var tempPath = file.path;


    //var targetPath = path.join(__dirname,  "../../uploads/audioFile/" + uploadDate + file.name )
    //var targetPath = path.join(__dirname, "../../server/audioFile/" + year + file.name);
    //var targetPath = path.join(__dirname, "../../server/audioFile/" + year + req.body.title);
    //var targetPath = path.join(__dirname, "../../server/audioFile/" + req.body.title);

    var xem = file.name;
    xem = xem.replace(/\s+/g, '_');


    var targetPath = path.join(__dirname, "../../server/audioFile/" + xem);

    //var targetPath = path.join(__dirname, "../../server/audioFile/" + file.name);

    //   targetPath = targetPath.replace(/\s+/g,'_');


    //var savePath = "/audioFile/" + thedate + file.name;
    var savePath = "/audioFile/" + file.name;


    fs.rename(tempPath, targetPath, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('file moved');

            //var f = new fileInfo({})
            var p = req.body.param;
            var title = req.body.title;
            // title = title.replace(/\s+/g,'_');
            var desc = req.body.description;
            //var dlink = year + file.name;
            //var dlink = year + req.body.title;
            //var dlink =  req.body.title + '.mp3';
            var dlink = xem;
            var filesize= getFilesizeInBytes(targetPath) + ' MB';


            var fileIn =
            {
                title: title,
                description: desc,
                location: savePath,
                downloadlink: dlink,
                date: d,
                filesize:filesize

            }
            fileInfo.addFile(fileIn, function (err, p) {
                if (err) {
                    throw err;
                    res.json({state: 500})
                }
                else {
                    res.json(fileIn);
                    console.log("I have added it")
                    console.log("Title: " + p);
                    console.log("Title: " + req.body.description);
                }


            });

        }

    })
}


//fs.readdir(testFolder, (err, files) =>
//{
//    files.forEach(file => {
//    console.log(file);
//});

function getFileNames() {
    function getName() {
        var dirr = './uploads/audioFile/';
        var names = "";
        fs.readdir(dirr, function (err, files) {
            files.forEach(function (file) {
                //console.log(file);
                names = file;
                //return file;
            });

            return names;
        });


    }

    return getName();
}


module.exports.getAudioFiles = function (req, res) {

    fileInfo.find({})
        .sort({date: -1})
        .exec(function (error, allFiles) {
            if (error) {
                res.error(error)
            }
            else {
                res.json(allFiles)
            }
        });
}

//module.exports.downloadAudio = function (req, res)
//{
//
var filepath = path.join(__dirname + '/../audioFile/', '2017slain')
//    res.set({'Content-Type': 'audio/mpeg'});
//    var readStream = fs.createReadStream(filepath);
//    readStream.pipe(res);
//}
//
module.exports.downloadAudio = function (req, res) {

    var title = req.params.title;
    //req.params._id
    console.log('The id is: ' + title);

    //var file = __dirname +  '../../audioFile/2017Room';
    //var file = __dirname + '/../audioFile/01_Louis.mp3';
    //var file = '.' + __dirname + '/../audioFile/' + title;

    //var file = __dirname +  '../../audioFile/'+id;
    var file = __dirname + '/../audioFile/' + title;

    var filename = path.basename(file);
    var mimetype = mime.lookup('.mp3');
    //mime.extension('text/html');

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('content-type', mimetype);
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
}

module.exports.deleteFile = function (req, res) {
    var fs = require('fs');

    var title = req.params.title;
    var file = __dirname + '/../audioFile/' + title;


    var title = req.params.title;
    var fpath = req.params.location + title;
    var loc = req.params.location;
    var fp = __dirname + loc;
    var dir = __dirname + '/../audioFile/' + title;



    var id = req.params._id;

    fileInfo.deleteOne(id, function(err, file)
    {
        if(err)
        {
            throw err;
        }
        res.json(file);

        var dl = req.params.id;
    //    important remark:
    //This req.params.id comes from the angular view('audioUploadController.js')
    //    from line 182 in method deleteFile

        var myString = dl.substring(1);

        var filex = __dirname + '/../audioFile/'+dl;

        console.log('File name is: ' + dl);


        fs.unlink(filex, function(err)
        {
            if (err) throw err;
            console.log('lok...'+dl);

            console.log('successfully deleted: '+file);

        })
    });
}