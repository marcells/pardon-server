var socketIo = require('socket.io');

module.exports.init = function (server, sessionMiddleware) {
    var io = socketIo(server);

    // middlewares
    io.use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });

    io.use(function (socket, next) {
        if (socket.request.session && socket.request.session.passport) {
            socket.request.user = socket.request.session.passport.user;
        }

        next();
    });

    // messages
    io.on('connection', function (socket) {
        socket.on('send', function (data) {
            if (socket.request.user && socket.request.user.userName)
            {
                var outgoing = {
                    user: socket.request.user.userName,
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
};