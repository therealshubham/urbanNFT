const crypto = require('crypto');
const passport = require('passport');

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return {
    salt: salt,
    hash: genHash
  };
}

function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function loggedInAlready(req, res, next) {
  if (req.isAuthenticated() == 0) {
    return next();
  }
  res.redirect('/dashboard');
}

function errorViewHandler(message) {
  const messages = [
    "Incorrect username or password :(",
    "I'm sure you already have an account!",
    "Passwords do not match!",
    "Please fill all the fields :D"
  ];

  if((parseInt(message.code) - 1) < 0 || (parseInt(message.code) - 1) >= messages.length) {
    return {
      'data' : '',
      'display' : 'none'
    }
  }

  return {
    'data' : messages[parseInt(message.code) - 1],
    'display' : 'block'
  };
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.loggedInAlready = loggedInAlready;
module.exports.errorViewHandler = errorViewHandler;
