var errors = require('./errors');
var socket = require('./socket');

var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    usersRepo = require('../users');
var session = require('express-session');
var flash = require('connect-flash');
var NeDBSessionStore = require('../services/nedb-session-store')(session);

var routes = require('../routes/index');

module.exports.boot = function (app) {
    app.set('port', process.env.PORT || 3000);
    app.locals.pretty = true;

    // view engine setup
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'jade');

    app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '..', 'public')));




    app.use(session({
        store: new NeDBSessionStore({
            filename: path.join(__dirname, '..', '..', 'data', 'session.nedb')
        }),
        secret: 'keyboard cat',
        saveUninitialized: true,
        resave: true
    }));

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        app.locals.user = req.user;
        next();
    });

    app.use('/', routes);


    /***********************************************/

    // Configuration
    passport.use(new LocalStrategy(
        function(username, password, done) {
            usersRepo.findOne(username, function(err, user) {
                if (err) { return done(err); }

                if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
                }

                if (!usersRepo.validPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    // Serialize/Deserialize
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Route
    app.post('/login',
        passport.authenticate(
            'local', { 
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true })
    );
    /***********************************************/

    errors.boot(app);
    socket.boot(app);
};