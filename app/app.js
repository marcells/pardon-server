var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    usersRepo = require('./users');
var session = require('express-session');
var flash = require('connect-flash');
var NeDBSessionStore = require('./services/nedb-session-store')(session);

var routes = require('./routes/index');

var app = express();

app.locals.pretty = true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: new NeDBSessionStore({
        filename: path.join(__dirname, '..', 'data', 'session.nedb')
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var debug = require('debug')('app');

app.set('port', process.env.PORT || 3000);

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('send', function (data) {
        console.log(app.locals.userName);
        if (app.locals.user && app.locals.user.userName)
        {
            var outgoing = {
                user: app.locals.user.userName,
                message: data.message
            };

            io.emit('receive', outgoing);
        } else {
            socket.emit('receive', {
                user: '[UNKNOWN]',
                message: '[not sent cause you were not logged in]'
            });
        }
    });
});

server.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});