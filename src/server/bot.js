const builder = require('botbuilder');
const express = require('express');
const botServer = express();
const port = process.env.PORT || 3978;
const find = require('../../node_modules/ramda/src/find');
const forEach = require('../../node_modules/ramda/src/forEach');

// Helpers
const helpers = require('./helpers');

// Dialogue messages


//=========================================================
// Create chat bot
//=========================================================

const connector = new builder.ChatConnector({
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
  appId: "321b1ef0-b31e-474b-bc0b-4dffcea4c199",
  appPassword: "M3a2PkFtJNeBnquU6M2FC3y"
});

botServer.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector, (session) => {
    session.send("Hello, I'm the test bot!");
    builder.Prompts.choice(session, 'What message would you like me to send?', 'Text|Text with buttons|ButtonChoice|ButtonAccept|ButtonDeny|CardWithText|CardWithoutText|CardWithButtons|Image|Typing|Spinner|Carousel', { listStyle: builder.ListStyle.button });
});


//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

//=========================================================
// Bots Dialogs
//=========================================================


// Listen on port 3978
botServer.listen(port, (error) => {
  if (error) {
    console.error(error.stack);
  } else {
    console.info('==> Bot listening on port %s.', port);
  }
});

module.exports = {
  bot,
};