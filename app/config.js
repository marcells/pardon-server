var path = require('path');

module.exports.port = process.env.PORT || 3000;
module.exports.viewsLocation = path.join(__dirname, 'views');
module.exports.faviconLocation = path.join(__dirname, 'public', 'favicon.ico');
module.exports.publicLocation = path.join(__dirname, 'public');
module.exports.sessionStoreLocation = path.join(__dirname, '..', 'data', 'session.nedb');
module.exports.chatStoreLocation = path.join(__dirname, '..', 'data', 'chat.nedb');