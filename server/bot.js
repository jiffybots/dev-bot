const builder = require('botbuilder');
const express = require('express');
const botServer = express();
const port = process.env.port || process.env.PORT || 3978;
const toString = require('../node_modules/ramda/src/toString');

// Helpers
const helpers = require('./helpers');

// Dialogue messages
const messages = require('./messages/messages.json');

//=========================================================
// Create chat bot
//=========================================================

const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
  // appId: "321b1ef0-b31e-474b-bc0b-4dffcea4c199",
  // appPassword: "M3a2PkFtJNeBnquU6M2FC3y"
});

botServer.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector);
let address;

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i }); // todo

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [
  (session, args, next) => {
    builder.Prompts.choice(session, 'What message would you like me to send?', `Text|Text with buttons|Button - choices|Button - accept|Button - cancel|Card with text|Card without text|Card with buttons|Image|Start typing|End typing|Spinner|Carousel|Error - 500`, 
    { listStyle: builder.ListStyle.button });
  },
  (session, results, next) => {
    address = session.message.address;

    if (results.response) {
      switch (results.response.entity) {
        case 'Text':
          session.send(toString(helpers.findMessage('text', messages)));
          break;
        case 'Text with buttons':
          session.send(toString(helpers.findMessage('textWithButtons', messages)));
          break;
        case 'Button - choices':
          session.send(toString(helpers.findMessage('buttonChoices', messages)));
          break;
        case 'Button - accept':
          session.send(toString(helpers.findMessage('buttonAccept', messages)));
          break;
        case 'Button - cancel':
          session.send(toString(helpers.findMessage('buttonCancel', messages)));
          break;
        case 'Card with text':
          session.send(toString(helpers.findMessage('cardWithText', messages)));
          break;
        case 'Card without text':
          session.send(toString(helpers.findMessage('cardWithoutText', messages)));
          break;
        case 'Card with buttons':
          session.send(toString(helpers.findMessage('cardWitButtons', messages)));
          break;
        case 'Image':
          session.send(toString(helpers.findMessage('image', messages)));
          break;
        case 'Start typing':
          session.send(toString(helpers.findMessage('startTyping', messages)));
          break;
        case 'End typing':
          session.send(toString(helpers.findMessage('endTyping', messages)));
          break;
        case 'Spinner':
          session.send(toString(helpers.findMessage('spinner', messages)));
          break;
        case 'Carousel':
          session.send(toString(helpers.findMessage('carousel', messages)));
          break;
        case 'Error - 500':
          session.send(toString(helpers.findMessage('error500', messages)));
          break;
        default:
          session.send(toString(helpers.findMessage('text', messages)));
          break;
      }
    } else {
      return session.endDialog(`I hear birds chirping. You can restart by typing "test"`);
    }
    session.endDialog(`Type "test" to try another message`);
    // delete address.conversation;
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