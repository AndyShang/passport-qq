/**
 * Module dependencies.
 */
 var util = require('util')
 , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
 , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The weibo authentication strategy authenticates requests by delegating to
 * weibo using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your weibo application's app key
 *   - `clientSecret`  your weibo application's app secret
 *   - `callbackURL`   URL to which weibo will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new WeiboStrategy({
 *         clientID: 'app key',
 *         clientSecret: 'app secret'
 *         callbackURL: 'https://www.example.net/auth/weibo/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
 function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://graph.qq.com/oauth2.0/authorize';
  options.tokenURL = options.tokenURL || 'https://graph.qq.com/oauth2.0/token';
  options.scopeSeparator = options.scopeSeparator || ',';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'qq';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
 util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from weibo.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `weibo`
 *   - `id`               qq openid
 *   - `nickname`         qq nickname
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var oauth2 = this._oauth2;
  console.log(accessToken);
  oauth2.get('https://graph.qq.com/oauth2.0/me', accessToken, function (err, result, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    result = JSON.parse(result.substring(result.indexOf('{'), 
                                         result.lastIndexOf('}')+1));
    oauth2.get('https://graph.qq.com/user/get_user_info?openid=' + result.openid, accessToken, function (err, body, res) {
      try {
        var json = JSON.parse(body);

        var profile = { provider: 'qq' };
        profile.id = result.openid;
        profile.nickname = json.nickname;
        profile._raw = body;
        profile._json = json;
        done(null, profile);
      } catch(e) {
        done(e);
      }
    });
  });
}


/**
 * Expose `Strategy`.
 */
 module.exports = Strategy;
