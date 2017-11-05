// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    name:String,
    username: String,
    email:String,
    password: String
});

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('adminschema', User);