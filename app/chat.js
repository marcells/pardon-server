var path = require('path'),
    Datastore = require('nedb'),
    db = new Datastore({
        filename: path.join(__dirname, '..', 'data', 'chat.nedb'),
        autoload: true 
    });

module.exports.addMessage = function (message, callback) {
    var doc = {
        date: message.date,
        user: message.user,
        message: message.message
    };

    db.insert(doc, callback);
};

module.exports.getLatestMessages = function (callback) {
    db
    .find({})
    .sort({ date: 1 })
    .exec(callback);
};