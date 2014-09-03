'use strict';

var stream = require('stream');

function transformFactory() {
    /* jscs:disable disallowDanglingUnderscores */

    var lineTransform = new stream.Transform({
        objectMode: true
    });

    lineTransform._transform = function(chunk, encoding, done) {
        var data = chunk.toString();
        if (this._lastLineData) {
            data = this._lastLineData + data;
        }

        var lines = data.split('\n');
        this._lastLineData = lines.splice(lines.length - 1, 1)[0];

        lines.forEach(function(line) {
            if (line.indexOf('apache') !== -1) {
                var datetime = line.split(' ').slice(0, 4).join(' ');
                var message = line.split(' ').slice(7).join(' ');
                this.push({
                    datetime: datetime,
                    message: message
                });
            }
        }.bind(this));
        done();
    };

    lineTransform._flush = function(done) {
        if (this._lastLineData) {
            this.push(this._lastLineData);
        }
        this._lastLineData = null;
        done();
    };

    return lineTransform;
}

module.exports = {
    transformFactory: transformFactory
};
