
/**
 * Module dependencies.
 */

var thunkify = require('thunkify-wrap');
var Twitter = require('simple-twitter');

/**
 * Expose `Trapper`.
 */

module.exports = Trapper;

/**
 * Initialize a new `Trapper`.
 */

function Trapper(userId, token, secret) {
  if (!(this instanceof Trapper)) return new Trapper();
  this.userId = userId;
  this.twitter = getAuthenticatedTwitter(token, secret);
}

/**
 * Add new followers to user's Dodo list.
 */

Trapper.prototype.addNewFollowersToDodo = *addNewFollowersToDodo() {
  if (!this.twitter || !this.userId) return 'User is not authenticated.';
  var newFollowers = yield getNewFollowers(this.userId, this.twitter);
  var dodoListId = yield getDodoListId(this.userId, this.twitter);
  return yield addFollowersToList(newFollowers, dodoListId, this.twitter);
};

/**
 * Private helper function to get authenticated twitter client.
 *
 * @param {String} token
 * @param {String} secret
 */

function getAuthenticatedTwitter(token, secret) {
  return thunkify(new Twitter(
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    token,
    secret
  ));
};

/**
 * Private helper function to add followers to dodo list.
 *
 * @param {Array} followers
 * @param {String} listId
 * @param {Object} twitter
 */

function *addFollowersToList(followers, listId, twitter) {
  for (var i = 0; i < followers.length; i++) {
    var dodoId = followers[i]; // Check to see if this is the right `id`.
    yield twitter.post('friendships/create', { user_id: dodoId });
    yield twitter.post('mutes/users/create', { user_id: dodoId });
    yield twitter.post('lists/members/create', { list_id: listId, user_id: dodoId });
  }
}

/**
 * Private helper function to get dodo list id.
 *
 * @param {String} userId
 * @param {Object} twitter
 *
 * @return {String}
 */

function *getDodoListId(userId, twitter) {
  var res = yield twitter.get('lists/ownerships', '?user_id=' + userId);
  var lists = JSON.parse(res).lists;
  for (var i = 0; i < lists.length; i++) {
    if (~lists[i].name.indexOf('dodo'))
      return lists[i].id;
  }
  throw 'Dodo list not found.';
}

/**
 * Private helper function to get new followers.
 *
 * @param {String} userId
 * @param {Object} twitter
 *
 * @return {Array} 100 userIds
 */

function *getNewFollowers(userId, twitter) {
  var load = '?user_id=' + userId + '&count=100';
  var res = yield twitter.get('followers/ids', load);
  return res.ids;
}
