define(function(require) {
    'use strict';

    var $ = require('jquery');
    var moment = require('moment');
    var SockJS = require('sockjs');
    var _ = require('underscore');

    var Notifier = require('notifier');

    var Application = function() {
        this.lastMessage = '';
        this.notifier = new Notifier();
    };

    Application.prototype.run = function() {
        var sock = new SockJS('/log-viewer');
        sock.onopen = function() {
            console.log('open');
            sock.send('test');

            this.notifier.initialize();
        }.bind(this);
        sock.onmessage = function(e) {
            console.log(e.data);

            var messageObject = JSON.parse(e.data);

            var datetime = messageObject.datetime + ' 2014';
            var dateMoment = moment(new Date(datetime));
            dateMoment.add('h', -4);

            var message = messageObject.message;

            var level = 'DEBUG';
            if (message.indexOf(' (log level = 7)')) {
                message = message.slice(0, message.length - ' (log level = 7)'.length);
                // @todo parse out level
                var level = 'DEBUG';
            }

            if (message.indexOf('V') !== 0) {
                this.amendLastMessage({
                    message: message
                });
            } else {
                this.addMessage({
                    dateMoment: dateMoment,
                    message: message,
                    level: level
                });
            }

            // Check if the user should be notified about this message
            if (message.indexOf('Exception') !== -1) {
                this.notifier.show(message);
            }
        }.bind(this);
        sock.onclose = function() {
            console.log('close');
        };
    };

    Application.prototype.addMessage = function(options) {
        var message = options.message;
        var formattedDate = options.dateMoment.format('hh:mm:ss a');
        var level = options.level;

        var source = message.split(' ')[0];
        message = message.split(' ').slice(1).join(' ');
        source = source.slice(0, source.length - 1);

        $('#logViewer').prepend(
            '<div class="logItem">' +
                '<div class="logItem_time">' +
                    _.escape(formattedDate) +
                '</div>' +
                '<div class="logItem_level">' +
                    _.escape(level) +
                '</div>' +
                '<div class="logItem_source">' +
                    _.escape(source) +
                '</div>' +
                '<div class="logItem_message">' +
                    _.escape(message) +
                '</div>' +
            '</div>'
        );

        this.lastMessage = message;
    };

    Application.prototype.amendLastMessage = function(options) {
        var message = this.lastMessage + options.message;

        this.lastMessage = message;

        $('#logViewer').find('.logItem').eq(0).find('.logItem_message').text(message);
    };

    return Application;
});
