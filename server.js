const builder = require('botbuilder');
const express = require('express');
const botServer = express();
const port = process.env.port || process.env.PORT || 3978;

// Helpers
const helpers = require('./src/helpers');

// Dialogue messages
const messages = require('./src/messages/messages.json');

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
    console.info('connected to main dialog');

    session.send(JSON.stringify({
      type: 'text',
      prompt: 0,
      text: 'What message would you like me to send?',
    }));
    builder.Prompts.text(session, JSON.stringify({
      type: 'buttonChoices',
      prompt: 1,
      choices: [
        { id: '1', text: 'Text' },
        { id: '2', text: 'Quick reply' },
        { id: '3', text: 'Button - choices' },
        { id: '4', text: 'Button - yes/no' },
        { id: '5', text: 'Card with text' },
        { id: '6', text: 'Card without text' },
        { id: '7', text: 'Card with buttons' },
        { id: '8', text: 'Image' },
        { id: '9', text: 'Start typing' },
        { id: '10', text: 'End typing' },
        { id: '11', text: 'Spinner' },
        { id: '12', text: 'Carousel' },
        { id: '13', text: 'Error - 500' },
        { id: '14', text: 'Error - 403' },
      ],
    }));
  },
  (session, results, next) => {
    address = session.message.address;

    if (results.response) {
      switch (results.response) {
        case '1':
          session.send(JSON.stringify(helpers.findMessage('text', messages)));
          break;
        case '2':
          session.send(JSON.stringify(helpers.findMessage('quickReply', messages)));
          break;
        case '3':
          session.send(JSON.stringify(helpers.findMessage('buttonChoices', messages)));
          break;
        case '4':
          session.send(JSON.stringify(helpers.findMessage('buttonYesNo', messages)));
          break;
        case '5':
          session.send(JSON.stringify(helpers.findMessage('cardWithText', messages)));
          break;
        case '6':
          session.send(JSON.stringify(helpers.findMessage('cardWithoutText', messages)));
          break;
        case '7':
          session.send(JSON.stringify(helpers.findMessage('cardWithButtons', messages)));
          break;
        case '8':
          session.send(JSON.stringify(helpers.findMessage('image', messages)));
          break;
        case '9':
          session.send(JSON.stringify(helpers.findMessage('startTyping', messages)));
          break;
        case '10':
          session.send(JSON.stringify(helpers.findMessage('endTyping', messages)));
          break;
        case '11':
          session.send(JSON.stringify(helpers.findMessage('spinner', messages)));
          break;
        case '12':
          session.send(JSON.stringify(helpers.findMessage('carousel', messages)));
          break;
        case '13':
          session.send(JSON.stringify(helpers.findMessage('error500', messages)));
          break;
        case '14':
          session.send(JSON.stringify(helpers.findMessage('error403', messages)));
          break;
        default:
          session.send(JSON.stringify(helpers.findMessage('text', messages)));
          break;
      }
    } else {
      return session.endDialog(`I hear birds chirping. You can restart by typing "test"`);
    }
    session.endDialog(JSON.stringify({ type: 'text', prompt: 0, text: 'Type "test" to try another message' }));
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
