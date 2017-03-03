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
  // appId: "b4356e44-0657-4928-867b-d5db9510eb3c",
  // appPassword: "tRBptiWo14uyhbqk7fYVJXZ"
});

botServer.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector, (session) => {
  session.send("Hey there! Glad to have you. Say anything to get started.");
});

let address, currentChoices;

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/', { matches: /^help/i }); // todo

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
        { id: '1', type: 'postBack', color: 'light', text: 'Text' },
        { id: '2', type: 'postBack', color: 'light', text: 'Quick reply - 3+ choices' },
        { id: '3', type: 'postBack', color: 'light', text: 'Quick reply - 2 choices' },
        { id: '4', type: 'postBack', color: 'light', text: 'Quick reply menu' },
        // { id: '4', type: 'postBack', color: 'light', text: 'Button - yes/no' },
        { id: '5', type: 'postBack', color: 'light', text: 'Card with description' },
        { id: '6', type: 'postBack', color: 'light', text: 'Card without description' },
        { id: '7', type: 'postBack', color: 'light', text: 'Card with buttons' },
        { id: '8', type: 'postBack', color: 'light', text: 'Image' },
        { id: '9', type: 'postBack', color: 'light', text: 'Typing' },
        { id: '10', type: 'postBack', color: 'light', text: 'Roster' },
        { id: '11', type: 'postBack', color: 'light', text: 'Live score card' },
        { id: '12', type: 'postBack', color: 'light', text: 'Player card' },
        { id: '13', type: 'postBack', color: 'light', text: 'Carousel' },
        // { id: '13', type: 'text', color: 'light', text: 'Error - 500' },
        // { id: '14', type: 'text', color: 'light', text: 'Error - 403' },
        { id: '15', type: 'postBack', color: 'light', text: 'Video' },
      ],
    };
    let currentChoices = quickReplyOptions.choices;

    builder.Prompts.text(session, JSON.stringify(quickReplyOptions));
  },
  (session, results, next) => {
    address = session.message.address;

    if (results.response) {
      switch (results.response) {
        case 'Text':
          session.send(JSON.stringify(helpers.findMessage('text', messages)));
          break;
        case 'Quick reply - 3+ choices':
          builder.Prompts.text(session, JSON.stringify(helpers.findMessage('quickReply', messages)));
          break;
        case 'Quick reply - 2 choices':
          session.send(JSON.stringify(helpers.findMessage('quickReplyTwoChoices', messages)));
          break;
        case 'Quick reply menu':
          session.send(JSON.stringify(helpers.findMessage('quickReplyMenu', messages)));
          break;
        case '4':
          session.send(JSON.stringify(helpers.findMessage('buttonYesNo', messages)));
          break;
        case 'Card with description':
          session.send(JSON.stringify(helpers.findMessage('cardWithDescription', messages)));
          break;
        case 'Card without description':
          session.send(JSON.stringify(helpers.findMessage('cardWithoutDescription', messages)));
          break;
        case 'Card with buttons':
          session.send(JSON.stringify(helpers.findMessage('cardWithButtons', messages)));
          break;
        case 'Image':
          session.send(JSON.stringify(helpers.findMessage('image', messages)));
          break;
        case 'Typing':
          session.send(JSON.stringify(helpers.findMessage('typing', messages)));
          break;
        case 'Roster':
          session.send(JSON.stringify(helpers.findMessage('roster', messages)));
          break;
        case 'Live score card':
          session.send(JSON.stringify(helpers.findMessage('liveScoreCard', messages)));
          break;
        case 'Player card':
          session.send(JSON.stringify(helpers.findMessage('playerCard', messages)));
          break;
        case '11':
          session.send(JSON.stringify(helpers.findMessage('spinner', messages)));
          break;
        case 'Carousel':
          session.send(JSON.stringify(helpers.findMessage('carousel', messages)));
          break;
        case '13':
          session.send(JSON.stringify(helpers.findMessage('error500', messages)));
          break;
        case '14':
          session.send(JSON.stringify(helpers.findMessage('error403', messages)));
          break;
        case 'Video':
          session.send(JSON.stringify(helpers.findMessage('video', messages)));
          break;
        default:
          session.send(JSON.stringify(helpers.findMessage('text', messages)));
          break;
      }
    } else {
      return session.endDialog(`I hear birds chirping. You can restart by typing "test"`);
    }
    session.endDialog(); // JSON.stringify({ type: 'text', prompt: 0, text: 'Say anything to try another message type' })
    // delete address.conversation;
    // session.replaceDialog('/main');
  },
]).triggerAction({ matches: /test/i });

bot.dialog('/text', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('text', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /text/i });

bot.dialog('/qr', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('quickReply', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /qr/i });

bot.dialog('/qr2', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('quickReplyTwoChoices', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /qr2/i });

bot.dialog('/qr3', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('quickReplyMenu', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /qr3/i });

bot.dialog('/card1', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('cardWithDescription', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /card1/i });

bot.dialog('/card2', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('cardWithoutDescription', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /card2/i });

bot.dialog('/card3', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('cardWithButtons', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /card3/i });

bot.dialog('/image', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('image', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /image/i });

bot.dialog('/typing', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('typing', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /typing/i });

bot.dialog('/carousel', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('carousel', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /carousel/i });

bot.dialog('/video', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('video', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /video/i });

bot.dialog('/about', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('persistentMenu', messages).about));
    session.endDialog();
  },
]).triggerAction({ matches: /about/i });

bot.dialog('/roster', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify({ type: 'text', prompt: 0, text: 'Pick a player to get started!' }));
    setTimeout(() => {
      session.send(JSON.stringify(helpers.findMessage('roster', messages)));
      session.endDialog();
    }, 2000);
  },
]).triggerAction({ matches: /roster/i });

bot.dialog('/liveScoreCard', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('liveScoreCard', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /(live|game|score).*/i });

bot.dialog('/playerCard', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify(helpers.findMessage('playerCard', messages)));
    session.endDialog();
  },
]).triggerAction({ matches: /(collison|player).*/i });

bot.dialog('/nbaStart', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify({ 
      type: 'text',
      prompt: 0,
      text: 'Ask me about your favorite player or team'
    }));
    session.endDialog();
  },
]).triggerAction({ matches: /(nbastart|start).*/i });

bot.dialog('/nbaResponsePoints', [
  (session, args, next) => {
    session.clearDialogStack();
    session.send(JSON.stringify({ 
      type: 'text',
      prompt: 0,
      text: 'Kevin Durant scored 22 points against the Kings last night'
    }));
    session.endDialog();
  },
]).triggerAction({ matches: /(points).*/i });

bot.dialog('/themeChanger', [
  (session, args, next) => {
    console.info('connected to theme changer dialog');

    const textPrompt = {
      type: 'text',
      text: `What's your favorite color?`,
      prompt: 0,
    };

    builder.Prompts.text(session, JSON.stringify(textPrompt));
  },
  (session, results, next) => {
    if (results.response) {
      session.endDialog(JSON.stringify({
        type: 'globalAction',
        action: {
          type: 'setCustomColor',
          color: results.response,
        },
        prompt: '0',
        text: `${results.response.charAt(0).toUpperCase() + results.response.slice(1)} coming right up!`,
      }));
    } else {
      return session.endDialog(`I hear birds chirping. You can restart by typing "test"`);
    }
  },
]).triggerAction({ matches: /color/i });

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
