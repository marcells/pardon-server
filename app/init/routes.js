var passport = require('passport'),
	routes = require('../routes/index');

module.exports.register = function (app) {
    app.use('/', routes);
    
    app.post('/login',
        passport.authenticate(
            'local', { 
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true })
    );
};