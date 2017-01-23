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
let address, currentChoices;

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

    const quickReplyOptions = {
      type: 'quickReply',
      text: 'What message would you like me to send?',
      prompt: 1,
      choices: [
        { id: '1', type: 'text', color: 'light', text: 'Text' },
        { id: '2', type: 'text', color: 'light', text: 'Quick reply' },
        { id: '3', type: 'text', color: 'light', text: 'Quick reply with image' },
        { id: '4', type: 'text', color: 'light', text: 'Button - yes/no' },
        { id: '5', type: 'text', color: 'light', text: 'Card with text' },
        { id: '6', type: 'text', color: 'light', text: 'Card without text' },
        { id: '7', type: 'text', color: 'light', text: 'Card with buttons' },
        { id: '8', type: 'text', color: 'light', text: 'Image' },
        { id: '9', type: 'text', color: 'light', text: 'Start typing' },
        { id: '10', type: 'text', color: 'light', text: 'End typing' },
        { id: '11', type: 'text', color: 'light', text: 'Spinner' },
        { id: '12', type: 'text', color: 'light', text: 'Carousel' },
        { id: '13', type: 'text', color: 'light', text: 'Error - 500' },
        { id: '14', type: 'text', color: 'light', text: 'Error - 403' },
      ],
    };
    let currentChoices = quickReplyOptions.choices;

    builder.Prompts.text(session, JSON.stringify(quickReplyOptions));
  },
  (session, results, next) => {
    address = session.message.address;

    if (results.response) {
      switch (results.response) {
        case '1':
          session.send(JSON.stringify(helpers.findMessage('text', messages)));
          break;
        case '2':
          builder.Prompts.text(session, JSON.stringify(helpers.findMessage('quickReply', messages)));
          break;
        case '3':
          session.send(JSON.stringify(helpers.findMessage('quickReplyWithImage', messages)));
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
    // session.replaceDialog('/main');
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
