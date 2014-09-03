define(function(require) {
    'use strict';

    var Notifier = function() {
        this.enabled = false;
    };

    Notifier.prototype.initialize = function() {
        // Wait 5 seconds for the old buffer to load before notifying user
        setTimeout(this.enable.bind(this), 5000);
    };

    Notifier.prototype.enable = function() {
        this.enabled = true;
    };

    Notifier.prototype.show = function(message) {
        if (!this.enabled) {
            return;
        }
        var notification = new Notification(message, {tag: Math.floor(+new Date() / 1000)});
    };

    return Notifier;
});
