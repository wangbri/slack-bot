'use strict';

 var util = require('util');
// var path = require('path');
// var fs = require('fs');
// var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var SupportBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'SupportBot';
    // this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'SupportBot.db');

    this.user = null;
    // this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(SupportBot, Bot);

module.exports = SupportBot;


SupportBot.prototype.run = function() {
	SupportBot.super_.call(this, this.settings);

	this.on('start', this._onStart);
	this.on('message', this._onMessage);
};

SupportBot.prototype._onStart = function() {
	this._loadBotUser();
	this._welcomeMessage();
	// this._connectDb();
	// this._firstRunCheck();
	console.log('starting up..');

};

SupportBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

// database

// SupportBot.prototype._connectDb = function () {
//     if (!fs.existsSync(this.dbPath)) {
//         console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
//         process.exit(1);
//     }

//     this.db = new SQLite.Database(this.dbPath);
// };

// SupportBot.prototype._firstRunCheck = function () {
//     var self = this;
//     self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
//         if (err) {
//             return console.error('DATABASE ERROR:', err);
//         }

//         var currentTime = (new Date()).toJSON();

//         // this is a first run
//         if (!record) {
//             self._welcomeMessage();
//             return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
//         }

//         // updates with new last running time
//         self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
//     });
// };

SupportBot.prototype._welcomeMessage = function () {
	console.log(this.channels[0].name);
    this.postMessageToChannel(this.channels[0].name, 'Hi guys, need help?. Just say `' + this.name + '` to invoke me!',
        {as_user: true});
};


// messaging

SupportBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromSupportBot(message) &&
        this._isMentioningSupportBot(message)
    ) {
        this._reply(message);
    }
};

SupportBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

SupportBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

SupportBot.prototype._isFromSupportBot = function (message) {
    return message.user === this.user.id;
};

SupportBot.prototype._isMentioningSupportBot = function (message) {
    return message.text.toLowerCase().indexOf('support bot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

SupportBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

SupportBot.prototype._reply = function (message) {
	var channel = self._getChannelById(message.channel)
	this.postMessageToChannel(channel.name, "What can I help you with?", {as_user: true})
}