var socketIo = require('socket.io'),
    chat = require('../repos/chat.js');

module.exports.init = function (server, sessionMiddleware) {
    var io = socketIo(server);

    // middlewares
    io.use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });

    io.use(function (socket, next) {
        if (socket.request.session 
            && socket.request.session.passport 
            && socket.request.session.passport.user) {
            socket.isAuthenticated = true;
            socket.request.user = socket.request.session.passport.user;

            socket.join('global');
        } else {
            socket.isAuthenticated = false;
            socket.request.user = undefined;

            socket.leave('global');
        }

        next();
    });

    // messages
    io.on('connection', function (socket) {
        if (socket.isAuthenticated) {
            chat.getLatestMessages(function (err, latestMessages) {
                socket.emit('messagesLoaded', {
                    messages: latestMessages
                });
            });
        }

        socket.on('send', function (data) {
            if (socket.isAuthenticated) {
                var outgoing = {
                    date: new Date(),
                    user: socket.request.user.userName,
                    message: data.message
                };

                chat.addMessage(outgoing, function (err, message) {
                    if(err) {
                        socket.emit('errorOccured', {
                            date: new Date()
                        });
                    } else {
                        io.to('global').emit('received', message);
                    }
                });
            } else {
                socket.emit('notLoggedIn', {
                    date: new Date()
                });
            }
        });
    });
};