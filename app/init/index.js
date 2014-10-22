var path = require('path'),
    session = require('express-session'),
    socket = require('./socket'),
    express = require('./express'),
    NeDBSessionStore = require('../services/nedb-session-store')(session);

// session config
var sessionMiddleware = session({
    store: new NeDBSessionStore({
        filename: path.join(__dirname, '..', '..', 'data', 'session.nedb')
    }),
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
});

module.exports.express = function (app) {
    express.boot(app, sessionMiddleware);
};

module.exports.socket = function (server) {
    socket.boot(server, sessionMiddleware);
};