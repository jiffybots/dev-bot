const find = require('../node_modules/ramda/src/find');
const propEq = require('../node_modules/ramda/src/propEq');

const findMessage = (type, messages) => find(x => x.type === type, messages);

module.exports = {
  propEq,
  find,
  findMessage,
};
