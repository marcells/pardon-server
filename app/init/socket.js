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
            socket.user = socket.request.session.passport.user;

            socket.join('global');
        } else {
            socket.isAuthenticated = false;
            socket.user = undefined;

            socket.leave('global');
        }

        next();
    });

    function getUsersInGlobalRoom() {
        var userNamesInGlobalRoom = [];

        var clientsInGlobalRoom = io.sockets.adapter.rooms['global'];
        for(var clientId in clientsInGlobalRoom) {
            var socket = io.sockets.connected[clientId];
            userNamesInGlobalRoom.push(socket.user.userName);
        }

        return userNamesInGlobalRoom;
    }

    // messages
    io.on('connection', function (socket) {
        if (socket.isAuthenticated) {
            // load all chat messages
            chat.getLatestMessages(function (err, latestMessages) {
                socket.emit('messagesLoaded', {
                    messages: latestMessages
                });
            });

            io.to('global').emit('usersLoaded', getUsersInGlobalRoom());
        }

        socket.on('send', function (data) {
            if (socket.isAuthenticated) {
                var outgoing = {
                    date: new Date(),
                    user: socket.user.userName,
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

        socket.on('disconnect', function () {
            io.to('global').emit('usersLoaded', getUsersInGlobalRoom());
        });
    });
};