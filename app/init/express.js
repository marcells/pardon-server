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
    passportConfig = require('./passport');

// passport config
passportConfig.boot(passport);

module.exports.boot = function (app, sessionMiddleware) {
	// express config
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    // express middlewares
    app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use(sessionMiddleware);
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        app.locals.user = req.user;
        next();
    });

    routes.register(app, passport);
    errorhandlers.register(app);
};