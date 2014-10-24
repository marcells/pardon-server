var path = require('path'),
    express = require('express'),
    passport = require('passport'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    errorhandlers = require('./errorhandlers'),
    routes = require('./routes'),
    passportConfig = require('./passport'),
    config = require('../config');

// passport config
passportConfig.configure();

module.exports.init = function (app, sessionMiddleware) {
	// express config
    app.set('port', config.port);
    app.set('views', config.viewsLocation);
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    // express middlewares
    app.use(favicon(config.faviconLocation));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(config.publicLocation));
    app.use(sessionMiddleware);
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        app.locals.user = req.user;
        next();
    });

    routes.register(app);
    errorhandlers.register(app);
};