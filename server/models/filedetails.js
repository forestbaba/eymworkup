var mongoose = require('mongoose');
var fileIn  = mongoose.model('details',
    {
        title: String,
        description: String,
        location:String,
        downloadlink:String,
        date:{type: Date, default: Date.now}

    });




// Book Schema
const fileSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    description:{
        type: String
    },
    location:{
        type: String,
        required: true
    },
    downloadlink:{
        type: String,
        required: true
    },
    filesize:{
        type: String,
        required: true
    },

    date:{
        type: String,
        required: true
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});

const TheFile = module.exports = mongoose.model('filedetails', fileSchema);

// Add Book
module.exports.addFile = function (fileSchema, callback) {
    TheFile.create(fileSchema, callback);
}
module.exports.deleteFile = function(id, callback)
{
    var querry = {_id: id};
    TheFile.remove(querry, callback);
}