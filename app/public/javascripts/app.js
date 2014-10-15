$(function() {
    var socket = io.connect('http://localhost:3000');
        socket.on('recieve', function (data) {
            console.log(data);
        });

    var message = $('#message');

    message.keydown(function(event) {
        if(event.keyCode === 13) {
            socket.emit('send', { message: message.val() });
            message.val('');
            return false;
        }
    });
});