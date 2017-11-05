// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Audio = new Schema({
    title:String,
    description: String,
    downloadlink:String,
    date:{type: Date, default: Date.now}
});

module.exports = mongoose.model('audioschema', Audio);

module.exports.addAudio = function (audio, callback) {
    Audio.create(audio, callback);
}
