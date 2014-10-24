var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    usersRepo = require('../repos/users');

module.exports.configure = function () {
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
};