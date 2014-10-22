var routes = require('../routes/index');

module.exports.register = function (app, passport) {
    app.use('/', routes);
    
    app.post('/login',
        passport.authenticate(
            'local', { 
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true })
    );
};