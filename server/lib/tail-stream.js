'use strict';

//var exec = require('ssh-exec');
var exec = require('child_process').exec;
var fs = require('fs');
var requireFrom = require('requirefrom');

var transformFactory = requireFrom('server/lib/')('line-transform').transformFactory;
var log = requireFrom('server/lib/')('logger').log;

var TailStream = function(connection) {
    this.connection = connection;
};

TailStream.prototype.run = function() {
    this.connection.on('data', this.start.bind(this));
    this.connection.on('close', this.close.bind(this));
};

TailStream.prototype.start = function() {
    var lineTransform = transformFactory();

    this.stream = exec('tail -f /var/log/syslog').stdout.pipe(lineTransform);

    /*this.stream = exec(process.env.SSH_REMOTE_COMMAND, {
        user: process.env.SSH_USER,
        host: process.env.SSH_HOST,
        key: fs.readFileSync(process.env.SSH_KEY_FILE_PATH)
    }).pipe(lineTransform);*/

    lineTransform.on('readable', function() {
        var line = true;
        while (line) {
            line = lineTransform.read();
            if (line) {
                log.debug('Sending line to client');
                log.debug(line.message);
                this.connection.write(JSON.stringify(line));
            }
        }
    }.bind(this));
};

TailStream.prototype.close = function() {
    this.stream.emit('close');
};

module.exports = {
    TailStream: TailStream
};
