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

const bot = new builder.UniversalBot(connector);


//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [
  (session, args, next) => {
    builder.Prompts.choice(session, 'What message would you like me to send?', `Text|Text with buttons|Button - choices|Button - accept|Button - cancel|Card with text|Card without text|Card with buttons|Image|Typing|Spinner|Carousel`, 
    { listStyle: builder.ListStyle.button });
  },
  (session, results, next) => {
    if (results.response) {
      switch (results.response.entity) {
        case 'Text':
          session.send('Text');
          break;
        case 'Text with buttons':
          session.send('Text with buttons');
          break;
        case 'Button - choices':
          session.send('Button - choices');
          break;
        case 'Button - accept':
          session.send('Button - accept');
          break;
        case 'Button - cancel':
          session.send('Button - cancel');
          break;
        case 'Button - cancel':
          session.send('Button - cancel');
          break;
        case 'Card with text':
          session.send('Card with text');
          break;
        case 'Card without text':
          session.send('Card without text');
          break;
        case 'Card with buttons':
          session.send('Card with buttons');
          break;
        case 'Image':
          session.send('Image');
          break;
        case 'Typing':
          session.send('Typing');
          break;
        case 'Spinner':
          session.send('Spinner');
          break;
        case 'Carousel':
          session.send('Carousel');
          break;
      }
    } else {
      return session.endDialog(`I hear birds chirping. You can restart by typing "test"`);
    }
    session.endDialog(`Type "test" for another message type`);
  },
]).triggerAction({ matches: /test/i });


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