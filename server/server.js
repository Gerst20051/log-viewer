'use strict';

var requireFrom = require('requirefrom');

var Application = requireFrom('server/src/')('application').Application;

var application = new Application();
application.run();
