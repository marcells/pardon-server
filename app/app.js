var bootstrap = require('./init/bootstrap'),
    express = require('express'),
    app = express();

bootstrap.boot(app);