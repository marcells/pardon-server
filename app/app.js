var app = require('express')(),
    server = require('http').Server(app),
    debug = require('debug')('app'),
    init = require('./init');

init.express(app);
init.socket(server);

server.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});