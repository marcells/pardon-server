module.exports.boot = function (app) {
    var debug = require('debug')('app'),
        server = require('http').Server(app),
        io = require('socket.io')(server);

    io.on('connection', function (socket) {
        socket.on('send', function (data) {
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
};