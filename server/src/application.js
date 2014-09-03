'use strict';

var express = require('express');
var http = require('http');
var requireFrom = require('requirefrom');
var sockjs = require('sockjs');

var log = requireFrom('server/lib/')('logger').log;
var TailStream = requireFrom('server/lib/')('tail-stream').TailStream;

var Application = function(options) {
    this.app = express();

    // Use static middleware
    this.app.use(express.static(__dirname + '/../../httpdocs'));
    this.app.use('/components', express.static(__dirname + '/../../bower_components'));
};

Application.prototype.run = function() {
    var server = http.createServer(this.app);

    var echo = sockjs.createServer();
    echo.on('connection', function(connection) {
        var tailStream = new TailStream(connection);
        tailStream.run();
    });
    echo.installHandlers(server, {prefix: '/log-viewer'});

    // Start listening for HTTP requests
    var port = process.env.SERVER_PORT;
    server.listen(port);
    log.info('Listening on port ' + port);
};

module.exports = {
    Application: Application
};
