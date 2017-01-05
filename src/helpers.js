const find = require('../node_modules/ramda/src/find');

const findMessage = (type, messages) => find(x => x.type === type, messages);

module.exports = {
  findMessage,
};