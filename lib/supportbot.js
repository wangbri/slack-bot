'use strict';

var { WebClient } = require('@slack/client')
var web;

var SupportBot = function Constructor(token) {
    this.token = token;
};

SupportBot.postMessage = function(id, message) {
    // See: https://api.slack.com/methods/chat.postMessage
    web.chat.postMessage({ channel: id, text: message })
      .then((res) => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
};


SupportBot.run = function() {
    web = new WebClient(this.token);
	this._onStart();
};

SupportBot._onStart = function() {
	this._loadUsers();
	this._welcomeMessage();
	// this._connectDb();
	// this._firstRunCheck();
	console.log('starting up..');

};

SupportBot._loadUsers = function() {
    web.users.list()
      .then((res) => {
        // `res` contains information about the channels
        this.users = res.members;
        res.members.forEach(c => console.log(c.name));
      })
      .catch(console.error);
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

SupportBot._welcomeMessage = function() {
	console.log(this.channels[0].id);
    this.postMessage(this.channels[0].id, 'Hi guys, need help? Just say `' + this.name + '` to invoke me!');
};


// messaging

SupportBot._onMessage = function(message) {
    console.log('heard message' + message);

    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromSupportBot(message) &&
        this._isMentioningSupportBot(message)
    ) {
        this._reply(message);
    }
};

SupportBot._isChatMessage = function(message) {
    return message.type === 'message' && Boolean(message.text);
};

SupportBot._isChannelConversation = function(message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

SupportBot._isFromSupportBot = function(message) {
    for (var prop in message) {
        console.log(prop);
    }

    return message.username === this.user.id;
};

SupportBot._isMentioningSupportBot = function(message) {
    return message.text.toLowerCase().indexOf('support bot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

SupportBot._getChannelById = function(channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

SupportBot._reply = function(message) {
	var channel = self._getChannelById(message.channel)
	this.postMessage(channel.id, "What can I help you with?", {as_user: true})
}