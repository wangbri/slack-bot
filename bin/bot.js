'use strict';

var SupportBot = require('../lib/supportbot');

var token = 'xoxb-268842301509-368712201463-u0V8vR8bH9XSq18FX3rvswJs';
var name = process.env.BOT_NAME;

var supportbot = new SupportBot({
    token: token,
    name: name
});

supportbot.run();