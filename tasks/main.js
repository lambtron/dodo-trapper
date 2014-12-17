
/**
 * Module dependencies.
 */

var Trapper = require('../lib/trapper');
var Users = require('../lib/users');
var co = require('co');

/**
 * Main function.
 */

function *main() {
  var users = yield Users.find({});
  for (var i = 0; i < users.length; i++) {
    var trapper = new Trapper(users[i].user_id, users[i].token, users[i].secret);
    yield trapper.addNewFollowersToDodo();
  }
}

/**
 * Expose `main`.
 */

module.exports = co.wrap(main);
